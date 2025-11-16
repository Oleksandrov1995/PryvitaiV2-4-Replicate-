const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const UsedEmail = require('../models/UsedEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const WELCOME_BONUS = 100; // Початковий бонус для нових користувачів

// Функція для перевірки та нарахування початкового бонусу
const checkAndGrantWelcomeBonus = async (user, email, registrationType, ipAddress = null) => {
  try {
    // Перевіряємо чи вже отримував бонус цей користувач
    if (user.hasReceivedWelcomeBonus) {
      return false;
    }

    // Перевіряємо чи використовувався цей email раніше
    const existingEmail = await UsedEmail.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      console.log(`Email ${email} вже використовувався для отримання бонусу`);
      return false;
    }

    // Нараховуємо бонус
    user.coins += WELCOME_BONUS;
    user.hasReceivedWelcomeBonus = true;
    await user.save();

    // Зберігаємо email як використаний
    const usedEmail = new UsedEmail({
      email: email.toLowerCase(),
      registrationType,
      ipAddress
    });
    await usedEmail.save();

    console.log(`Нараховано ${WELCOME_BONUS} монет користувачу ${email}`);
    return true;
  } catch (error) {
    console.error('Помилка при нарахуванні початкового бонусу:', error);
    return false;
  }
};

// Google OAuth endpoint
exports.googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Не передано credential.' });
  }
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    let user = await User.findOne({ email });
    let isNewUser = false;
    
    if (!user) {
      // Створюємо користувача через Google
      user = new User({ name, email, password: '' });
      await user.save();
      isNewUser = true;
    }

    // Перевіряємо та нараховуємо початковий бонус
    if (isNewUser || !user.hasReceivedWelcomeBonus) {
      await checkAndGrantWelcomeBonus(user, email, 'google', ipAddress);
    }

    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '35d' });
    res.json({ message: 'Вхід через Google успішний!', token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Помилка Google авторизації.' });
  }
};

// Повернути профіль поточного користувача
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email phone avatar galleryImage tariff coins');
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    res.json({ user });
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Відновлення пароля: приймає email, надсилає email з посиланням
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email обовʼязковий.' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Користувача з таким email не знайдено.' });
  }
  // Генеруємо токен для відновлення пароля (діє 15 хвилин)
  const resetToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  // Налаштування транспорту (Gmail, Ukr.net, Outlook тощо)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Відновлення пароля Pryvitai',
      html: `<p>Для відновлення пароля перейдіть за <a href="${resetLink}">цим посиланням</a>.<br>Посилання дійсне 15 хвилин.</p>`
    });
    res.json({ message: 'Інструкції для відновлення пароля надіслані на email.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Не вдалося надіслати email.' });
  }
};

// Зміна пароля за токеном
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Токен і новий пароль обовʼязкові.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ error: 'Користувача не знайдено.' });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Пароль успішно змінено!' });
  } catch (err) {
    return res.status(400).json({ error: 'Невірний або прострочений токен.' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Всі поля обовʼязкові.' });
  }
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Користувач з таким email вже існує.' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const ipAddress = req.ip || req.connection.remoteAddress;
  
  // Створюємо користувача
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  // Перевіряємо та нараховуємо початковий бонус
  await checkAndGrantWelcomeBonus(user, email, 'regular', ipAddress);
  
  // Генеруємо токен (включаємо name для відображення на фронтенді)
  const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '35d' });
  res.json({ message: 'Реєстрація успішна!', token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Користувача не знайдено.' });
  }
  // Для користувачів Google пароль може бути порожнім
  if (!user.password) {
    return res.status(400).json({ error: 'Для цього акаунту не встановлено пароль. Спробуйте вхід через Google.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Невірний пароль.' });
  }
  // Генеруємо токен
  const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '35d' });
  res.json({ message: 'Вхід успішний!', token });
};

// Оновлення телефону
exports.updatePhone = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Номер телефону обовʼязковий.' });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    user.phone = phone;
    await user.save();
    res.json({ message: 'Телефон оновлено.' });
  } catch (err) {
    console.error('update-phone error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Оновлення аватара
exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  if (!avatar) return res.status(400).json({ error: 'Avatar URL обовʼязковий.' });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    user.avatar = avatar;
    await user.save();
    res.json({ message: 'Аватар оновлено.' });
  } catch (err) {
    console.error('update-avatar error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Зміна пароля (поточний + новий)
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Потрібні обидва паролі.' });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    // Якщо пароль порожній (наприклад, Google-акаунт), не можна перевірити
    if (!user.password) return res.status(400).json({ error: 'Пароль не встановлено для цього акаунту.' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Поточний пароль невірний.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Пароль успішно змінено.' });
  } catch (err) {
    console.error('change-password error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Видалення акаунта
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Акаунт видалено.' });
  } catch (err) {
    console.error('delete-account error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Додавання зображення до галереї користувача
exports.addGalleryImage = async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'URL зображення є обов\'язковим.' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено.' });
    }

    // Додаємо нове посилання в масив
    user.galleryImage.push(imageUrl);
    await user.save();

    res.status(201).json({ message: 'Зображення успішно додано до галереї.' });
  } catch (err) {
    console.error('Помилка додавання до галереї:', err);
    res.status(500).json({ error: 'Помилка сервера при додаванні зображення.' });
  }
};

// Отримання галереї поточного користувача
exports.getGallery = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('galleryImage');
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено.' });
    }
    
    // Форматуємо дані, щоб вони відповідали очікуванням фронтенд-компонента
    const formattedGallery = user.galleryImage.map((url, index) => ({
      id: `${req.user.userId}_${index}`, // Створюємо унікальний ключ
      url: url,
      createdBy: req.user.userId
    }));

    res.json(formattedGallery);
  } catch (err) {
    console.error('Помилка отримання галереї:', err);
    res.status(500).json({ error: 'Помилка сервера при отриманні галереї.' });
  }
};

// Видалення зображення з галереї користувача
exports.deleteGalleryImage = async (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Невірний індекс зображення.' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено.' });
    }

    if (index < 0 || index >= user.galleryImage.length) {
      return res.status(400).json({ error: 'Індекс поза межами масиву.' });
    }

    // Видаляємо зображення
    const removedImage = user.galleryImage.splice(index, 1);
    await user.save();

    res.json({ message: 'Зображення видалено з галереї.', removedImage });
  } catch (err) {
    console.error('Помилка видалення з галереї:', err);
    res.status(500).json({ error: 'Помилка сервера при видаленні зображення.' });
  }
};

// Оновлення тарифу користувача
exports.updateTariff = async (req, res) => {
  const { tariff, coins } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    
    if (tariff !== undefined) user.tariff = tariff;
    if (coins !== undefined) user.coins = coins;
    
    await user.save();
    res.json({ message: 'Тарифні дані оновлено.', user: {
      tariff: user.tariff,
      coins: user.coins
    }});
  } catch (err) {
    console.error('update-tariff error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Зменшення кількості монет
exports.decrementCoins = async (req, res) => {
  const { amount } = req.body; // кількість монет для зняття
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Невірна кількість монет.' });
    }
    
    if (user.coins < amount) {
      return res.status(400).json({ error: 'Недостатньо монет.' });
    }
    
    user.coins -= amount;
    await user.save();
    
    res.json({ message: `Знято ${amount} монет.`, user: {
      tariff: user.tariff,
      coins: user.coins
    }});
  } catch (err) {
    console.error('decrement-coins error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

// Додавання монет
exports.addCoins = async (req, res) => {
  const { amount } = req.body; // кількість монет для додавання
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Невірна кількість монет.' });
    }
    
    user.coins += amount;
    await user.save();
    
    res.json({ message: `Додано ${amount} монет.`, user: {
      tariff: user.tariff,
      coins: user.coins
    }});
  } catch (err) {
    console.error('add-coins error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
};

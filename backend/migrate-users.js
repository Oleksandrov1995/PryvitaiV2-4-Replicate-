const mongoose = require('mongoose');
const User = require('./models/User');
const UsedEmail = require('./models/UsedEmail');
require('dotenv').config();

// Скрипт для міграції існуючих користувачів
const migrateExistingUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Підключено до MongoDB для міграції');

    // Знаходимо всіх користувачів, які мають > 0 монет але не мають поля hasReceivedWelcomeBonus
    const existingUsers = await User.find({ 
      coins: { $gt: 0 },
      hasReceivedWelcomeBonus: { $exists: false }
    });

    console.log(`Знайдено ${existingUsers.length} користувачів для міграції`);

    for (const user of existingUsers) {
      // Позначаємо що вони вже отримали бонус
      user.hasReceivedWelcomeBonus = true;
      await user.save();

      // Додаємо їх email до списку використаних
      try {
        const usedEmail = new UsedEmail({
          email: user.email.toLowerCase(),
          registrationType: 'regular', // припускаємо regular для існуючих
          registrationDate: user.createdAt || new Date()
        });
        await usedEmail.save();
        console.log(`Мігровано користувача: ${user.email}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Email ${user.email} вже існує в UsedEmail`);
        } else {
          console.error(`Помилка при збереженні UsedEmail для ${user.email}:`, error);
        }
      }
    }

    console.log('Міграція завершена');
    process.exit(0);
  } catch (error) {
    console.error('Помилка міграції:', error);
    process.exit(1);
  }
};

migrateExistingUsers();
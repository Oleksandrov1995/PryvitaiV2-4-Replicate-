const User = require('../models/User');

// Додати нову дату події
const addEventDate = async (req, res) => {
  try {
    const userId = req.user.userId; // Отримуємо з authMiddleware
    const { 
      date, 
      formattedDate, 
      isReminderEnabled, 
      gender, 
      age, 
      name, 
      person, 
      greetingSubject 
    } = req.body;

    // Валідація обов'язкових полів - тільки ім'я та з чим вітаємо
    if (!name || !greetingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Поля "Ім\'я" та "З чим вітаємо" є обов\'язковими'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }

    // Створення нової дати події
    const eventDate = {
      date,
      formattedDate,
      isReminderEnabled: isReminderEnabled || false,
      gender: gender || '',
      age: age || '',
      name: name, // обов'язкове
      person: person || '',
      greetingSubject: greetingSubject // обов'язкове
    };

    // Додавання до масиву eventDates
    user.eventDates.push(eventDate);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Подію успішно додано',
      eventDate: eventDate
    });

  } catch (error) {
    console.error('Помилка при додаванні дати:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера'
    });
  }
};

// Отримати всі дати подій користувача
const getEventDates = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('eventDates');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }

    res.status(200).json({
      success: true,
      eventDates: user.eventDates
    });

  } catch (error) {
    console.error('Помилка при отриманні дат:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера'
    });
  }
};

// Видалити дату події
const deleteEventDate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dateId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }

    // Знаходимо індекс дати для видалення
    const dateIndex = user.eventDates.findIndex(event => event._id.toString() === dateId);
    if (dateIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Дату не знайдено'
      });
    }

    // Видаляємо дату
    user.eventDates.splice(dateIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Дату успішно видалено'
    });

  } catch (error) {
    console.error('Помилка при видаленні дати:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера'
    });
  }
};

// Оновити дату події
const updateEventDate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { dateId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }

    // Знаходимо дату для оновлення
    const eventDate = user.eventDates.id(dateId);
    if (!eventDate) {
      return res.status(404).json({
        success: false,
        message: 'Дату не знайдено'
      });
    }

    // Оновлюємо поля
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        eventDate[key] = updateData[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Дату успішно оновлено',
      eventDate: eventDate
    });

  } catch (error) {
    console.error('Помилка при оновленні дати:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера'
    });
  }
};

module.exports = {
  addEventDate,
  getEventDates,
  deleteEventDate,
  updateEventDate
};
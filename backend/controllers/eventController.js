const User = require('../models/User');

// Додати нову дату події
const addEventDate = async (req, res) => {
  try {
    const userId = req.user.userId; // Отримуємо з authMiddleware
    const { 
      date, 
      formattedDate, 
      isReminderEnabled, 
      isRecurring,
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
      isRecurring: isRecurring || false,
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

    // Генеруємо щорічні повторення для recurring подій
    const allEventDates = [];
    const currentYear = new Date().getFullYear();
    
    user.eventDates.forEach(event => {
      allEventDates.push(event); // Додаємо оригінальну подію
      
      // Якщо подія має бути щорічною
      if (event.isRecurring) {
        const eventDate = new Date(event.date);
        const eventYear = eventDate.getFullYear();
        
        // Генеруємо події на наступні 10 років
        for (let year = eventYear + 1; year <= currentYear + 10; year++) {
          const newDate = new Date(eventDate);
          newDate.setFullYear(year);
          
          const recurringEvent = {
            ...event.toObject(),
            _id: `${event._id}_${year}`,
            date: newDate.toISOString().split('T')[0],
            formattedDate: newDate.toLocaleDateString('uk-UA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            isGenerated: true // Позначаємо як згенеровану подію
          };
          
          allEventDates.push(recurringEvent);
        }
      }
    });

    res.status(200).json({
      success: true,
      eventDates: allEventDates
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

    let originalEventId = dateId;

    // Якщо це згенерована подія, знаходимо оригінальну
    if (dateId.includes('_')) {
      originalEventId = dateId.split('_')[0];
    }

    // Знаходимо індекс оригінальної дати для видалення
    const dateIndex = user.eventDates.findIndex(event => event._id.toString() === originalEventId);
    if (dateIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Дату не знайдено'
      });
    }

    // Видаляємо оригінальну дату (це автоматично видалить усі згенеровані повторення)
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

    let eventDate;
    let originalEventId = dateId;

    // Якщо це згенерована подія, знаходимо оригінальну
    if (dateId.includes('_')) {
      originalEventId = dateId.split('_')[0];
    }

    // Знаходимо оригінальну дату для оновлення
    eventDate = user.eventDates.id(originalEventId);
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
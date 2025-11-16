import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import { GenderAgeSection, GreetingSubjectSection } from '../sections';
import { PersonSection } from '../sections/PersonSection/PersonSection';
import { saveEventDate, getEventDates, updateEventDate, deleteEventDate } from '../../config/saveEventDate';
import SignInModal from '../Registration/SignInModal/SignInModal';

const Calendar = () => {
  const navigate = useNavigate();
  
  // Ініціалізуємо currentDate з урахуванням збереженої дати
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem('calendar-selectedDate');
    if (savedDate && savedDate.includes('-')) {
      try {
        const [year, month, day] = savedDate.split('-').map(Number);
        
        // Проста валідація дати
        const date = new Date(year, month - 1, day);
        const isValidDate = date.getFullYear() === year && 
                           date.getMonth() === month - 1 && 
                           date.getDate() === day &&
                           year >= 1900 && year <= 2100;
        
        if (isValidDate) {
          return new Date(year, month - 1); // month - 1 тому що місяці в Date починаються з 0
        } else {
          localStorage.removeItem('calendar-selectedDate');
        }
      } catch (error) {
        localStorage.removeItem('calendar-selectedDate'); // Очищуємо некоректну дату
      }
    }
    return new Date();
  });
  
  // Завантажуємо вибрану дату з localStorage або встановлюємо null
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('calendar-selectedDate');
    return savedDate || null;
  });
  const [isReminderEnabled, setIsReminderEnabled] = useState(false); // Стан для галочки нагадування
  const [showForm, setShowForm] = useState(false); // Стан для відображення форми після натискання "Додати дату"
  const [editingEvent, setEditingEvent] = useState(null); // Стан для редагування події
  const [selectedDateEvents, setSelectedDateEvents] = useState([]); // Події для вибраної дати
  const [isTransitioning, setIsTransitioning] = useState(false); // Стан для анімації переходу між місяцями
  const [showSignInModal, setShowSignInModal] = useState(false); // Стан для модального вікна входу
  
  // Стани для збору даних з форми
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    name: '',
    person: '',
    greetingSubject: ''
  });
  
  // Стан для збереження дат подій з бекенду
  const [eventDatesFromDB, setEventDatesFromDB] = useState([]);
  
  // Стани для швидкої навігації
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [quickNavYear, setQuickNavYear] = useState(currentDate.getFullYear());
  const [quickNavMonth, setQuickNavMonth] = useState(currentDate.getMonth());
  
  // Особливі дати з різними типами подій (серпень 2025)
  const specialDates = {
    
  };

  // Завантаження дат подій з бекенду при монтуванні компонента
  useEffect(() => {
    const loadEventDates = async () => {
      try {
        const response = await getEventDates();
        if (response.success) {
          setEventDatesFromDB(response.eventDates);
        }
      } catch (error) {
        // Помилка завантаження дат подій
      }
    };

    loadEventDates();
  }, []);

  // Збереження вибраної дати в localStorage при її зміні
  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem('calendar-selectedDate', selectedDate);
    }
  }, [selectedDate]);

  // Завантаження подій для збереженої дати після завантаження даних з бекенду
  useEffect(() => {
    if (selectedDate && eventDatesFromDB.length > 0) {
      const eventsForDate = getEventsForDate(selectedDate);
      setSelectedDateEvents(eventsForDate);
    }
  }, [selectedDate, eventDatesFromDB]);

  // Закриття швидкої навігації при кліку поза нею
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQuickNav && !event.target.closest('.month-year-container')) {
        setShowQuickNav(false);
      }
    };

    if (showQuickNav) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showQuickNav]);

  // Перехід до місяця збереженої дати при першому завантаженні (резервна логіка)
  useEffect(() => {
    const savedDate = localStorage.getItem('calendar-selectedDate');
    if (savedDate && savedDate.includes('-') && eventDatesFromDB.length > 0) {
      try {
        const [year, month, day] = savedDate.split('-').map(Number);
        
        // Валідація дати в резервній логіці
        const date = new Date(year, month - 1, day);
        const isValidDate = date.getFullYear() === year && 
                           date.getMonth() === month - 1 && 
                           date.getDate() === day &&
                           year >= 1900 && year <= 2100;
        
        if (isValidDate) {
          const savedDateObj = new Date(year, month - 1);
          const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth());
          
          // Якщо збережена дата в іншому місяці (резервна перевірка)
          if (savedDateObj.getFullYear() !== currentDateObj.getFullYear() || 
              savedDateObj.getMonth() !== currentDateObj.getMonth()) {
            setCurrentDate(savedDateObj);
          }
        } else {
          localStorage.removeItem('calendar-selectedDate');
        }
      } catch (error) {
        localStorage.removeItem('calendar-selectedDate');
      }
    }
  }, [eventDatesFromDB]); // Викликається тільки після завантаження подій

  const monthNames = [
    'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
    'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Конвертуємо неділю в кінець тижня
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Функція для перевірки чи вибрана дата належить поточному місяцю
  const isSelectedDateInCurrentMonth = (year, month) => {
    if (!selectedDate) return false;
    const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return selectedDate.startsWith(currentMonthPrefix);
  };

  // Функція для валідації збереженої дати
  const validateSavedDate = (dateString) => {
    if (!dateString) return false;
    
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Перевіряємо, чи дата коректна
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && 
             date.getMonth() === month - 1 && 
             date.getDate() === day &&
             year >= 1900 && year <= 2100; // Розумні межі для року
    } catch (error) {
      return false;
    }
  };

  // Функція для перевірки чи дата є в збережених подіях
  const isEventDate = (dateKey) => {
    return eventDatesFromDB.find(event => event.date === dateKey);
  };

  // Функція для отримання всіх подій на конкретну дату
  const getEventsForDate = (dateKey) => {
    return eventDatesFromDB.filter(event => event.date === dateKey);
  };

  // Функція для правильного відмінювання слова "подія"
  const getEventCountText = (count) => {
    if (count === 1) return '1 подія';
    if (count >= 2 && count <= 4) return `${count} події`;
    return `${count} подій`;
  };

  const goToPreviousMonth = () => {
    if (isTransitioning) return; // Запобігаємо множинним кліків під час анімації
    
    setIsTransitioning(true);
    
    // Мінімальна затримка для плавного переходу
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
      // Зберігаємо вибрану дату при зміні місяця
      setIsReminderEnabled(false); // Скидаємо галочку нагадування
      setShowForm(false); // Приховуємо форму при зміні місяця
      setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' }); // Очищуємо дані форми
      setEditingEvent(null); // Очищуємо режим редагування
      // selectedDateEvents залишаємо, щоб показати події для вибраної дати навіть в іншому місяці
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150); // Додаткова затримка для завершення анімації
    }, 200); // Основна затримка
  };

  const goToNextMonth = () => {
    if (isTransitioning) return; // Запобігаємо множинним кліків під час анімації
    
    setIsTransitioning(true);
    
    // Мінімальна затримка для плавного переходу
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
      // Зберігаємо вибрану дату при зміні місяця
      setIsReminderEnabled(false); // Скидаємо галочку нагадування
      setShowForm(false); // Приховуємо форму при зміні місяця
      setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' }); // Очищуємо дані форми
      setEditingEvent(null); // Очищуємо режим редагування
      // selectedDateEvents залишаємо, щоб показати події для вибраної дати навіть в іншому місяці
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150); // Додаткова затримка для завершення анімації
    }, 200); // Основна затримка
  };

  // Функція перевірки авторизації
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowSignInModal(true);
      return false;
    }
    return true;
  };

  // Функція закриття модального вікна входу
  const closeSignInModal = () => {
    setShowSignInModal(false);
  };

  // Обробка успішного входу
  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    // Оновлюємо дати подій після входу
    const loadEventDates = async () => {
      try {
        const response = await getEventDates();
        if (response.success) {
          setEventDatesFromDB(response.eventDates);
        }
      } catch (error) {
        console.error('Помилка завантаження дат подій:', error);
      }
    };
    loadEventDates();
  };

  // Функції для швидкої навігації
  const toggleQuickNav = () => {
    setShowQuickNav(!showQuickNav);
    if (!showQuickNav) {
      // При відкритті встановлюємо поточні значення
      setQuickNavYear(currentDate.getFullYear());
      setQuickNavMonth(currentDate.getMonth());
    }
  };

  const applyQuickNav = () => {
    setCurrentDate(new Date(quickNavYear, quickNavMonth));
    setShowQuickNav(false);
    setSelectedDateEvents([]); // Очищуємо події при зміні місяця
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth()));
    setShowQuickNav(false);
    setSelectedDateEvents([]);
  };

  // Генеруємо роки для швидкої навігації (+-10 років від поточного)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  // Функція для обчислення віку на поточний рік календаря
  const calculateAge = (event, calendarYear) => {
    if (!event.age || !event.isRecurring) {
      return null;
    }

    // Отримуємо оригінальний рік події та базовий вік
    let originalEventDate, originalYear, baseAge;
    
    if (event.isGenerated) {
      // Для згенерованої події витягуємо оригінальний ID
      const originalId = event._id.split('_')[0];
      // Знаходимо оригінальну подію в eventDatesFromDB
      const originalEvent = eventDatesFromDB.find(e => e._id === originalId);
      if (originalEvent) {
        originalEventDate = new Date(originalEvent.date);
        originalYear = originalEventDate.getFullYear();
        baseAge = parseInt(originalEvent.age);
      } else {
        return null;
      }
    } else {
      // Для оригінальної події
      originalEventDate = new Date(event.date);
      originalYear = originalEventDate.getFullYear();
      baseAge = parseInt(event.age);
    }
    
    // Обчислюємо різницю років і підраховуємо поточний вік
    const yearsDifference = calendarYear - originalYear;
    return baseAge + yearsDifference;
  };

  // Функція для форматування відображення віку
  const formatAgeDisplay = (event) => {
    const calendarYear = currentDate.getFullYear();
    const age = calculateAge(event, calendarYear);
    
    if (age === null) {
      return '';
    }
    
    return ` (${age} ${age === 1 ? 'рік' : age < 5 ? 'роки' : 'років'})`;
  };

  // Функції для обробки змін в секціях
  const handleGenderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddDate = () => {
    // Перевіряємо авторизацію перед додаванням події
    if (!checkAuthentication()) {
      return;
    }
    
    if (selectedDate) {
      // Показуємо форму замість скидання станів
      setShowForm(true);
      setEditingEvent(null); // Новий режим
    }
  };

  const handleAddNewEvent = () => {
    // Перевіряємо авторизацію перед додаванням нової події
    if (!checkAuthentication()) {
      return;
    }
    
    setShowForm(true);
    setEditingEvent(null); // Новий режим
    setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' });
    setIsReminderEnabled(false);
  };

  const handleEditEvent = (event) => {
    // Перевіряємо авторизацію перед редагуванням події
    if (!checkAuthentication()) {
      return;
    }
    
    setShowForm(true);
    setEditingEvent(event);
    setFormData({
      gender: event.gender || '',
      age: event.age || '',
      name: event.name || '',
      person: event.person || '',
      greetingSubject: event.greetingSubject || ''
    });
    setIsReminderEnabled(event.isReminderEnabled || false);
  };

  const handleDeleteEvent = async (event) => {
    // Перевіряємо авторизацію перед видаленням події
    if (!checkAuthentication()) {
      return;
    }
    
    try {
      const response = await deleteEventDate(event._id);
      
      if (response.success) {
        alert('Подію успішно видалено!');
        
        // Перезавантажуємо дані подій з бекенду
        const updatedResponse = await getEventDates();
        if (updatedResponse.success) {
          setEventDatesFromDB(updatedResponse.eventDates);
          // Оновлюємо події для вибраної дати
          const eventsForDate = updatedResponse.eventDates.filter(e => e.date === selectedDate);
          setSelectedDateEvents(eventsForDate);
        }
      }
    } catch (error) {
      alert('Помилка при видаленні події: ' + error.message);
    }
  };

  const handleSaveDate = async () => {
    if (selectedDate) {
      // Валідація обов'язкових полів на фронтенді
      if (!formData.name || !formData.greetingSubject) {
        alert('Будь ласка, заповніть обов\'язкові поля: "Ім\'я" та "З чим вітаємо"');
        return;
      }

      const selectedDateObj = new Date(selectedDate);
      const formattedDate = selectedDateObj.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      // Збираємо всі дані для відправки
      const dataToSend = {
        date: selectedDate,
        formattedDate: formattedDate,
        isReminderEnabled: isReminderEnabled,
        isRecurring: true, // Автоматично дублювати на кожний рік
        gender: formData.gender,
        age: formData.age,
        name: formData.name,
        person: formData.person,
        greetingSubject: formData.greetingSubject
      };
      
      try {
        let response;
        
        if (editingEvent) {
          // Режим редагування - оновлюємо існуючу подію
          response = await updateEventDate(editingEvent._id, dataToSend);
        } else {
          // Режим додавання - створюємо нову подію
          response = await saveEventDate(dataToSend);
        }
        
        if (response.success) {
          const action = editingEvent ? 'оновлено' : 'збережено';
          const message = editingEvent && editingEvent.isRecurring 
            ? `Щорічну подію успішно ${action}! Зміни застосовано до всіх повторень.`
            : `Подію на дату ${formattedDate} успішно ${action}!`;
          alert(message);
          
          // Перезавантажуємо дані подій з бекенду
          const updatedResponse = await getEventDates();
          if (updatedResponse.success) {
            setEventDatesFromDB(updatedResponse.eventDates);
            // Оновлюємо події для вибраної дати
            const eventsForDate = updatedResponse.eventDates.filter(event => event.date === selectedDate);
            setSelectedDateEvents(eventsForDate);
          }
          
          if (isReminderEnabled) {
            localStorage.setItem(`reminder_${selectedDate}`, 'true');
          }
        }
        
      } catch (error) {
        alert('Помилка при збереженні дати: ' + error.message);
        return; // Не очищуємо форму при помилці
      }
      
      // Скидаємо всі стани після успішного збереження
      setIsReminderEnabled(false);
      setShowForm(false);
      setEditingEvent(null);
      setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' });
    }
  };

  const handleDateClick = (day, month, year) => {
    const dateKey = formatDateKey(year, month, day);
    
    // Якщо користувач клікає на вже вибрану дату - очищуємо вибір
    if (selectedDate === dateKey) {
      setSelectedDate(null);
      setSelectedDateEvents([]);
      setShowForm(false);
      setEditingEvent(null);
      setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' });
      setIsReminderEnabled(false);
      return;
    }
    
    setSelectedDate(dateKey);
    
    // Отримуємо всі події для цієї дати
    const eventsForDate = getEventsForDate(dateKey);
    setSelectedDateEvents(eventsForDate);
    
    // Скидаємо стани форми
    setShowForm(false);
    setEditingEvent(null);
    setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' });
    setIsReminderEnabled(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const days = [];    // Порожні клітинки для днів попереднього місяця
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Дні поточного місяця
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const specialDate = specialDates[dateKey];
      const eventsFromDB = getEventsForDate(dateKey); // Отримуємо всі події для цієї дати
      
      // Перевіряємо, чи дата вибрана І чи вона належить поточному місяцю
      // Також відключаємо виділення під час анімації переходу
      const isSelected = !isTransitioning && 
                        selectedDate === dateKey && 
                        isSelectedDateInCurrentMonth(year, month);
      
      // Перевірка чи це поточна дата
      const today = new Date();
      const isToday = today.getFullYear() === year && 
                     today.getMonth() === month && 
                     today.getDate() === day;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${specialDate ? 'has-event' : ''} ${eventsFromDB.length > 0 ? 'has-db-event' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day, month, year)}
          title={eventsFromDB.length > 0 ? `${eventsFromDB.length} події: ${eventsFromDB.map(e => {
            const ageDisplay = formatAgeDisplay(e);
            return `${e.name} - ${e.greetingSubject}${ageDisplay}`;
          }).join(', ')}` : ''}
        >
          <span className="day-number">{day}</span>
          {specialDate && (
            <span className={`event-label ${specialDate.type}`}>
              {specialDate.label}
            </span>
          )}
          {eventsFromDB.length > 0 && !specialDate && (
            <div className="db-events">
              <span className="event-label db-event">
                {getEventCountText(eventsFromDB.length)}
              </span>
            </div>
          )}
          {isToday && !specialDate && eventsFromDB.length === 0 && (
            <span className="today-indicator">Сьогодні</span>
          )}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar-container">
          <h2 className="calendar-title">Ваш календар особливих дат</h2>
      <div className="calendar-header">
      
        
        <div className="calendar-navigation">
          <button 
            className={`nav-button prev ${isTransitioning ? 'disabled' : ''}`} 
            onClick={goToPreviousMonth}
            disabled={isTransitioning}
          >
            ‹
          </button>
          
          <div className="month-year-container">
            <h3 className="month-year" onClick={toggleQuickNav}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} р.
              <span className="quick-nav-icon">⚙</span>
            </h3>
            
            {showQuickNav && (
              <div className="quick-nav-dropdown">
                <div className="quick-nav-header">
                  <h4>Швидка навігація</h4>
                  <button className="close-quick-nav" onClick={() => setShowQuickNav(false)}>✕</button>
                </div>
                
                <div className="quick-nav-selectors">
                  <div className="selector-group">
                    <label>Місяць:</label>
                    <select 
                      value={quickNavMonth} 
                      onChange={(e) => setQuickNavMonth(parseInt(e.target.value))}
                    >
                      {monthNames.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="selector-group">
                    <label>Рік:</label>
                    <select 
                      value={quickNavYear} 
                      onChange={(e) => setQuickNavYear(parseInt(e.target.value))}
                    >
                      {generateYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="quick-nav-actions">
                  <button className="today-button" onClick={goToToday}>
                    Сьогодні
                  </button>
                  <button className="apply-button" onClick={applyQuickNav}>
                    Перейти
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className={`nav-button next ${isTransitioning ? 'disabled' : ''}`} 
            onClick={goToNextMonth}
            disabled={isTransitioning}
          >
            ›
          </button>
        </div>
        
        <div className="day-headers">
          {dayNames.map((dayName, index) => (
            <div key={index} className="day-header">
              {dayName}
            </div>
          ))}
        </div>
      </div>
      
      <div className={`calendar-grid ${isTransitioning ? 'transitioning' : ''}`}>
        {renderCalendarDays()}
      </div>
      
      {!showForm && selectedDate && (
        <div className="date-actions">
          
          {selectedDateEvents.length === 0 ? (
            // Дата без подій - показуємо кнопку "Додати дату"
            <button 
              className="add-date-button" 
              onClick={handleAddDate}
            >
              Додати подію
            </button>
          ) : (
            // Дата з подіями - показуємо список подій та кнопки
            <div className="events-list">
              <h4>Події на цю дату:</h4>
              {selectedDateEvents.map((event, index) => (
                <div key={event._id} className="event-item">
                  <span className="event-info">
                    {event.name}{event.isRecurring && formatAgeDisplay(event)} - {event.greetingSubject}
                    
                  </span>
                  <div className="event-actions">
                    <button 
                      className="edit-event-button"
                      onClick={() => handleEditEvent(event)}
                      title={event.isRecurring ? "Редагування застосується до всіх повторень" : ""}
                    >
                      Редагувати
                    </button>
                    <button 
                      className="delete-event-button"
                      onClick={() => handleDeleteEvent(event)}
                      title={event.isRecurring ? "Видалення застосується до всіх повторень" : ""}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
              <button 
                className="add-new-event-button" 
                onClick={handleAddNewEvent}
              >
                Додати нову подію
              </button>
            </div>
          )}
        </div>
      )}

      {!showForm && !selectedDate && (
        <button 
          className="add-date-button disabled"
          disabled={true}
        >
          Виберіть дату
        </button>
      )}

      {showForm && (
        <>
          <GenderAgeSection 
            onGenderChange={handleGenderChange}
            onAgeChange={handleGenderChange}
          />
          <PersonSection 
            onPersonChange={handlePersonChange}
            selectedGender={formData.gender}
          />
          <GreetingSubjectSection 
            onSubjectChange={handleSubjectChange}
          />
        
          <button className="add-date-button" onClick={handleSaveDate}>
            {editingEvent ? 'Оновити' : 'Зберегти'}
          </button>
        </>
      )}

      {/* Модальне вікно входу */}
      <SignInModal 
        isOpen={showSignInModal}
        onClose={closeSignInModal}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
};

export default Calendar;
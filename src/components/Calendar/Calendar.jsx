import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import { GenderAgeSection, GreetingSubjectSection } from '../sections';
import { PersonSection } from '../sections/PersonSection/PersonSection';
import { saveEventDate, getEventDates, updateEventDate, deleteEventDate } from '../../config/saveEventDate';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); // Поточна дата замість серпня 2025
  const [selectedDate, setSelectedDate] = useState(null); // Додаємо стан для вибраної дати
  const [isReminderEnabled, setIsReminderEnabled] = useState(false); // Стан для галочки нагадування
  const [showForm, setShowForm] = useState(false); // Стан для відображення форми після натискання "Додати дату"
  const [editingEvent, setEditingEvent] = useState(null); // Стан для редагування події
  const [selectedDateEvents, setSelectedDateEvents] = useState([]); // Події для вибраної дати
  
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
        console.error('Помилка завантаження дат подій:', error);
      }
    };

    loadEventDates();
  }, []);

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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null); // Очищуємо вибрану дату при зміні місяця
    setIsReminderEnabled(false); // Скидаємо галочку нагадування
    setShowForm(false); // Приховуємо форму при зміні місяця
    setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' }); // Очищуємо дані форми
    setEditingEvent(null); // Очищуємо режим редагування
    setSelectedDateEvents([]); // Очищуємо події вибраної дати
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null); // Очищуємо вибрану дату при зміні місяця
    setIsReminderEnabled(false); // Скидаємо галочку нагадування
    setShowForm(false); // Приховуємо форму при зміні місяця
    setFormData({ gender: '', age: '', name: '', person: '', greetingSubject: '' }); // Очищуємо дані форми
    setEditingEvent(null); // Очищуємо режим редагування
    setSelectedDateEvents([]); // Очищуємо події вибраної дати
  };

  // Функція перевірки авторизації
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/SignIn');
      return false;
    }
    return true;
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
    
    if (window.confirm(`Ви дійсно хочете видалити подію "${event.name} - ${event.greetingSubject}"?`)) {
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
        console.error('Помилка видалення:', error);
        alert('Помилка при видаленні події: ' + error.message);
      }
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
          alert(`Подію на дату ${formattedDate} успішно ${action}!`);
          
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
        console.error('Помилка збереження:', error);
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
    
    const days = [];
    
    // Порожні клітинки для днів попереднього місяця
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Дні поточного місяця
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const specialDate = specialDates[dateKey];
      const eventsFromDB = getEventsForDate(dateKey); // Отримуємо всі події для цієї дати
      const isSelected = selectedDate === dateKey;
      
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
          title={eventsFromDB.length > 0 ? `${eventsFromDB.length} події: ${eventsFromDB.map(e => `${e.name} - ${e.greetingSubject}`).join(', ')}` : ''}
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
          <button className="nav-button prev" onClick={goToPreviousMonth}>
            ‹
          </button>
          
          <h3 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} р.
          </h3>
          
          <button className="nav-button next" onClick={goToNextMonth}>
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
      
      <div className="calendar-grid">
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
                    {event.name} - {event.greetingSubject}
                  </span>
                  <div className="event-actions">
                    <button 
                      className="edit-event-button"
                      onClick={() => handleEditEvent(event)}
                    >
                      Редагувати
                    </button>
                    <button 
                      className="delete-event-button"
                      onClick={() => handleDeleteEvent(event)}
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
          <div className="date-options">
            <div className="reminder-option">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isReminderEnabled}
                  onChange={(e) => setIsReminderEnabled(e.target.checked)}
                  className="reminder-checkbox"
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Одноразове нагадування</span>
              </label>
            </div>
          </div>
          <button className="add-date-button" onClick={handleSaveDate}>
            {editingEvent ? 'Оновити' : 'Зберегти'}
          </button>
        </>
      )}
    </div>
  );
};

export default Calendar;
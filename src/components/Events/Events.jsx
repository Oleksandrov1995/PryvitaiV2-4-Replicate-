import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { getEventDates } from '../../config/saveEventDate';
import { getUpcomingHolidays, holidayCategories, getHolidayTypeText } from '../../data/holidays';

const Events = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [calendarHolidays, setCalendarHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [selectedTab, setSelectedTab] = useState('my-events'); // 'my-events' або 'calendar'
  const [selectedCategory, setSelectedCategory] = useState('all'); // Фільтр категорій

  useEffect(() => {
    loadUpcomingEvents();
    loadCalendarHolidays();
  }, []);

  useEffect(() => {
    filterHolidaysByCategory();
  }, [calendarHolidays, selectedCategory]);

  const loadUpcomingEvents = async () => {
    try {
      const response = await getEventDates();
      if (response.success) {
        // Фільтруємо події на найближчі дні
        const events = response.eventDates;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Встановлюємо час на початок дня
        
        // Відбираємо події на наступні 30 днів
        const upcoming = events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          
          // Показуємо події від сьогодні і на наступні 30 днів
          const diffTime = eventDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays >= 0 && diffDays <= 30;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        setUpcomingEvents(upcoming);
      }
    } catch (error) {
      // Помилка завантаження дат подій
    }
  };

  const loadCalendarHolidays = () => {
    try {
      // Отримуємо календарні свята на наступні 60 днів
      const holidays = getUpcomingHolidays(365);
      setCalendarHolidays(holidays);
    } catch (error) {
      // Помилка завантаження календарних свят
    }
  };

  const filterHolidaysByCategory = () => {
    if (selectedCategory === 'all') {
      setFilteredHolidays(calendarHolidays);
    } else {
      const filtered = calendarHolidays.filter(holiday => 
        holiday.category === selectedCategory
      );
      setFilteredHolidays(filtered);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
  };

  const getDaysUntilEvent = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysText = (days) => {
    if (days === 0) return 'сьогодні';
    if (days === 1) return 'через 1 день';
    if (days < 5) return `через ${days} дні`;
    return `через ${days} днів`;
  };

  const calculateAge = (event) => {
    if (!event.age || !event.isRecurring) return null;
    
    const currentYear = new Date().getFullYear();
    const originalEventDate = new Date(event.date);
    const originalYear = originalEventDate.getFullYear();
    const baseAge = parseInt(event.age);
    const yearsDifference = currentYear - originalYear;
    
    return baseAge + yearsDifference;
  };

  const handleCreateGreeting = (event) => {
    // Перенаправляємо на сторінку створення привітання
    navigate('/StylizePhotoForPostcard', { state: { event } });
  };

 
  const goToCalendar = () => {
    navigate('/calendar');
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <div className="tabs">
          <button 
            className={`tab ${selectedTab === 'my-events' ? 'active' : ''}`}
            onClick={() => setSelectedTab('my-events')}
          >
            Мої свята
          </button>
          <button 
            className={`tab ${selectedTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setSelectedTab('calendar')}
          >
            Календарні
          </button>
        </div>
        
        {selectedTab === 'calendar' && (
          <div className="category-filter">
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Всі категорії</option>
              {holidayCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="events-content">
        {selectedTab === 'my-events' && (
          <div className="my-events">
            {upcomingEvents.length === 0 ? (
              <div className="no-events">
                <p>У вас немає найближчих подій</p>
                <button className="add-event-btn" onClick={goToCalendar}>
                  Додати подію
                </button>
              </div>
            ) : (
              upcomingEvents.map((event, index) => {
                const daysUntil = getDaysUntilEvent(event.date);
                const age = calculateAge(event);
                
                return (
                  <div 
                    key={event._id} 
                    className="event-card"
                    style={{ '--index': index }}
                  >
                    <div className="event-header">
                      <h3>• {event.greetingSubject}</h3>
                      <p className="event-description">
                        Оберіть стиль який підійде святу та створить привітання.
                      </p>
                    </div>
                    
                    <div className="event-details">
                      <div className="event-date">
                        <span className="days-until">{getDaysText(daysUntil)}</span>
                        <span className="date">{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="event-actions">
                        <button 
                          className="action-btn create-greeting"
                          onClick={() => handleCreateGreeting(event)}
                        >
                          Створити привітання
                        </button>
                       
                      </div>
                    </div>

                    {event.name && (
                      <div className="event-person">
                        <div className="person-avatar">
                          <span className="avatar-initials">
                            {event.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="person-info">
                          <span className="person-name">{event.name}</span>
                          {age && <span className="person-age">{age} років</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {selectedTab === 'calendar' && (
          <div className="calendar-events">
            {filteredHolidays.length === 0 ? (
              <div className="no-events">
                <p>Немає календарних свят на найближчі дні{selectedCategory !== 'all' ? ` в категорії "${selectedCategory}"` : ''}</p>
              </div>
            ) : (
              filteredHolidays.map((holiday, index) => {
                const daysUntil = getDaysUntilEvent(holiday.date);
                const isMajorHoliday = holiday.type === 'major';
                
                return (
                  <div 
                    key={`${holiday.date}-${index}`} 
                    className={`event-card holiday-card ${isMajorHoliday ? 'major-holiday' : ''}`}
                    style={{ '--index': index }}
                  >
                    <div className="event-header">
                      <h3>• {holiday.name}</h3>
                      <p className="event-description">
                      {getHolidayTypeText(holiday.type)}
                      </p>
                    </div>
                    
                    <div className="event-details">
                      <div className="event-date">
                        <span className="days-until">{getDaysText(daysUntil)}</span>
                        <span className="date">{formatDate(holiday.date)}</span>
                      </div>
                      
                      <div className="event-actions">
                        <button 
                          className="action-btn create-greeting"
                          onClick={() => handleCreateGreeting(holiday)}
                        >
                          Створити привітання
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

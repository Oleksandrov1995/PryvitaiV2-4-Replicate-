import React, { useEffect, useState } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../config/api';
import { FiSettings, FiEdit2, FiImage } from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import ProfileSettings from '../ProfileSettings/ProfileSettings';
import Events from '../Events/Events';
import { getEventDates } from '../../config/saveEventDate';

const User = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '', tagline: '' });
  const [stats, setStats] = useState({ photos: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/signin'); return; }

    const fetchData = async () => {
      try {
        const res = await fetch(API_URLS.GET_ME, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { throw new Error('Auth error'); }
        const data = await res.json();
        if (data?.user) {
          setProfile({
            name: data.user.name || '—',
            email: data.user.email || '—',
            avatar: data.user.avatar || '/default-avatar.png',
            tagline: data.user.tagline || 'A passionate creator capturing life\'s moments'
          });

          // Try to derive gallery count from user payload first
          let photosCount = 0;
          if (Array.isArray(data.user.galleryImage)) {
            photosCount = data.user.galleryImage.length;
          } else if (Array.isArray(data.user.gallery)) {
            photosCount = data.user.gallery.length;
          }

          // If not present, fetch gallery endpoint for authoritative count
          if (!photosCount) {
            try {
              const gRes = await fetch(API_URLS.GET_GALLERY, { headers: { Authorization: `Bearer ${token}` } });
              if (gRes.ok) {
                const galleryData = await gRes.json();
                if (Array.isArray(galleryData)) photosCount = galleryData.length;
              }
            } catch (_) { /* silent */ }
          }

          // Fetch events count from eventDates (only original events, not generated recurring)
          let eventsCount = 0;
          try {
            const eventDatesData = await getEventDates();
            if (eventDatesData && Array.isArray(eventDatesData.eventDates)) {
              // Рахуємо тільки оригінальні події (без isGenerated: true)
              eventsCount = eventDatesData.eventDates.filter(event => !event.isGenerated).length;
            }
          } catch (_) { /* silent */ }

          setStats({ photos: photosCount, events: eventsCount });
        }
      } catch (err) {
        setError('Не вдалося завантажити профіль');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/signin');
      } finally { setLoading(false); }
    };
    fetchData();
  }, [navigate]);

  // Функція для отримання першої літери імені
  const getInitials = (name) => {
    if (!name || name === '—') return 'U'; // User за замовчуванням
    return name.charAt(0).toUpperCase();
  };

  if (loading) return <div className="user-hero loading">Завантаження...</div>;
  if (error) return <div className="user-hero error">{error}</div>;

  return (
    <div className="user-hero">
      <div className="user-hero-bg" />
      <div className="user-hero-inner">
        <div className="user-hero-actions-top">
          <button className="uh-icon-btn" onClick={() => setShowSettings(true)} title="Налаштування"><FiSettings /></button>
         
        </div>

        <div className="user-avatar-wrapper">
          {profile.avatar && profile.avatar !== '/default-avatar.png' ? (
            <>
              <img 
                className="user-avatar" 
                src={profile.avatar} 
                alt={profile.name} 
                onError={(e) => {
                  // Якщо аватар не завантажився, ховаємо зображення і показуємо заглушку
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentNode.querySelector('.user-avatar-initials').style.display = 'flex';
                }}
              />
              <div 
                className="user-avatar-initials" 
                style={{ display: 'none' }}
              >
                {getInitials(profile.name)}
              </div>
            </>
          ) : (
            <div className="user-avatar-initials">
              {getInitials(profile.name)}
            </div>
          )}
        </div>
        <h1 className="user-name">{profile.name}</h1>
      

        <div className="user-stats">
          <button 
            className="user-stat clickable"
            onClick={() => navigate('/gallery')}
          >
            <span className="val">{stats.photos}</span>
            <span className="label">Фото</span>
          </button>
          <button 
            className="user-stat clickable"
            onClick={() => setIsEventsModalOpen(true)}
          >
            <span className="val">{stats.events}</span>
            <span className="label">Подій</span>
          </button>
        </div>

        <div className="user-navigation-buttons">
          <button 
            className="nav-button calendar-btn"
            onClick={() => navigate('/calendar')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5C21 3.9 20.1 3 19 3zM19 19H5V8h14V19z"/>
            </svg>
            Календар привітань
          </button>
          
          <button 
            className="nav-button events-btn"
            onClick={() => setIsEventsModalOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
            Події
          </button>
          
          <button 
            className="nav-button generate-btn"
            onClick={() => navigate('/StylizePhotoForPostcard')}
          >
            <LuSparkles />
            Згенерувати привітання
          </button>
        </div>

   
      </div>
      {showSettings && <ProfileSettings onClose={() => setShowSettings(false)} />}
      
      {/* Модалка подій */}
      {isEventsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEventsModalOpen(false)}>
          <div className="modal-content events-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn"
              onClick={() => setIsEventsModalOpen(false)}
            >
              ×
            </button>
            <Events />
          </div>
        </div>
      )}
    </div>
  );
};

export default User;

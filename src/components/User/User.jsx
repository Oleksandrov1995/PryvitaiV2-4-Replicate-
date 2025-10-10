import React, { useEffect, useState } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../config/api';
import { FiSettings, FiEdit2, FiImage } from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import ProfileSettings from '../ProfileSettings/ProfileSettings';

const User = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '', tagline: '' });
  const [stats, setStats] = useState({ photos: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

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

          setStats({ photos: photosCount, events: 0 });
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

  if (loading) return <div className="user-hero loading">Завантаження...</div>;
  if (error) return <div className="user-hero error">{error}</div>;

  return (
    <div className="user-hero">
      <div className="user-hero-bg" />
      <div className="user-hero-inner">
        <div className="user-hero-actions-top">
          <button className="uh-icon-btn" onClick={() => setShowSettings(true)} title="Налаштування"><FiSettings /></button>
          <button className="uh-icon-btn" title="Редагувати профіль"><FiEdit2 /></button>
          <button className="uh-icon-btn" title="Завантажити фото"><FiImage /></button>
        </div>

        <div className="user-avatar-wrapper">
          <img className="user-avatar" src={profile.avatar} alt={profile.name} onError={(e)=>{e.currentTarget.src='https://i.pravatar.cc/70';}} />
        </div>
        <h1 className="user-name">{profile.name}</h1>
        <p className="user-tagline">{profile.tagline}</p>

        <div className="user-stats">
          <div className="user-stat"><span className="val">{stats.photos}</span><span className="label">Photos</span></div>
         </div>

        <div className="user-primary-actions">
          <button className="user-action-btn"><FiImage /> Greetings Calendar</button>
          <button className="user-action-btn"><FiEdit2 /> Event List</button>
          <button className="user-action-btn"><LuSparkles /> Generate Greetings</button>
        </div>
      </div>
      {showSettings && <ProfileSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default User;

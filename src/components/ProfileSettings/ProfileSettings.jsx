import React, { useState, useEffect, useRef } from 'react';
import './ProfileSettings.css';
import { FiX, FiEdit2, FiStar } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import { API_URLS } from '../../config/api';
import { uploadPhoto } from '../../config/uploadPhoto';

const ProfileSettings = ({ onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [avatar, setAvatar] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState('');
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(API_URLS.GET_ME, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('storage'));
          navigate('/signin');
          return;
        }
        const data = await res.json();
        if (data && data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setPhone(data.user.phone || '');
          setAvatar(data.user.avatar || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/signin');
      }
    };

    fetchProfile();
  }, [navigate]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUpdatePhone = async () => {
    if (!tempPhone.trim()) { setPhoneMsg('Введіть номер телефону'); return; }
    setPhoneMsg('');
    try {
      const res = await fetch(API_URLS.UPDATE_PHONE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ phone: tempPhone.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneMsg(data.error || 'Не вдалося оновити телефон');
      } else {
        setPhone(tempPhone.trim());
        setPhoneMsg(data.message || 'Телефон оновлено');
        setIsEditingPhone(false);
      }
    } catch (err) {
      setPhoneMsg('Помилка зʼєднання з сервером');
    }
  };

  const handleChooseAvatar = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setIsUploadingAvatar(true);
      setAvatarMsg('');
      const base64 = await fileToBase64(file);
      const url = await uploadPhoto(base64);
      setAvatar(url);
      // Persist avatar to backend
      try {
        const res = await fetch(API_URLS.UPDATE_AVATAR, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ avatar: url })
        });
        const data = await res.json().catch(()=>({}));
        if (!res.ok) {
          setAvatarMsg(data.error || 'Не вдалося зберегти аватар на сервері');
        } else {
          setAvatarMsg('Аватар оновлено');
        }
      } catch (err2) {
        setAvatarMsg('Помилка збереження аватара на сервері');
      }
    } catch (err) {
      console.error('Avatar upload failed', err);
      alert('Не вдалося завантажити фото');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

 

  const handleDeleteAccount = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити акаунт? Цю дію не можна скасувати.')) return;
    try {
      const res = await fetch(API_URLS.DELETE_ACCOUNT, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()
        }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Не вдалося видалити акаунт');
      } else {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
  // Переходимо на сторінку реєстрації після видалення акаунта
  navigate('/SignUp');
      }
    } catch (err) {
      alert('Помилка зʼєднання з сервером');
    }
  };

  return (
    <div className="profile-settings-overlay">
      <div className="profile-settings-container">
        <header className="ps-header">
          <h2>Налаштування облікового запису</h2>
          <button onClick={onClose} className="ps-close-btn">
            <FiX />
          </button>
        </header>

        <section className="ps-main-info">
          <div className="ps-avatar-section">
            <img
              src={avatar || "https://i.pravatar.cc/60"}
              alt="User Avatar"
              className="ps-avatar"
              onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
            />
            <button className="ps-btn ps-btn-outline" type="button" onClick={handleChooseAvatar} disabled={isUploadingAvatar}>
              {isUploadingAvatar ? 'Завантаження...' : 'Замінити фото'}
            </button>
            <button className="ps-btn ps-btn-primary" onClick={() => window.location.href="/StylizePhotoForPostcard"} type="button">
              <FiStar /> Стилізувати фото
            </button>
            <button className="ps-btn-text" type="button" onClick={() => setAvatar('')}>Видалити фото</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            {avatarMsg && <div className="msg-inline" style={{marginTop:8}}>{avatarMsg}</div>}
          </div>
         <section className="ps-details-section">
          <div className="ps-detail-item">
            <div>
              <label>Ім'я</label>
              <p>{name}</p>
            </div>
            <button className="ps-edit-btn">
              <FiEdit2 />
            </button>
          </div>
          <div className="ps-detail-item">
            <div>
              <label>Електронна пошта</label>
              <p>{email}</p>
            </div>
            <button className="ps-edit-btn">
              <FiEdit2 />
            </button>
          </div>
          <div className="ps-detail-item">
            <div style={{flex:1}}>
              <label>Телефон</label>
              {!isEditingPhone ? (
                <p>{phone || 'не вказано'}</p>
              ) : (
                <div className="ps-inline-edit">
                  <input
                    type="text"
                    value={tempPhone}
                    onChange={e => setTempPhone(e.target.value)}
                    placeholder="Введіть номер"
                  />
                  <div className="ps-inline-actions">
                    <button type="button" className="ps-btn-small primary" onClick={handleUpdatePhone}>Зберегти</button>
                    <button type="button" className="ps-btn-small" onClick={() => { setIsEditingPhone(false); setTempPhone(phone); setPhoneMsg(''); }}>Скасувати</button>
                  </div>
                </div>
              )}
              {phoneMsg && <div className="msg-inline">{phoneMsg}</div>}
            </div>
            <button
              className="ps-edit-btn"
              type="button"
              onClick={() => { if (!isEditingPhone) { setTempPhone(phone); setIsEditingPhone(true);} }}
              disabled={isEditingPhone}
            >
              <FiEdit2 />
            </button>
          </div>
          <div className="ps-detail-item">
            <div>
              <label>Пароль</label>
              <Link to="/reset-password">Змінити пароль</Link>
            </div>
          </div>
  </section>
  {/* Close main info (avatar + details) */}
  </section>

  <hr className="ps-divider" />

        <section className="ps-setting-item">
          <div className="ps-setting-text">
            <h3>Тема профілю</h3>
            <p>Світлий / Темний режим</p>
          </div>
          <div className="ps-setting-action">
            <label className="ps-toggle-switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <span className="ps-slider"></span>
            </label>
          </div>
        </section>

        <hr className="ps-divider" />

        <section className="ps-setting-item danger">
          <div className="ps-setting-text">
            <h3>Видалити акаунт</h3>
            <p>Цю дію не можна буде скасувати</p>
          </div>
          <div className="ps-setting-action">
            <button className="ps-btn ps-btn-danger" onClick={handleDeleteAccount}>
              Видалити акаунт
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;

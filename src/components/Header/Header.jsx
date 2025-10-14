import React, { useState, useEffect, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiGift, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import './Header.css';
import logo from '../../images/logo.png';
import logoText from '../../images/logoText.png';
import ProfileSettings from '../ProfileSettings/ProfileSettings';
import Events from '../Events/Events';
import { API_URLS } from '../../config/api';
const Header = () => {
   const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Стан для меню користувача
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Стан для модального вікна
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false); // Стан для модального вікна подій
  const [avatar, setAvatar] = useState(''); // Стан для збереження даних профілю
  const helpMenuRef = useRef(null);
  const userMenuRef = useRef(null); 
  useEffect(() => {
    const checkToken = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
        setIsHelpMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsEventsModalOpen(false);
        setIsSettingsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Не робимо автоматичний редирект, дозволяємо залишатися на головній сторінці
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/SignIn';
  };

  const handleOpenSettings = () => {
    setIsUserMenuOpen(false);
    setIsSettingsModalOpen(true);
  };
   const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
    window.location.reload(); // Перезавантаження сторінки
  };

  return (
    <>
    <header className="header">
      {/* Лого */}
      <div className="header-logo">
        <Link to="/">
          <img src={logo} alt="Pryvitai Logo" style={{ height: '50px' }} /> <img src={logoText} alt="Pryvitai LogoText" style={{ height: '40px' }} />
        </Link>
      </div>

      {/* Кнопка "Календар привітань" */}
      <div className="calendar-btn">
        <Link to="/calendar">Календар привітань</Link>
      </div>

      {/* Навігація */}
      <nav className="header-nav">
        <Link to="/tariffs">Тарифи</Link>
        <Link to="/actions">Акції</Link>
        <Link to="/gallery">Галерея</Link>
        <button 
          className="nav-link-button" 
          onClick={() => setIsEventsModalOpen(true)}
        >
          Події
        </button>
      </nav>

      {/* Авторизація */}
      <div className="auth-actions">
        {isLoggedIn ? (
          <>
          {/* Іконки без списку для кращої стилізації */}
            <Link to="/bonuses" className="header-icon" title="Бонуси та подарунки">
              <FiGift />
            </Link>
            <Link to="/notifications" className="header-icon" title="Сповіщення">
              <FiBell />
            </Link>
            
            <div className="help-menu-container" ref={helpMenuRef}>
              <button
                className="header-icon"
                title="Допомога"
                onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
              >
                <FiHelpCircle />
              </button>
              {isHelpMenuOpen && (
                <div>
                  <ul className="help-dropdown-menu">
                    <li>
                      <Link to="/userQuestions" onClick={() => setIsHelpMenuOpen(false)}>Найчастіші запитання</Link>
                    </li>
                    <li>
                      <Link to="/userTips" onClick={() => setIsHelpMenuOpen(false)}>Поради</Link>
                    </li>
                    <li>
                      <Link to="/contact" onClick={() => setIsHelpMenuOpen(false)}>Контакти</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
           
            <div className="user-menu-container" ref={userMenuRef}>
              <button className="user-avatar-btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <img
              src={avatar || "https://i.pravatar.cc/60"}
              alt="User Avatar"
              className="ps-avatar"
              onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
            />
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <Link to="/userpage" onClick={() => setIsUserMenuOpen(false)}>Профіль</Link>
                  <button className="settings-btn" onClick={handleOpenSettings}>Налаштування</button>
                  <Link to="/balance"  onClick={() => setIsUserMenuOpen(false)}>Баланс</Link>
                 <button title="Вийти" className="logout-btn " onClick={handleLogout}>
              <FiLogOut />Вийти
            </button>
                 </div>
              )}
            </div>
          
           
          </>
        ) : (
          <>
            <Link to="/SignIn" className="btn-signin">Вхід</Link>
            <Link to="/SignUp" className="btn-signup">Реєстрація</Link>
          </>
        )}
      </div>
    </header>
    {isSettingsModalOpen && (
        <ProfileSettings onClose={handleCloseSettings} />
      )}
    {isEventsModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEventsModalOpen(false)}>
          <div className="modal-content events-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setIsEventsModalOpen(false)}
            >
              ✕
            </button>
            <Events />
          </div>
        </div>
      )} </>
  );
};

export default Header;

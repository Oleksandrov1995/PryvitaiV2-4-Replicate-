import React, { useState, useEffect, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHelpCircle, FiLogOut, FiMenu } from 'react-icons/fi';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Стан для мобільного меню
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Стан для модального вікна
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false); // Стан для модального вікна подій
  const [avatar, setAvatar] = useState(''); // Стан для збереження даних профілю
  const [userName, setUserName] = useState(''); // Стан для імені користувача
  const helpMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null); 
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsEventsModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsMobileMenuOpen(false);
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
            setUserName(data.user.name || data.user.email || '');
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

  const handleMobileMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Функція для отримання першої літери імені
  const getInitials = (name) => {
    if (!name) return 'U'; // User за замовчуванням
    return name.charAt(0).toUpperCase();
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
            {/* Іконка балансу */}
            <Link to="/balance" className="header-icon" title="Баланс">
              <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M464 128H416V112C416 50.144 365.856 0 304 0H80C35.888 0 0 35.888 0 80V352C0 405.056 43.944 449 97 449H464C485.056 449 502 432.056 502 411V166C502 144.944 485.056 128 464 128ZM80 32H304C348.112 32 384 67.888 384 112V128H97C69.832 128 47.2 142.712 34.744 164.312C32.808 152.184 32 139.4 32 126.4V80C32 52.632 52.632 32 80 32ZM470 411C470 414.312 467.312 417 464 417H97C61.688 417 33 388.312 33 353V192.8C33 174.04 48.24 158.8 67 158.8H464C467.312 158.8 470 161.488 470 164.8V411Z" fill="currentColor"/>
                <circle cx="384" cy="288" r="24" fill="currentColor"/>
              </svg>
            </Link>            {/* Мобільне меню кнопка */}
            <div className="mobile-menu-container" ref={mobileMenuRef}>
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Відкрити меню"
              >
                <FiMenu />
              </button>
              
              {isMobileMenuOpen && (
                <div className="mobile-dropdown-menu">
                  <Link to="/calendar" onClick={handleMobileMenuItemClick}>Календар привітань</Link>
                  <Link to="/tariffs" onClick={handleMobileMenuItemClick}>Тарифи</Link>
                  <Link to="/actions" onClick={handleMobileMenuItemClick}>Акції</Link>
                  <Link to="/gallery" onClick={handleMobileMenuItemClick}>Галерея</Link>
                  <button 
                    className="mobile-nav-button" 
                    onClick={() => {
                      handleMobileMenuItemClick();
                      setIsEventsModalOpen(true);
                    }}
                  >
                    Події
                  </button>
                </div>
              )}
            </div>
            
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
                {avatar ? (
                  <>
                    <img
                      src={avatar}
                      alt="User Avatar"
                      className="ps-avatar"
                      onError={(e) => { 
                        // Якщо аватар не завантажився, ховаємо зображення і показуємо заглушку
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentNode.querySelector('.avatar-initials').style.display = 'flex';
                      }}
                    />
                    <div 
                      className="avatar-initials" 
                      style={{ display: 'none' }}
                    >
                      {getInitials(userName)}
                    </div>
                  </>
                ) : (
                  <div className="avatar-initials">
                    {getInitials(userName)}
                  </div>
                )}
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <Link to="/userpage" onClick={() => setIsUserMenuOpen(false)}>Профіль</Link>
                  <button className="settings-btn" onClick={handleOpenSettings}>Налаштування</button>
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

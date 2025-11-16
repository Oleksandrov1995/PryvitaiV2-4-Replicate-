import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './SignIn.css'; // Reusing SignUp styles
import { API_URLS } from '../../../config/api';
import logo from '../../../images/logo.png';

const SignIn = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Будь ласка, заповніть всі поля.');
      return;
    }
    try {
      const res = await fetch(API_URLS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка входу');
      } else {
        setSuccess('Вхід успішний!');
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.dispatchEvent(new Event('storage'));
        }
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(); // Викликаємо callback для модального вікна
          } else {
            navigate('/'); // Стандартне перенаправлення якщо не модальне вікно
          }
        }, 1000);
      }
    } catch (err) {
      setError('Помилка зʼєднання з сервером');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (!forgotEmail) {
      setForgotMsg('Введіть email');
      return;
    }
    try {
      const res = await fetch(API_URLS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotMsg(data.error || 'Помилка надсилання email');
      } else {
        setForgotMsg(data.message || 'Інструкції надіслано на email');
      }
    } catch (err) {
      setForgotMsg('Помилка зʼєднання з сервером');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    fetch(API_URLS.GOOGLE_AUTH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('storage'));
        
        if (onSuccess) {
          onSuccess(); // Викликаємо callback для модального вікна
        } else {
          navigate('/'); // Стандартне перенаправлення якщо не модальне вікно
        }
      } else {
        setError(data.error || 'Помилка Google входу');
      }
    });
  };

  return (
    
      <div className="signup-container">
        <div className="signup-logo">
          <img src={logo} alt="Pryvitai Logo" style={{ height: '50px' }} />
        </div>

        {!showForgot ? (
          <>
            <h2>Вхід в профіль</h2>
     
             
        <GoogleOAuthProvider clientId="411952234902-th0g5fji6s9cept1tkqmdn8qj5brivhc.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={credentialResponse => {
              fetch(API_URLS.GOOGLE_AUTH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.dispatchEvent(new Event('storage'));
                    
                    if (onSuccess) {
                      onSuccess(); // Викликаємо callback для модального вікна
                    } else {
                      navigate('/'); // Стандартне перенаправлення якщо не модальне вікно
                    }
                  } else {
                    alert(data.error || 'Помилка Google входу');
                  }
                });
            }}
            onError={() => {
              console.log('Google Sign In Failed');
            }}
            text="signin_with"
          />
        </GoogleOAuthProvider>
     
          

            <div className="divider">АБО</div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Електронна пошта</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="im'ya@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Пароль</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Введіть ваш пароль"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              
              <div className="forgot-password-link">
                <button className="forgot-password-button" type="button" onClick={() => setShowForgot(true)}>
                  Забули пароль?
                </button>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}

              <button type="submit" className="submit-btn">Увійти</button>
            </form>

            <p className="login-link">
              Немає облікового запису? <Link to="/SignUp">Зареєструватись</Link>
            </p>
          </>
        ) : (
          <>
            <h2>Відновлення пароля</h2>
            <p className="forgot-password-info">Введіть вашу електронну пошту, і ми надішлемо вам інструкції для відновлення пароля.</p>
            <form className="signup-form" onSubmit={handleForgot}>
              <div className="input-group">
                <label htmlFor="forgotEmail">Електронна пошта</label>
                <input
                  type="email"
                  id="forgotEmail"
                  name="forgotEmail"
                  placeholder="im'ya@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              {forgotMsg && <p className={forgotMsg.includes('Помилка') ? "error-message" : "success-message"}>{forgotMsg}</p>}
              <button type="submit" className="submit-btn">Надіслати</button>
            </form>
            <p className="login-link">
              <button type="button" onClick={() => setShowForgot(false)}>
                Повернутись до входу
              </button>
            </p>
          </>
        )}
      </div>
   
  );
};

export default SignIn;

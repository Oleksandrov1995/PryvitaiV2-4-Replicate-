import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import './SignUp.css';
import { API_URLS } from '../../../config/api';
import logo from '../../../images/logo.png';
const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Мінімум 8 символів');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Хоча б одна велика літера');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Хоча б одна мала літера');
    }
    if (!/\d/.test(password)) {
      errors.push('Хоча б одна цифра');
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    setSuccess('');
    
    // Валідація пароля в реальному часі
    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Будь ласка, заповніть всі поля.');
      return;
    }
    
    // Перевірка валідності пароля
    const passwordValidationErrors = validatePassword(form.password);
    if (passwordValidationErrors.length > 0) {
      setError('Пароль не відповідає вимогам безпеки');
      return;
    }
    try {
      const res = await fetch(API_URLS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.email.split('@')[0],
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка реєстрації');
      } else {
        setSuccess('Реєстрація успішна!');
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.dispatchEvent(new Event('storage'));
        }
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setError('Помилка зʼєднання з сервером');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const res = await fetch(API_URLS.GOOGLE_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credentialResponse.credential }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem('token', data.token);
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        } else {
            setError(data.error || 'Помилка входу через Google');
        }
    } catch (err) {
        setError('Помилка зʼєднання з сервером');
    }
  };

  const triggerGoogleLogin = () => {
    const googleButtonContainer = document.querySelector('.google-login-btn');
    if (googleButtonContainer) {
        const button = googleButtonContainer.querySelector('div[role="button"]');
        if (button) {
            button.click();
        }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-logo">
            <img src={logo} alt="Pryvitai Logo" style={{ height: '50px' }} />
        </div>
        <h2>Створіть профіль</h2>

       
       
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
                    navigate('/');
                  } else {
                    alert(data.error || 'Помилка Google реєстрації');
                  }
                });
            }}
            onError={() => {
              console.log('Google Sign Up Failed');
            }}
            text="signup"
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
                placeholder="Створіть пароль"
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
            {form.password && (
              <div className="password-requirements">
                <div className="requirements-title">Вимоги до пароля:</div>
                <ul className="requirements-list">
                  <li className={form.password.length >= 8 ? 'valid' : 'invalid'}>
                    Мінімум 8 символів
                  </li>
                  <li className={/[A-Z]/.test(form.password) ? 'valid' : 'invalid'}>
                    Велика літера
                  </li>
                  <li className={/[a-z]/.test(form.password) ? 'valid' : 'invalid'}>
                    Мала літера
                  </li>
                  <li className={/\d/.test(form.password) ? 'valid' : 'invalid'}>
                    Цифра
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="submit-btn">Створити обліковий запис</button>
        </form>

        <p className="login-link">
          Вже маєте обліковий запис? <Link to="/SignIn">Увійти</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

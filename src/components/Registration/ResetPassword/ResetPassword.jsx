import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { API_URLS } from '../../../config/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

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

  const handlePasswordChange = (value) => {
    setPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!password || !confirmPassword) {
      setMsg('Заповніть всі поля');
      return;
    }
    if (password !== confirmPassword) {
      setMsg('Паролі не співпадають');
      return;
    }
    
    // Перевірка валідності пароля
    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setMsg('Пароль не відповідає вимогам безпеки');
      return;
    }
    try {
      const res = await fetch(API_URLS.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || 'Помилка');
      } else {
        setMsg(data.message || 'Пароль змінено!');
        setTimeout(() => navigate('/SignIn'), 1500);
      }
    } catch {
      setMsg('Помилка зʼєднання з сервером');
    }
  };

  return (
    <div className="reset-container">
      <h2>Відновлення пароля</h2>
      <form className="reset-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="password">Новий пароль</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Новий пароль"
              value={password}
              onChange={e => handlePasswordChange(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {password && (
            <div className="password-requirements">
              <div className="requirements-title">Вимоги до пароля:</div>
              <ul className="requirements-list">
                <li className={password.length >= 8 ? 'valid' : 'invalid'}>
                  Мінімум 8 символів
                </li>
                <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
                  Велика літера
                </li>
                <li className={/[a-z]/.test(password) ? 'valid' : 'invalid'}>
                  Мала літера
                </li>
                <li className={/\d/.test(password) ? 'valid' : 'invalid'}>
                  Цифра
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Підтвердіть новий пароль</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Підтвердіть новий пароль"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button type="submit">Змінити пароль</button>
        {msg && <div className="reset-msg">{msg}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;

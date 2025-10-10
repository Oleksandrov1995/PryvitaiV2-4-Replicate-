import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../config/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

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
        <input
          type="password"
          placeholder="Новий пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Підтвердіть новий пароль"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Змінити пароль</button>
        {msg && <div className="reset-msg">{msg}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;

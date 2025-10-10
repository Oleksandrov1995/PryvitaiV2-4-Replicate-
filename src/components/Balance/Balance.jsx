import React, { useState, useEffect } from 'react';
import './Balance.css';
import { API_URLS } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const Balance = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Користувач не авторизований');
        setLoading(false);
        return;
      }

      const response = await fetch(API_URLS.GET_ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Помилка при отриманні даних користувача');
      }

      const data = await response.json();
      setUserData(data.user);
    } catch (err) {
      setError(err.message);
      console.error('Помилка завантаження даних користувача:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpBalance = () => {
    // Перенаправляємо на сторінку тарифів
    navigate('/tariffs');
    
    // Додаємо невелику затримку для завантаження сторінки, потім скролимо до TariffPlan
    setTimeout(() => {
      const tariffPlanElement = document.querySelector('.pricing-section');
      if (tariffPlanElement) {
        tariffPlanElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };


  if (loading) {
    return (
      <div className="balance-container">
        <div className="loading">Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="balance-container">
        <div className="error">Помилка: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="balance-container">
        <div className="error">Дані користувача не знайдені</div>
      </div>
    );
  }

  return (
    <div className="balance-container">
      <div className="balance-header">
        <h2>Ваш баланс та тариф</h2>
      </div>

      <div className="balance-content">
        <div className="tariff-info">
          <div className="tariff-header">
            <span className="tariff-label">Ваш тариф та залишок:</span>
          </div>
          
          <div className="tariff-card">
            <div className="tariff-chart">
              <div className="chart-container">
                <div className="chart-bars">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                  <div className="bar bar-6"></div>
                  <div className="bar bar-7"></div>
                </div>
              </div>
            </div>
            
            <div className="tariff-details">
              <div className="tariff-name">
                <span className="tariff-title">{userData.tariff}</span>
                <span className="tariff-badge">Активний</span>
              </div>
              
              <div className="tariff-stats">
                <div className="stat-item">
                  <div className="stat-icon coins-icon">🪙</div>
                  <div className="stat-text">
                    <span className="stat-number">{userData.coins || 0}</span>
                    <span className="stat-label">монет</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="balance-info">
      
          <button className="top-up-button" onClick={handleTopUpBalance}>
            Поповнити баланс
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balance;

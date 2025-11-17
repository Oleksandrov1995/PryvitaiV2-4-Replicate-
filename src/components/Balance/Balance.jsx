import React, { useState, useEffect } from 'react';
import './Balance.css';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../../utils/fetchUserData';

const Balance = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await fetchUserData();
      setUserData(user);
    } catch (err) {
      setError(err.message);
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
        <div className="tariff-section">
        
          <div className="tariff-name">
            <p className="tariff-title">Тарифний план: <br/>  
            <span >{userData.tariff || 'Відсутній'}</span></p>
           
          </div>
          
          <div className="balance-card">
            <div className="balance-label">Ваш баланс:</div>
            <div className="balance-amount">{userData.coins || 0} монет</div>
          </div>
        </div>

        <div className="balance-actions">
          <button className="top-up-button" onClick={handleTopUpBalance}>
            Поповнити баланс
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balance;

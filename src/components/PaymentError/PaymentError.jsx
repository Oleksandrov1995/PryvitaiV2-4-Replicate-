import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentError.css';

const PaymentError = () => {
  const navigate = useNavigate();



 

  const handleTryAgain = () => {
    navigate('/tariff-plan');
  };

  const handleContactSupport = () => {
    // Тут можна додати логіку для відкриття чату або форми зворотного зв'язку
    window.location.href = 'mailto:support@pryvitai.com';
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const possibleReasons = [
    'Недостатньо коштів на картці',
    'Картка заблокована або прострочена',
    'Неправильно введені дані картки',
    'Технічні проблеми банку',
    'Перевищено ліміт платежів'
  ];

  return (
    <div className="payment-error-container">
      <div className="payment-error-card">
        <div className="error-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h1 className="error-title">
          Помилка при оплаті
        </h1>
        
        <div className="error-message">
          На жаль, сталася помилка під час обробки вашого платежу. Кошти не були
          списані з вашої картки.
        </div>
        
        <div className="possible-reasons">
          <h3 className="reasons-title">Можливі причини:</h3>
          <ul className="reasons-list">
            {possibleReasons.map((reason, index) => (
              <li key={index} className="reason-item">
                {reason}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="button-group">
          <button 
            className="btn-primary"
            onClick={handleTryAgain}
          >
            Спробувати ще раз
          </button>
          
          <button 
            className="btn-secondary"
            onClick={handleContactSupport}
          >
            Зв'язатися з підтримкою
          </button>
        </div>
        
        <button 
          className="btn-link"
          onClick={handleGoHome}
        >
          На головну
        </button>
        
        <div className="support-info">
          <h3 className="support-title">Потрібна допомога?</h3>
          <p className="support-description">
            Якщо проблема повторюється, зв'яжіться з нашою службою підтримки. Ми
            допоможемо вирішити будь-які питання з оплатою.
          </p>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span className="contact-text">Email: support@pryvitai.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-text">Телефон: +38 (099) 123-45-67</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PaymentError;

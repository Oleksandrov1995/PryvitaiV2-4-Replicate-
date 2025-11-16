import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();



  const handleGoToProfile = () => {
    navigate('/');
  };

  const handleCreateGreeting = () => {
    navigate('/generate-greeting');
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h1 className="success-title">
          Дякуємо за покупку! 
        </h1>
        
        <div className="success-message">
          Ваші монети будуть нараховані на рахунок як тільки платіж буде підтверджено ( близько 5 хвилин ).
        </div>
        
        <div className="button-group">
          <button 
            className="btn-primary"
            onClick={handleGoToProfile}
          >
            Перейти на головну
          </button>
          
          <button 
            className="btn-secondary"
            onClick={handleCreateGreeting}
          >
            Створити привітання
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PaymentSuccess;

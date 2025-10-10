import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate('/profile');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToProfile = () => {
    navigate('/profile');
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
          Платіж успішно завершено!
        </h1>
        
        <div className="success-message">
          Дякуємо за покупку! Ваші монети вже нараховані на рахунок.
        </div>
        
        <div className="button-group">
          <button 
            className="btn-primary"
            onClick={handleGoToProfile}
          >
            Перейти до профілю
          </button>
          
          <button 
            className="btn-secondary"
            onClick={handleCreateGreeting}
          >
            Створити привітання
          </button>
        </div>
        
        <div className="auto-redirect">
          Автоматичне перенаправлення через {countdown} секунд...
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

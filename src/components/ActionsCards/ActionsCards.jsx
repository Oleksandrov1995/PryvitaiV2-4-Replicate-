import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActionsCards.css';
import { ActionsCardsData } from '../../data/ActionsCardsData';
import CatWithCake from '../../images/CatWithCake.jpg';

const ActionsCards = () => {
  const navigate = useNavigate();

  const handleButtonClick = (cardId) => {
    if (cardId === 1) {
      navigate('/calendar');
    }
  };

  return (
    <div className="actions-cards-container">
      <div className="actions-header">
        <h2>Виконайте наступні умови та отримайте безкоштовні створення листівок</h2>
      </div>
      
      <div className="actions-cards">
        {ActionsCardsData.map((card) => (
          <div key={card.id} className="action-card">
            <div className="card-content">
              <div className="card-image">
                <img src={CatWithCake} alt={card.imageAlt} />
              </div>
              <div className="card-text">
                <h3>{card.title}</h3>
                <div className="reward-items">
                  {card.rewards.map((reward, index) => (
                    <div key={index} className="reward-item">
                      <div className="gift-icon">
                        <span>✚</span>
                      </div>
                      <span>{reward}</span>
                    </div>
                  ))}
                </div>
                {card.additionalText && (
                  <p className="additional-text">{card.additionalText}</p>
                )}
                {card.limitText && (
                  <p className="limit-text">{card.limitText}</p>
                )}
                <p className="card-description">
                  {card.description}
                </p>
                <button 
                  className={`action-button ${card.buttonType}`}
                  onClick={() => handleButtonClick(card.id)}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionsCards;

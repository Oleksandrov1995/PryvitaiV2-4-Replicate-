import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiStar } from "react-icons/fi";
import "./TariffPlan.css";
import { TarifPlansData } from "../../data/TarifPlansData";
import { handlePlanSelection } from "../../config/wayforpay";

const TariffPlan = () => {
  const navigate = useNavigate();

  // Функція обробки вибору тарифного плану
  const handlePlanClick = async (plan) => {
    // Перевірка авторизації
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/SignIn');
      return;
    }

    // Обробка платежу через WayForPay
    await handlePlanSelection(plan);
  };
  return (
    <section className="pricing-section">
      <h2 className="pricing-title">Оберіть свій план привітань</h2>
      <div className="plans-container">
        {TarifPlansData.map((plan, index) => (
          <div key={index} className={`plan-card ${plan.highlighted ? "highlighted" : ""}`}>
            {plan.badge && (
              <div className="plan-badge">
                {plan.badge} <FiStar />
              </div>
            )}
            
            <div className="plan-head">
              <h3 className="plan-title">{plan.title}</h3>
              <div className="plan-price">
                <span className="amount">{plan.price}</span>
                <span className="currency"> грн</span>
              </div>
              <div className="style-access">
                Доступ до <span className={plan.styleAccess === 'розширених' ? 'extended' : 'basic'}>{plan.styleAccess}</span> стилів
              </div>
            </div>

            <div className="plan-coins">
              <svg className="coin-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <circle cx="12" cy="12" r="7" fill="#FFED4E" stroke="#FFD700" strokeWidth="1"/>
                <path d="M8 12C8 10.5 9.5 9 12 9C14.5 9 16 10.5 16 12C16 13.5 14.5 15 12 15C9.5 15 8 13.5 8 12Z" fill="#FFD700"/>
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="#B8860B" fontWeight="bold"></text>
              </svg>
              <span className="coin-amount">{plan.coins.toLocaleString()} монет</span>
            </div>

            <div className="plan-section">
              <div className="section-title">Для створення:</div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="plan-feature">
                    <FiCheck className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-foot">
              <div className="term">{plan.term}</div>
              <button 
                className={`plan-btn ${plan.highlighted ? 'accent' : ''}`}
                onClick={() => handlePlanClick(plan)}
              >
                Обрати тариф
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TariffPlan;

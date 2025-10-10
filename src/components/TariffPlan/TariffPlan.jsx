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
              <span className="coin-icon">🪙</span>
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

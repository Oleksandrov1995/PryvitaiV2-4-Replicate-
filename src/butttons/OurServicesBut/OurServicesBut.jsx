import React from 'react';
import './OurServicesBut.css';
import { useNavigate } from 'react-router-dom';

const OurServicesBut = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      icon: '💡',
      title: 'Генератор ідей текстів привітань',
      description: 'Отримайте персональні та креативні ідеї текстів',
      buttonText: 'Згенерувати ідеї',
      route: '/GenerateText'
    },
    {
      id: 2,
      icon: '✨',
      title: 'Перетворення фото на листівку',
      description: 'Оберіть стиль, завантажте фото та додайте доповнення композиції.',
      buttonText: 'Створити листівку',
      route: '/StylizePhotoForPostcard'
    },
    {
      id: 3,
      icon: '📅',
      title: 'Завчасні нагадування',
      description: 'Додайте іменини та річниці до календаря привітань.',
      buttonText: 'Додати події',
      route: '/calendar'
    }
  ];

  const handleServiceClick = (route) => {
    navigate(route);
  };

  return (
    <section className="our-services-section">
      <div className="our-services-container">
        <h2 className="our-services-title">Наші Послуги та Інструменти</h2>
        
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <span className="icon-emoji">{service.icon}</span>
              </div>
              
              <h3 className="service-title">{service.title}</h3>
              
              <p className="service-description">{service.description}</p>
              
              <button 
                className="service-button"
                onClick={() => handleServiceClick(service.route)}
              >
                {service.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServicesBut;

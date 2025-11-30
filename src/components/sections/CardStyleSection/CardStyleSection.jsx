import React, { useState, forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CardStyleSection.css";
import { cardStyleOption } from "../../../data/options";
import { fetchUserData } from "../../../utils/fetchUserData";

const CardStyleSection = forwardRef(({ onStyleChange, scrollToNextSection, styleOptions = cardStyleOption }, ref) => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState("");
  const [customStyle, setCustomStyle] = useState("");
  const [showMore, setShowMore] = useState(false); // Для показу всіх стилів
  const [userTariff, setUserTariff] = useState("Без тарифу"); // За замовчуванням без тарифу

  // Завантаження даних користувача для перевірки тарифу
  useEffect(() => {
    const loadUserTariff = async () => {
      try {
        const userData = await fetchUserData();
        const newTariff = userData.tariff || "Без тарифу";
        setUserTariff(newTariff);
      } catch (error) {
        setUserTariff("Без тарифу");
      }
    };

    loadUserTariff();
  }, []);

  const handleOptionSelect = (styleObj) => {
    setSelectedStyle(styleObj.ua);  // Зберігаємо українську назву для UI
    setCustomStyle("");
    
    // Викликаємо callback функцію для передачі даних батьківському компоненту
    // Передаємо англійське значення для API
    if (onStyleChange) {
      onStyleChange("cardStyle", styleObj.en);
    }
    
    // Скролимо до наступної секції
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };



  // Переключення показу всіх стилів
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Перенаправлення на сторінку тарифів
  const handleUpgradeClick = () => {
    navigate('/tariffs');
  };

  // Отримуємо стилі для відображення з урахуванням тарифу
  const getAvailableStyles = () => {
    if (userTariff === "Без тарифу") {
      return styleOptions.slice(0, 3); // Тільки перші 3 стилі доступні для безкоштовного тарифу
    }
    return showMore ? styleOptions : styleOptions.slice(0, 5);
  };

  const getBlockedStyles = () => {
    if (userTariff === "Без тарифу") {
      // Для безкоштовного тарифу показуємо всі інші стилі як заблоковані
      const remainingStyles = showMore ? styleOptions.slice(3) : styleOptions.slice(3, 5);
      return remainingStyles;
    }
    return []; // Для платних тарифів немає заблокованих стилів
  };

  const availableStyles = getAvailableStyles();
  const blockedStyles = getBlockedStyles();
  const hasMoreStyles = styleOptions.length > 5;

  

  return (
    <section ref={ref} className="card-style-section">
      <h2>Стиль</h2>
      <div className="card-style-options">
        {availableStyles.map((styleObj) => (
          <button
            key={styleObj.ua}
            type="button"
            onClick={() => handleOptionSelect(styleObj)}
            className={`card-style-button ${selectedStyle === styleObj.ua && customStyle === "" ? "active" : ""}`}
          >
            {styleObj.ua}
          </button>
        ))}
        
        {/* Заблоковані стилі для безкоштовного тарифу */}
        {blockedStyles.map((styleObj) => (
          <button
            key={`blocked-${styleObj.ua}`}
            type="button"
            onClick={handleUpgradeClick}
            className="card-style-button blocked"
            title="Натисніть щоб переглянути тарифи"
          >
            {styleObj.ua}
            <span className="lock-icon">🔒</span>
          </button>
        ))}
        
        {/* Кнопка "Більше" для всіх користувачів */}
        {hasMoreStyles && !showMore && (
          <button
            type="button"
            onClick={toggleShowMore}
            className="card-style-button show-more-button"
          >
            Більше стилів
            <span className="arrow-icon">↓</span>
          </button>
        )}
        
        {/* Кнопка "Згорнути" для всіх користувачів */}
        {showMore && (
          <button
            type="button"
            onClick={toggleShowMore}
            className="card-style-button show-less-button"
          >
            Згорнути
            <span className="arrow-icon">↑</span>
          </button>
        )}
      </div>
      
    </section>
  );
});

export default CardStyleSection;


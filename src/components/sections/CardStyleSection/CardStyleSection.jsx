import React, { useState, forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CardStyleSection.css";
import { cardStyleOptions } from "../../../data/options";
import { fetchUserData } from "../../../utils/fetchUserData";

const CardStyleSection = forwardRef(({ onStyleChange, scrollToNextSection }, ref) => {
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

  const handleOptionSelect = (style) => {
    setSelectedStyle(style);
    setCustomStyle("");
    
    // Викликаємо callback функцію для передачі даних батьківському компоненту
    if (onStyleChange) {
      onStyleChange("cardStyle", style);
    }
    
    // Скролимо до наступної секції
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomStyleChange = (value) => {
    setCustomStyle(value);
    setSelectedStyle("");
    
    // Викликаємо callback функцію для передачі даних батьківському компоненту
    if (onStyleChange) {
      onStyleChange("cardStyle", value);
    }
  };

  const handleCustomStyleKeyDown = (e) => {
    if (e.key === 'Enter' && customStyle.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
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
      return cardStyleOptions.slice(0, 3); // Тільки перші 3 стилі доступні для безкоштовного тарифу
    }
    return showMore ? cardStyleOptions : cardStyleOptions.slice(0, 5);
  };

  const getBlockedStyles = () => {
    if (userTariff === "Без тарифу") {
      // Для безкоштовного тарифу показуємо всі інші стилі як заблоковані
      const remainingStyles = showMore ? cardStyleOptions.slice(3) : cardStyleOptions.slice(3, 5);
      return remainingStyles;
    }
    return []; // Для платних тарифів немає заблокованих стилів
  };

  const availableStyles = getAvailableStyles();
  const blockedStyles = getBlockedStyles();
  const hasMoreStyles = cardStyleOptions.length > 5;

  

  return (
    <section ref={ref} className="card-style-section">
      <h2>Стиль</h2>
      <div className="card-style-options">
        {availableStyles.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => handleOptionSelect(style)}
            className={`card-style-button ${selectedStyle === style && customStyle === "" ? "active" : ""}`}
          >
            {style}
          </button>
        ))}
        
        {/* Заблоковані стилі для безкоштовного тарифу */}
        {blockedStyles.map((style) => (
          <button
            key={`blocked-${style}`}
            type="button"
            onClick={handleUpgradeClick}
            className="card-style-button blocked"
            title="Натисніть щоб переглянути тарифи"
          >
            {style}
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
      {userTariff !== "Без тарифу" && (
        <input
          type="text"
          placeholder="Ваш креативний варіант - наприклад: в стилі мультика Енеїда"
          value={customStyle}
          onChange={(e) => handleCustomStyleChange(e.target.value)}
          onKeyDown={handleCustomStyleKeyDown}
          className="custom-style-input"
        />
      )}
    </section>
  );
});

export default CardStyleSection;


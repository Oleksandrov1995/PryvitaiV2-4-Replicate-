import React, { useState, forwardRef } from "react";
import "./BackgroundsSection.css";
import { optionsBackgrounds } from "../../../data/options";

const BackgroundsSection = forwardRef(({ onBackgroundChange, scrollToNextSection }, ref) => {
  const [selectedBackground, setSelectedBackground] = useState("");
  const [customBackground, setCustomBackground] = useState("");

  const handleOptionSelect = (background) => {
    setSelectedBackground(background);
    setCustomBackground("");
    
    if (onBackgroundChange) {
      onBackgroundChange("background", background);
    }
    
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomBackgroundChange = (value) => {
    setCustomBackground(value);
    setSelectedBackground("");
    
    if (onBackgroundChange) {
      onBackgroundChange("background", value);
    }
  };

  const handleCustomBackgroundKeyDown = (e) => {
    if (e.key === 'Enter' && customBackground.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };

  return (
    <section ref={ref} className="backgrounds-section">
      <h2>Фон для листівки</h2>
      <div className="backgrounds-options">
        {optionsBackgrounds.map((background) => (
          <button
            key={background}
            type="button"
            onClick={() => handleOptionSelect(background)}
            className={`backgrounds-button ${selectedBackground === background && customBackground === "" ? "active" : ""}`}
          >
            {background}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ваш креативний варіант - наприклад: гори в тумані"
        value={customBackground}
        onChange={(e) => handleCustomBackgroundChange(e.target.value)}
        onKeyDown={handleCustomBackgroundKeyDown}
        className="custom-background-input"
      />
    </section>
  );
});

export default BackgroundsSection;
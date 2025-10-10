import React, { useState, forwardRef } from "react";
import "./GenderAgeSection.css";

const GenderAgeSection = forwardRef(({ onGenderChange, onAgeChange, scrollToNextSection }, ref) => {
   const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [name, setName] = useState("");

  const genderOptions = [
    { value: "male", label: "Чоловік", icon: "👨" },
    { value: "female", label: "Жінка", icon: "👩" }
  ];


  const handleGenderSelect = (gender) => {
    setSelectedGender(gender.value);
    if (onGenderChange) {
      onGenderChange("gender", gender.value);
    }
  };

  const handleAgeInputChange = (value) => {
    setSelectedAge(value);
    if (onAgeChange) {
      onAgeChange("age", value);
    }
  };

  const handleNameInputChange = (value) => {
    setName(value);
    if (onGenderChange) {
      onGenderChange("name", value);
    }
  };

  // Скрол при деактивації поля імені
  const handleNameBlur = () => {
    if (selectedGender && selectedAge && name.trim().length > 0 && scrollToNextSection) {
      setTimeout(() => scrollToNextSection(), 300);
    }
  };


  return (
    <section ref={ref} className="gender-age-section">
      <h2>Основна інформація</h2>
      
      <div className="gender-age-container">
        <div className="gender-group">
          <h3>Стать</h3>
          <div className="gender-options">
            {genderOptions.map((gender) => (
              <button
                key={gender.value}
                type="button"
                onClick={() => handleGenderSelect(gender)}
                className={`gender-button ${selectedGender === gender.value ? "active" : ""}`}
              >
                <span className="gender-icon">{gender.icon}</span>
                {gender.label}
              </button>
            ))}
          </div>
        </div>

        <div className="age-group">
          <div className="age-name-row">
            <div className="age-input-container">
              <input
                type="number"
                min="1"
                max="120"
                placeholder="Вік"
                value={selectedAge}
                onChange={(e) => handleAgeInputChange(e.target.value)}
                className="age-input"
              />
              <span className="age-label"></span>
            </div>
            <div className="name-input-container">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameInputChange(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Ім'я"
                className="name-input"
              />
            </div>
          </div>

        
        </div>
      </div>
    </section>

  );
});

export default GenderAgeSection;

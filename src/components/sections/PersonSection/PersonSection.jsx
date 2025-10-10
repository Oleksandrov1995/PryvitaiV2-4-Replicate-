import React, { useState, forwardRef } from "react";
import "./PersonSection.css";
import { optionsPerson } from "../../../data/options";

export const PersonSection = forwardRef(({ onPersonChange, scrollToNextSection, selectedGender }, ref) => {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [customPerson, setCustomPerson] = useState("");

  const handlePersonSelect = (person) => {
    const personValue = typeof person === 'object' ? person.label : person;
    setSelectedPerson(personValue);
    setCustomPerson("");
    if (onPersonChange) {
      onPersonChange("person", personValue);
    }
    if (scrollToNextSection) {
      scrollToNextSection();
    }
  };

  const handleCustomPersonChange = (value) => {
    setCustomPerson(value);
    setSelectedPerson("");
    if (onPersonChange) {
      onPersonChange("person", value);
    }
  };

  const handleCustomPersonKeyDown = (e) => {
    if (e.key === 'Enter' && customPerson.trim().length >= 3) {
      e.preventDefault();
      if (scrollToNextSection) {
        setTimeout(() => scrollToNextSection(), 300);
      }
    }
  };

const filteredOptions = optionsPerson.filter(p => {
  if (!selectedGender || selectedGender === 'male') {
    return p.gender === 'male';
  }
  if (selectedGender === 'female') {
    return p.gender === 'female';
  }
  return false;
});


  return (
    <section ref={ref} className="person-section">
  
      <h2>Кого вітаємо?</h2>
      <div className="person-options">
        {filteredOptions.map((person) => {
          const personValue = typeof person === 'object' ? person.label : person;
          return (
          <button
            key={personValue}
            type="button"
            onClick={() => handlePersonSelect(person)}
            className={`person-button ${selectedPerson === personValue && customPerson === "" ? "active" : ""}`}
          >
            {personValue}
          </button>
        )})}
      </div>
      <input
        type="text"
        placeholder="Ваш варіант - наприклад: для колеги, для мами"
        value={customPerson}
        onChange={(e) => handleCustomPersonChange(e.target.value)}
        onKeyDown={handleCustomPersonKeyDown}
        className="custom-person-input"
      />
    </section>
  );
});
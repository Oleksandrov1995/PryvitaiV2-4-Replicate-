import React, { useRef, useEffect, useState } from "react";
import "./GenerateText.css";
import {
  GenderAgeSection,
  GreetingTextSection,
  TraitsSection,
  GreetingSubjectSection,
  HobbiesSection,
} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";
import { PersonSection } from "../../components/sections/PersonSection/PersonSection";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import SignInModal from "../../components/Registration/SignInModal/SignInModal";

export const GenerateText = () => {
  const navigate = useNavigate();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  
  // Перевірка авторизації при взаємодії з елементами
  const checkAuthBeforeAction = (callback) => {
    return (...args) => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsSignInModalOpen(true);
        return;
      }
      return callback(...args);
    };
  };

  // Перевірка авторизації при завантаженні сторінки
  useEffect(() => {
    const addClickListeners = () => {
      const interactiveElements = document.querySelectorAll('button, input, textarea, select, [role="button"]');
      
      interactiveElements.forEach(element => {
        const originalOnClick = element.onclick;
        element.onclick = (e) => {
          const token = localStorage.getItem('token');
          if (!token) {
            e.preventDefault();
            e.stopPropagation();
            setIsSignInModalOpen(true);
            return false;
          }
          if (originalOnClick) {
            return originalOnClick(e);
          }
        };
      });
    };

    // Додаємо слухачі після рендерингу
    const timer = setTimeout(addClickListeners, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
    // Оновлюємо сторінку або виконуємо необхідні дії після успішного входу
    window.location.reload();
  };

  // refs для секцій у правильному порядку
  const greetingSubjectRef = useRef(null);
  const genderAgeRef = useRef(null);
  const personRef = useRef(null);
  const traitsRef = useRef(null);
  const hobbiesRef = useRef(null);
  const greetingTextRef = useRef(null);

  // Масив refs, що відповідає порядку рендерингу компонентів
  const sectionRefs = [
    greetingSubjectRef,
    genderAgeRef,
    personRef,
    traitsRef,
    hobbiesRef,
    greetingTextRef,
  ];

  const { formData, updateField } = useFormData({
    gender: "",
    age: "",
    person: "", // Додано поле 'person'
    name: "",
    hobby: "",
    greetingText: "",
    greetingSubject: "",
    trait: "",
  });

  // універсальна функція для зміни поля
  const handleFieldChange = checkAuthBeforeAction((field, value) => updateField(field, value));

  // функція для скролу до наступної секції
  const createScrollToNextSection = (currentIndex) => () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < sectionRefs.length) {
      const next = sectionRefs[nextIndex]?.current;
      if (next && typeof next.scrollIntoView === "function") {
        next.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  };

  return (
    <div>
      <Header/>
  
    <div className="main-dalle-first-image">
      <div className="form-header">
        <h1>
          Створи персоналізоване текстове привітання або жест разом з
          Привітайком
        </h1>
      </div>
      <GreetingSubjectSection
        ref={sectionRefs[0]}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />
      <GenderAgeSection
        ref={sectionRefs[1]}
        onGenderChange={handleFieldChange}
        onAgeChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
      />
      <PersonSection
        ref={sectionRefs[2]}
        onPersonChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
        selectedGender={formData.gender}
      />
      <HobbiesSection
        ref={sectionRefs[3]}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />
      <TraitsSection
        ref={sectionRefs[4]}
        onTraitChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(4)}
      />

      <GreetingTextSection
        ref={sectionRefs[5]}
        onTextChange={handleFieldChange}
        formData={formData}
        scrollToNextSection={createScrollToNextSection(5)}
      />
    </div>
    <Footer/>
    <SignInModal 
      isOpen={isSignInModalOpen} 
      onClose={() => setIsSignInModalOpen(false)}
      onSuccess={handleSignInSuccess}
    />
      </div>
  );
};

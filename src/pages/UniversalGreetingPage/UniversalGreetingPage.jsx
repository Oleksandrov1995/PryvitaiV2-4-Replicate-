import React, { useRef, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./UniversalGreetingPage.css";
import LeftTree from "../../images/universalPage/LeftTree.png";
import RightTree from "../../images/universalPage/RightTree.png";
import {
  PhotoSection,
  CardStyleSection,
  ImageGenerationSection,
  GreetingSubjectSection,
  GenderAgeSection,
  HobbiesSection,
  TraitsSection,
  GreetingTextSection,
} from "../../components/sections";
import { cardStyleOptionNewYear } from "../../data/options";
import { useFormData } from "../../utils/formHandlers";
import BackgroundsSection from "../../components/sections/BackgroundsSection/BackgroundsSection";
import { StylizePhotoForPostcardApiSetting } from "../../prompts/replicate/StylizePhotoForPostcardPrompt";
import { PersonSection } from "../../components/sections/PersonSection/PersonSection";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SignInModal from "../../components/Registration/SignInModal/SignInModal";


export const UniversalGreetingPage = () => {
  const [showGreeting, setShowGreeting] = React.useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleShowGreeting = checkAuthBeforeAction(() => {
    setShowGreeting(true);
    // scroll to greeting block after it becomes visible
    setTimeout(() => {
      const target = sectionRefs[3]?.current; // greetingSubjectRef index in sectionRefs
      if (target && typeof target.scrollIntoView === "function")
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  });

  const handleImageGenerated = checkAuthBeforeAction((key, value) => {
    console.log('StylizePhotoForPostcard - handleImageGenerated:', { key, value });
    if (!key) return;
    if (key === "finalGeneratedImageUrl" || key === "imageUrl") {
      setGeneratedImageUrl(value);
      console.log('StylizePhotoForPostcard - встановлено generatedImageUrl:', value);
    }
    if (key === "generatedImagePrompt") {
      setGeneratedPrompt(value);
    }
  });

  // Ref для доступу до функції generateImage з ImageGenerationSection
  const generateImageRef = useRef(null);

  // Створюємо refs для кожної секції
  const styleRef = useRef(null);
  const photoRef = useRef(null);
  const imageGenerationRef = useRef(null);
  const greetingSubjectRef = useRef(null);
  const genderAgeRef = useRef(null);
  const personRef = useRef(null);
  const hobbiesRef = useRef(null);
  const traitsRef = useRef(null);
  const greetingTextRef = useRef(null);

  // Масив refs для зручності навігації (в порядку відображення на сторінці)
  const sectionRefs = [
    photoRef,           // 0 - PhotoSection
    styleRef,           // 1 - CardStyleSection
    imageGenerationRef, // 2 - ImageGenerationSection
    greetingSubjectRef, // 3 - GreetingSubjectSection (показується після onShowGreeting)
    genderAgeRef,       // 4 - GenderAgeSection
    personRef,          // 5 - PersonSection  
    hobbiesRef,         // 6 - HobbiesSection
    traitsRef,          // 7 - TraitsSection
    greetingTextRef,    // 8 - GreetingTextSection
  ];

  const { formData, updateField } = useFormData({
    cardStyle: "",
    cardMood: "",
    background: "",
    photo: null,
    gender: "",
    age: "",
    hobby: "",
    greetingText: "",
    greetingSubject: "",
    trait: "",
    generatedImagePrompt: "",
    imageUrl: "",
  });

  const handleFieldChange = checkAuthBeforeAction((field, value) => {
    updateField(field, value);
  });

  // Функція для скролу до наступної секції
  const createScrollToNextSection = (currentIndex) => {
    return () => {
      const nextIndex = currentIndex + 1;
      
      // Якщо досягли кінця секцій, не скролимо
      if (nextIndex >= sectionRefs.length) {
        console.log("Досягнуто кінця секцій");
        return;
      }
      
      const next = sectionRefs[nextIndex]?.current;
      console.log(`Скрол від секції ${currentIndex} до секції ${nextIndex}`, next, typeof next?.scrollIntoView);
      
      if (next && typeof next.scrollIntoView === "function") {
        next.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      } else {
        console.warn("Cannot scroll: target has no scrollIntoView");
      }
    };
  };

  return (
     <div>  
   <Header />
    <div className="main-dalle-first-image">
       
        <div className="form-header">
          <h1>
            Створи персоналізоване зображення до привітання разом з Привітайком
          </h1>
       
      </div>
   
      <PhotoSection
        ref={photoRef}
        title="Фото для створення листівки до Святого Миколая"
        description={
          <>
            Додайте фото <strong>однієї</strong> людини або домашнього улюбленця.
          </>
        }
        onPhotoChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
        showChristmasDecoration={true}
        leftTreeSrc={LeftTree}
        rightTreeSrc={RightTree}
      />
         <CardStyleSection
        ref={styleRef}
        onStyleChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
        styleOptions={cardStyleOptionNewYear}
      />

   
      <ImageGenerationSection
        ref={imageGenerationRef}
        onImagePromptChange={handleFieldChange}
        onImageUrlChange={handleFieldChange}
        formData={formData}
        generateImageData={StylizePhotoForPostcardApiSetting(formData)}
        generateImageRef={generateImageRef}
        scrollToNextSection={createScrollToNextSection(2)}
        onShowGreeting={handleShowGreeting}
        onImageGenerated={handleImageGenerated}
        hideBackgroundStep={true}
        useChristmasPrompt={true}
        useDirectPrompt={true}
      />
      {showGreeting && (
        <div className="greeting-subject-section">
          <GreetingSubjectSection
            ref={greetingSubjectRef}
            onSubjectChange={handleFieldChange}
            scrollToNextSection={createScrollToNextSection(3)}
          />
          <GenderAgeSection
            ref={genderAgeRef}
            onGenderChange={handleFieldChange}
            onAgeChange={handleFieldChange}
            scrollToNextSection={createScrollToNextSection(4)}
          />
          <PersonSection
            ref={personRef}
            onPersonChange={handleFieldChange}
            scrollToNextSection={createScrollToNextSection(5)}
            selectedGender={formData.gender}
          />
          <HobbiesSection
            ref={hobbiesRef}
            onHobbyChange={handleFieldChange}
            scrollToNextSection={createScrollToNextSection(6)}
          />
          <TraitsSection
            ref={traitsRef}
            onTraitChange={handleFieldChange}
            scrollToNextSection={createScrollToNextSection(7)}
          />

          <GreetingTextSection
            ref={greetingTextRef}
            onTextChange={handleFieldChange}
            formData={formData}
            generatedImageUrl={generatedImageUrl}
            navigate={navigate}
            scrollToNextSection={createScrollToNextSection(8)}
          />
        </div>
      )}
    
    </div>
   <Footer />
   <SignInModal 
     isOpen={isSignInModalOpen}
     onClose={() => setIsSignInModalOpen(false)}
     onSuccess={handleSignInSuccess}
   />
   </div>
  );
};

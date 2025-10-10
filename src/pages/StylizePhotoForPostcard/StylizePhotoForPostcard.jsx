import React, { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./StylizePhotoForPostcard.css";
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
import { useFormData } from "../../utils/formHandlers";
import BackgroundsSection from "../../components/sections/BackgroundsSection/BackgroundsSection";
import { StylizePhotoForPostcardApiSetting } from "../../prompts/replicate/StylizePhotoForPostcardPrompt";
import { PersonSection } from "../../components/sections/PersonSection/PersonSection";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export const StylizePhotoForPostcard = () => {
  const [showGreeting, setShowGreeting] = React.useState(false);

 const [generatedImageUrl, setGeneratedImageUrl] = useState("");
 const [generatedPrompt, setGeneratedPrompt] = useState("");
 const navigate = useNavigate();

  const handleShowGreeting = () => {
    setShowGreeting(true);
    // scroll to greeting block after it becomes visible
    setTimeout(() => {
      const target = sectionRefs[5]?.current; // greetingTextRef index in sectionRefs
      if (target && typeof target.scrollIntoView === "function")
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

   const handleImageGenerated = (key, value) => {
   if (!key) return;
   if (key === "finalGeneratedImageUrl" || key === "imageUrl") {
     setGeneratedImageUrl(value);
   }
   if (key === "generatedImagePrompt") {
     setGeneratedPrompt(value);
   }
 };

  // Ref для доступу до функції generateImage з ImageGenerationSection
  const generateImageRef = useRef(null);

  // Створюємо refs для кожної секції
  const styleRef = useRef(null);
  const moodRef = useRef(null);
  const backgroundsRef = useRef(null);
  const photoRef = useRef(null);
  const genderAgeRef = useRef(null);
  const hobbiesRef = useRef(null);
  const greetingTextRef = useRef(null);
  const greetingSubjectRef = useRef(null);
  const traitsRef = useRef(null);
  const imageGenerationRef = useRef(null);

  // Масив refs для зручності навігації
  const sectionRefs = [
    styleRef,
    moodRef,
    backgroundsRef,
    photoRef,
    genderAgeRef,
    hobbiesRef,
    greetingSubjectRef,
    traitsRef,
    greetingTextRef,
    imageGenerationRef,
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

  const handleFieldChange = (field, value) => {
    updateField(field, value);
  };

  // Функція для скролу до наступної секції
  const createScrollToNextSection = (currentIndex) => {
    return () => {
      const nextIndex = currentIndex + 1;
      const next = sectionRefs[nextIndex]?.current;
      console.log("scroll target", next, typeof next?.scrollIntoView);
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
      <CardStyleSection
        ref={styleRef}
        onStyleChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />

      <PhotoSection
        ref={photoRef}
        onPhotoChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />

      <BackgroundsSection
        ref={backgroundsRef}
        onBackgroundChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
      />
      <ImageGenerationSection
        ref={imageGenerationRef}
        onImagePromptChange={handleFieldChange}
        onImageUrlChange={handleFieldChange}
        formData={formData}
        generateImageData={StylizePhotoForPostcardApiSetting(formData)}
        generateImageRef={generateImageRef}
        scrollToNextSection={createScrollToNextSection(9)}
        onShowGreeting={handleShowGreeting}
        onImageGenerated={handleImageGenerated}
      />
      {showGreeting && (
        <div className="greeting-subject-section">
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
            <button onClick={() => {
       // take confirmed text (prefer formData.greetingText) and generated image url
       const text = (formData && formData.greetingText) ? formData.greetingText : "";
       if (!generatedImageUrl) {
         alert("Спочатку згенеруйте зображення.");
         return;
       }
       const params = new URLSearchParams({ imageUrl: generatedImageUrl, text });
       navigate(`/editor?${params.toString()}`);
     }}>Створити листівку</button>
        </div>
      )}
    
    </div>
   <Footer /></div>
  );
};

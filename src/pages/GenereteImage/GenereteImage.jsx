import React, { useRef, useState, useEffect } from "react";
import "./GenereteImage.css";
import { 
  GenderAgeSection, 
  PhotoSection,

  CardStyleSection, 
  CardMoodSection, 

  GreetingSubjectSection,
  HobbiesSection,
  ImageGenerationSection,

} from "../../components/sections";
import { useFormData } from "../../utils/formHandlers";
import { ButtonToMain } from "../../components/ButtonToMain/ButtonToMain";

export const GenereteImage = () => {
  // useState для контролю видимості фіксованої кнопки
  const [isFixedButtonVisible, setIsFixedButtonVisible] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref для доступу до функції generateImage з ImageGenerationSection
  const generateImageRef = useRef(null);
  
  // Створюємо refs для кожної секції
  const styleRef = useRef(null);
  const moodRef = useRef(null);
  const photoRef = useRef(null);
  const genderAgeRef = useRef(null);
  const hobbiesRef = useRef(null);

  const greetingSubjectRef = useRef(null);

  const imageGenerationRef = useRef(null);

  // Масив refs для зручності навігації
  const sectionRefs = [styleRef, moodRef, photoRef, genderAgeRef, hobbiesRef, greetingSubjectRef,imageGenerationRef];

  const { formData, updateField } = useFormData({
    cardStyle: '',
    cardMood: '',
    photo: null,
    gender: '',
    age: '',
    hobby: '',

    greetingSubject: '',
 
    generatedImagePrompt: '',
    imageUrl: ''
  });

  const handleFieldChange = (field, value) => {
    updateField(field, value);

  };



  // Функція для скролу до наступної секції
const createScrollToNextSection = (currentIndex) => {
  return () => {
    const nextIndex = currentIndex + 1;
    const next = sectionRefs[nextIndex]?.current;
    console.log('scroll target', next, typeof next?.scrollIntoView);
    if (next && typeof next.scrollIntoView === 'function') {
      next.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } else {
      console.warn('Cannot scroll: target has no scrollIntoView');
    }
  };
};


  return (
    <div className="main-dalle-first-image">
     <div className="form-header">
        <h1>Створи персоналізоване зображення до привітання або жесту разом з Привітайком</h1>
        </div>
        <ButtonToMain />
      <CardStyleSection 
        ref={styleRef}
        onStyleChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(0)}
      />
      
      <CardMoodSection 
        ref={moodRef}
        onMoodChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(1)}
      />
      
      <PhotoSection 
        ref={photoRef}
        onPhotoChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(2)}
      />
        
      <GenderAgeSection 
        ref={genderAgeRef}
        onGenderChange={handleFieldChange}
        onAgeChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(3)}
      />
      
      <HobbiesSection 
        ref={hobbiesRef}
        onHobbyChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(4)}
      />
 
      
      <GreetingSubjectSection 
        ref={greetingSubjectRef}
        onSubjectChange={handleFieldChange}
        scrollToNextSection={createScrollToNextSection(5)}
      />
      
       
      <ImageGenerationSection 
        ref={imageGenerationRef}
        onImageGenerated={handleFieldChange}
        formData={formData}
        onGenerateImageRef={generateImageRef}
        scrollToNextSection={createScrollToNextSection(6)}
      />

    
    </div>
  );
};

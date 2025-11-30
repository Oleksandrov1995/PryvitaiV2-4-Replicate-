import React, { useState, forwardRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageGenerationSection.css";
import { uploadPhoto } from "../../../config/uploadPhoto";
import { generateImagePrompt } from "../../../config/generateImagePrompt";
import { generateImageReplicate } from "../../../config/generateImageReplicate";
import { shareImage } from "../../../utils/shareUtils";
import { downloadImageFromUrl } from "../../../utils/downloadUtils";

import { StylizePhotoForPostcardApiSetting } from "../../../prompts/replicate/StylizePhotoForPostcardPrompt";
import { createPromptFluxKontextPro } from "../../../prompts/replicate/StylizePhotoForPostcardPrompt";
import {createCristmasPromt} from "../../../prompts/replicate/StylizePhotoForPostcardPrompt";
import { API_URLS } from "../../../config/api";

// ДОДАЄМО сюди функцію для збереження в галерею
async function saveImageToGallery(imageUrl) {
  const token = localStorage.getItem("token"); // беремо токен з localStorage
  if (!token) {
    console.warn("❌ Немає токена. Користувач не авторизований.");
    return;
  }

  try {
    const response = await fetch(API_URLS.ADD_TO_GALLERY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Не вдалося додати зображення.");
    }

    console.log("✅ Зображення додано в галерею:", data.message);
  } catch (err) {
    console.error("❌ Помилка при додаванні в галерею:", err);
  }
}

const ImageGenerationSection = forwardRef(
  (
    {
      onImageGenerated,
      scrollToNextSection,
      formData,
      onGenerateImageRef,
      greetingTextRef,
      generateImageData,
      onShowGreeting,
      hideBackgroundStep = false,
      useChristmasPrompt = false,
      useDirectPrompt = false,
    },
    ref
  ) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState("");
    const [userCoins, setUserCoins] = useState(0); // Додаємо стан для монет користувача
    const navigate = useNavigate();

    // Завантажуємо дані користувача при ініціалізації компонента
    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await fetch(API_URLS.GET_ME, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserCoins(data.user?.coins || 0);
          }
        } catch (error) {
          console.error('Помилка завантаження даних користувача:', error);
        }
      };

      fetchUserData();
    }, []);

    // Функція для переходу до редактора
    const handleEditImage = () => {
      if (!generatedImageUrl) return;

      // If parent provided an onShowGreeting handler, call it to reveal the greeting form
      if (typeof onShowGreeting === "function") {
        onShowGreeting();
        return;
      }

      // Fallback: navigate to editor with query params
      let textToUse = "";
      if (
        greetingTextRef &&
        greetingTextRef.current &&
        greetingTextRef.current.getCurrentText
      ) {
        textToUse = greetingTextRef.current.getCurrentText();
      } else {
        textToUse = formData.greetingText || "";
      }
      const params = new URLSearchParams({
        imageUrl: generatedImageUrl,
        text: textToUse,
      });
      navigate(`/editor?${params.toString()}`);
    };

    const generateImage = useCallback(async () => {
      // Перевіряємо авторизацію
      const token = localStorage.getItem('token');
      if (!token) {
        // Перенаправляємо на реєстрацію якщо користувач не авторизований
        navigate('/SignUp');
        return;
      }

      // Визначаємо тип генерації та необхідну кількість монет
      const isRegeneration = !!generatedImageUrl;
      const coinsRequired = isRegeneration ? 50 : 100;

      // Перевіряємо достатність монет
      if (userCoins < coinsRequired) {
        // Перенаправляємо на тарифи якщо баланс нуль або недостатньо монет
        navigate('/tariffs');
        return;
      }

      // Перевіряємо заповненість форми
      if (!isFormComplete()) {
        alert('Будь ласка, заповніть необхідні поля: стиль, фото та властивість');
        return;
      }

      setIsGenerating(true);

      try {
        console.log("FormData для генерації зображення:", formData);

        // Крок 1: Завантаження фото на Cloudinary (якщо є фото)
        let photoUrl =
          "https://res.cloudinary.com/dnma2ioeb/image/upload/v1754218865/pryvitai-photos/tldl1woyxzaqadwzogx1.jpg"; // заглушка
        if (formData.photo) {
          const convertToBase64 = (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (error) => reject(error);
            });

          const photoBase64 = await convertToBase64(formData.photo);
          photoUrl = await uploadPhoto(photoBase64);
        }

        // Крок 2: Генерація або пряме використання промпта
        let finalPrompt;
        if (useDirectPrompt && useChristmasPrompt) {
          // Пряме використання промпта з createCristmasPromt
          finalPrompt = createCristmasPromt(formData);
        } else {
          // Звичайна генерація промпта
          const promptFunction = useChristmasPrompt ? createCristmasPromt : createPromptFluxKontextPro;
          const generatedImagePrompt = await generateImagePrompt(
            promptFunction(formData)
          );
          finalPrompt = generatedImagePrompt.generatedPrompt;
        }
        
        const generateImageData = StylizePhotoForPostcardApiSetting(
          formData,
          finalPrompt,
          photoUrl
        );

        console.log("Дані для генерації зображення:", generateImageData);

     

        // Крок 3: Генерація зображення через Replicate
        const replicateResult = await generateImageReplicate({
          modelId: generateImageData.modelId,
          input: generateImageData.input,
          isRegeneration // Передаємо інформацію про тип генерації
        });

        // Обробляємо нову структуру відповіді
        const generatedImageUrlFromReplicate = replicateResult.generatedImageUrl || replicateResult;
        
        // Оновлюємо баланс монет якщо отримали нове значення
        if (replicateResult.coinsLeft !== undefined && replicateResult.coinsLeft !== null) {
          setUserCoins(replicateResult.coinsLeft);
        }

        // Крок 4: Завантаження згенерованого зображення на Cloudinary
        const uploadedGeneratedImageUrl = await uploadPhoto(
          generatedImageUrlFromReplicate
        );
        setGeneratedImageUrl(uploadedGeneratedImageUrl);

        // Крок 5: Збереження в галереї користувача
        await saveImageToGallery(uploadedGeneratedImageUrl);

        if (onImageGenerated) {
          onImageGenerated("finalGeneratedImageUrl", uploadedGeneratedImageUrl);
        }

        // Автоскрол після успішної генерації
        if (scrollToNextSection) setTimeout(() => scrollToNextSection(), 1000);
      } catch (error) {
        console.error("Помилка генерації зображення:", error);
        
        // Перевіряємо чи це помилка про недостатню кількість монет
        const errorMessage = error.message || '';
        if (errorMessage.includes('Недостатньо монет') || 
            errorMessage.includes('недостатньо монет') ||
            errorMessage.includes('insufficient coins') ||
            errorMessage.includes('Not enough coins')) {
          // Перенаправляємо на тарифи
          navigate('/tariffs');
          return;
        }
        
        alert(errorMessage || 'Виникла помилка при генерації зображення. Спробуйте ще раз.');
      } finally {
        setIsGenerating(false);
      }
    }, [formData, onImageGenerated, scrollToNextSection, userCoins]);

    const isFormComplete = () => {
      let completedFields = 0;

      if (formData.cardStyle) completedFields++;
      if (formData.photo) completedFields++;
      if (formData.trait) completedFields++;

      return completedFields >= 2;
    };

    // Передаємо функцію generateImage через ref
    useEffect(() => {
      if (onGenerateImageRef) {
        onGenerateImageRef.current = { generateImage, isGenerating };
      }
    }, [generateImage, isGenerating, onGenerateImageRef]);

    // Функція для скачування зображення
    const handleDownloadImage = async () => {
      if (!generatedImageUrl) return;

      const filename = `pryvitai-${Date.now()}.png`;
      await downloadImageFromUrl(generatedImageUrl, filename);
    };

    // Функція для поділитися зображенням
    const handleShareImage = async () => {
      if (!generatedImageUrl) return;
      
      await shareImage({ url: generatedImageUrl }, 'Привітайка від Pryvitai');
    };



    return (
      <section ref={ref} className="IGS-image-generation-section">
        {/* Блок статусу кроків */}
        <div className="IGS-steps-status">
          <div className={`IGS-step ${formData.cardStyle ? 'IGS-completed' : ''}`}>
            <span className="IGS-step-icon">✓</span>
            <span className="IGS-step-text">
              {formData.cardStyle || 'Оберіть стиль'}
            </span>
          </div>
          <div className={`IGS-step ${formData.photo ? 'IGS-completed' : ''}`}>
            <span className="IGS-step-icon">✓</span>
            <span className="IGS-step-text">
              {formData.photo ? 'Фото додано' : 'Додайте фото однієї людини'}
            </span>
          </div>
          {!hideBackgroundStep && (
            <div className={`IGS-step ${formData.background ? 'IGS-completed' : ''}`}>
              <span className="IGS-step-icon">✓</span>
              <span className="IGS-step-text">
                {formData.background || 'Оберіть фон або доповнення композиції'}
              </span>
            </div>
          )}
          <div className="IGS-step IGS-special-step">
            <span className="IGS-step-icon">🎨</span>
            <span className="IGS-step-text">Обличчя може трохи змінитись відповідно до стилю</span>
          </div>
        </div>

        <div className="IGS-generation-controls">
          <button
            onClick={generateImage}
            disabled={isGenerating}
            className={`IGS-generate-image-button ${isGenerating ? "IGS-disabled" : ""}`}
          >
            {isGenerating ? (
              <>
                <span className="IGS-loading-spinner"></span>
                Генерую зображення
              </>
            ) : generatedImageUrl ? (
              "🔄 Генерувати повторно"
            ) : (
              "Згенерувати зображення"
            )}
          </button>
          
          <div className="IGS-coins-info">
            {/* <span className="IGS-coins-count">У вас: {userCoins} 🪙</span> */}
            {/* {userCoins < (generatedImageUrl ? 50 : 100) && (
              <span className="IGS-insufficient-coins">
                Недостатньо монет для генерації (потрібно {generatedImageUrl ? 50 : 100})
              </span>
            )} */}
          </div>
        </div>        {isGenerating && (
          <div className="IGS-generation-time-info">
            <p>Генерація займає орієнтовно 2-3 хвилини</p>
          </div>
        )}

        {generatedImageUrl && (
          <div className="IGS-final-image-result">
            <p>
              <strong>🖼️ Фінальне згенероване зображення:</strong>
            </p>

            <div className="IGS-image-preview">
              <img
                src={generatedImageUrl}
                alt="Згенероване зображення"
                className="IGS-preview-image"
              />
            </div>
            <p>🌟 Фінальне зображення успішно згенеровано!</p>

            <div className="IGS-action-buttons">
              <button onClick={handleDownloadImage} className="IGS-action-button IGS-download-btn">
                <span className="IGS-button-icon">💾</span>
                Зберегти привітайку
              </button>

              <button className="IGS-action-button IGS-edit-btn" onClick={handleEditImage}>
                <span className="IGS-button-icon">✏️</span>
                Додати текст привітання
              </button>

              <button onClick={handleShareImage} className="IGS-action-button IGS-share-btn">
                <span className="IGS-button-icon">📤</span>
                Поділитися
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }
);

export default ImageGenerationSection;

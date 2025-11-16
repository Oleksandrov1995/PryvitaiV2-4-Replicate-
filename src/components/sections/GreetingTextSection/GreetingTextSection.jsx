import React, { useState, forwardRef, useRef, useEffect } from "react";
import "./GreetingTextSection.css";
import { greetingTextPrompts } from "../../../prompts/openai/greetingTextPrompts";
import { API_URLS } from "../../../config/api";
import {useNavigate} from "react-router-dom";

const GreetingTextSection = forwardRef(({ onTextChange, scrollToNextSection, formData, generatedImageUrl, navigate }, ref) => {
  console.log('GreetingTextSection - отримані пропси:', { generatedImageUrl });
  
  const navigateHook = useNavigate(); // Додаємо useNavigate hook
  const [greetingText, setGreetingText] = useState("");
  const [previewText, setPreviewText] = useState(""); // Проміжний стейт для попереднього перегляду
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGreetings, setGeneratedGreetings] = useState([]);
  const [userCoins, setUserCoins] = useState(0); // Додаємо стан для монет користувача
  const [hasSelectedGenerated, setHasSelectedGenerated] = useState(false); // Чи вибрав користувач згенеровану ідею
  const textareaRef = useRef(null);
  const generatedGreetingsRef = useRef(null);
  const maxLength = 500;

    const sectionRef = useRef(null); // окремий ref на DOM
  
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

  const getCurrentText = () => previewText || greetingText || '';


  // Експонуємо функцію через ref
  React.useImperativeHandle(ref, () => ({
    getCurrentText
  }));

  const handleTextChange = (value) => {
    if (value.length <= maxLength) {
      setPreviewText(value); // Оновлюємо тільки preview
      
      // Передаємо текст в formData
      if (onTextChange) {
        onTextChange("greetingText", value);
      }
      
      // Прибираємо автоматичний скрол звідси
    }
  };

  const handleManualTextChange = (value) => {
    handleTextChange(value);
    setHasSelectedGenerated(false); // Скидаємо флаг коли користувач вводить власний текст
  };

  const handleCopyText = async () => {
    if (!previewText) return;
    
    try {
      await navigator.clipboard.writeText(previewText);
      // Можна додати якесь повідомлення про успішне копіювання
      console.log('Текст скопійовано в буфер обміну');
    } catch (err) {
      console.error('Помилка копіювання:', err);
      // Fallback для старих браузерів
      const textArea = document.createElement('textarea');
      textArea.value = previewText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleShareText = async () => {
    if (!previewText) return;
    
    const shareData = {
      title: 'Текст привітання',
      text: previewText
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - копіюємо текст в буфер обміну
        await navigator.clipboard.writeText(previewText);
        alert('Текст скопійовано в буфер обміну');
      }
    } catch (err) {
      console.error('Помилка поділення:', err);
      // Додатковий fallback
      const textArea = document.createElement('textarea');
      textArea.value = previewText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Текст скопійовано в буфер обміну');
    }
  };

  const handleExampleClick = (example) => {
    handleTextChange(example);
    setHasSelectedGenerated(true); // Позначаємо, що користувач вибрав згенеровану ідею
    
    // Передаємо вибрану ідею в formData
    if (onTextChange) {
      onTextChange("greetingText", example);
    }
    
    // Скролимо до textarea після вибору варіанту
    if (textareaRef.current) {
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
      
      // Фокусуємося на textarea після скролу
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 500);
    }
  };

  const generateGreetingIdeas = async () => {
    // Перевіряємо авторизацію
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Для генерації тексту потрібно увійти в акаунт');
      return;
    }

    // Перевіряємо достатність монет
    if (userCoins < 10) {
      // Перенаправляємо на сторінку тарифів
      navigateHook('/tariffs');
      return;
    }

    setIsGenerating(true);
    setHasSelectedGenerated(false); // Скидаємо флаг при генерації нових ідей
    try {
    
      const prompt = greetingTextPrompts(formData);
         
      const response = await fetch(API_URLS.GENERATE_GREETING, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Додаємо токен авторизації
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Помилка при генерації привітань');
      }

      const data = await response.json();
      // Очищаємо привітання від лапок
      const cleanedGreetings = (data.greetings || []).map(greeting => 
        typeof greeting === 'string' ? greeting.replace(/^["']|["']$/g, '') : greeting
      );
      setGeneratedGreetings(cleanedGreetings);
      
      // Оновлюємо кількість монет після успішної генерації
      if (data.coinsLeft !== undefined) {
        setUserCoins(data.coinsLeft);
        // Додатково можемо відправити подію для оновлення інших компонентів
        window.dispatchEvent(new CustomEvent('coinsUpdated', { detail: { coins: data.coinsLeft } }));
      }
      
      // Скрол після генерації відключено
      // setTimeout(() => {
      //   if (generatedGreetingsRef.current && data.greetings && data.greetings.length > 0) {
      //     generatedGreetingsRef.current.scrollIntoView({
      //       behavior: 'smooth',
      //       block: 'start',
      //       inline: 'nearest'
      //     });
      //   }
      // }, 300); // Невелика затримка щоб DOM встиг оновитися
      
    } catch (error) {
      console.error('Помилка генерації:', error);
      alert(error.message || 'Виникла помилка при генерації привітань. Спробуйте ще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCharacterCountClass = () => {
    const remaining = maxLength - previewText.length;
    if (remaining < 50) return 'error';
    if (remaining < 100) return 'warning';
    return '';
  };

   React.useImperativeHandle(ref, () => ({
    scrollIntoView: (options) => sectionRef.current?.scrollIntoView(options),
    getCurrentText
  }));

  return (
    <section ref={sectionRef} className="GTS-greeting-text-section">
      <h2>Текст привітання</h2>
      {/* <p className="GTS-description">
        Напишіть особисте привітання або побажання. Це буде основний текст вашої картки.
      </p> */}

      <div className="GTS-generation-controls">
        <button 
          onClick={generateGreetingIdeas}
          disabled={isGenerating}
          className="GTS-generate-button"
          style={{ display: generatedGreetings.length > 0 ? 'none' : 'block' }}
        >
          {isGenerating ? 'Генерую...' : 'Згенерувати ідеї тексту привітання (10 🪙)'}
        </button>
        
        <div className="GTS-coins-info" style={{ display: generatedGreetings.length > 0 ? 'none' : 'block' }}>
          <span className="GTS-coins-count">У вас: {userCoins} 🪙</span>
          {userCoins < 10 && (
            <span className="GTS-insufficient-coins">Недостатньо монет для генерації</span>
          )}
        </div>
      </div>
        {/* <span>Генерація займе орієнтовно 30 секунд</span> - треба додати стилі */}

      <div className="GTS-greeting-text-container">
        <textarea
          ref={textareaRef}
          value={previewText}
          onChange={(e) => handleManualTextChange(e.target.value)}
          placeholder="Або Ваш варіант - наприклад: 'Бажаю здоров'я, щастя та квітучого процвітання!'"
          className="GTS-greeting-textarea"
          maxLength={maxLength}
        />
        
        <div className="GTS-character-counter">
          <span>Мінімум 20 символів для продовження</span>
          <span className={`GTS-character-count ${getCharacterCountClass()}`}>
            {previewText.length}/{maxLength}
          </span>
         
        </div>



        {generatedGreetings.length > 0 && (
          <div className="GTS-confirm-actions">
            <button 
              onClick={() => {
                if (generatedImageUrl) {
                  console.log('GreetingTextSection - Навігація до редактора з:', {
                    generatedImageUrl,
                    previewText
                  });
                  
                  // Підтверджуємо текст - переносимо з preview в основний стейт
                  setGreetingText(previewText);
                  
                  // Створюємо параметри для редактора
                  // Очищаємо текст від лапок перед передачею
                  const cleanText = previewText.replace(/^["']|["']$/g, '');
                  const editorParams = new URLSearchParams({
                    imageUrl: generatedImageUrl,
                    text: cleanText
                  });
                  
                  // Переходимо до редактора з параметрами URL
                  navigateHook(`/editor?${editorParams.toString()}`);
                } else {
                  console.log('GreetingTextSection - Відсутнє зображення, generatedImageUrl:', generatedImageUrl);
                  // Якщо немає зображення - ділимося текстом
                  handleShareText();
                }
              }}
              className="GTS-confirm-button"
              disabled={!previewText || previewText.length < 20 || isGenerating}
            >
              {isGenerating 
                ? 'Генерую...'
                : (generatedImageUrl 
                    ? (generatedGreetings.length > 0 && !hasSelectedGenerated 
                        ? 'Виберіть запропоноване привітання' 
                        :  'Додати до зображення')
                    
                    : (generatedGreetings.length > 0 && !hasSelectedGenerated 
                        ? 'Виберіть запропоноване привітання' 
                        : 'Поділитися'))}
            </button>
            
            <button 
              onClick={handleCopyText}
              disabled={!previewText}
              className="GTS-copy-button"
              title="Скопіювати текст"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
            </button>
            
            <button 
              onClick={generateGreetingIdeas}
              disabled={isGenerating || userCoins < 10}
              className="GTS-regenerate-button"
              title={isGenerating ? 'Генерую...' : (userCoins < 10 ? 'Недостатньо монет' : 'Згенерувати нові ідеї (10 монет)')}
            >
              {isGenerating ? (
                <span style={{color: 'white', fontSize: '14px', fontWeight: '500'}}>Генерую...</span>
              ) : (
                <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="40" rx="6" fill="#7F55E0"/>
                  <path d="M29.36 20.0149C29.36 18.5934 28.7955 17.2298 27.7903 16.2246C26.7855 15.2197 25.4224 14.6553 24.0013 14.6549C22.4889 14.6609 21.0373 15.2512 19.9499 16.3025L18.4437 17.8087C18.1821 18.0703 17.7579 18.0703 17.4963 17.8087C17.2346 17.547 17.2346 17.1229 17.4963 16.8612L19.0103 15.3472L19.274 15.1038C20.5779 13.9595 22.2548 13.3215 23.9974 13.3149H24L24.3324 13.3235C25.9883 13.4056 27.5599 14.0993 28.7378 15.2772C29.9942 16.5337 30.7 18.238 30.7 20.0149C30.7 20.385 30.4001 20.6849 30.03 20.6849C29.66 20.6849 29.36 20.385 29.36 20.0149Z" fill="white"/>
                  <path d="M17.325 13.9947C17.325 13.6247 17.6249 13.3247 17.995 13.3247C18.365 13.3247 18.665 13.6247 18.665 13.9947V16.6747H21.345C21.715 16.6747 22.015 16.9747 22.015 17.3447C22.015 17.7147 21.715 18.0147 21.345 18.0147H17.995C17.6249 18.0147 17.325 17.7147 17.325 17.3447L17.325 13.9947Z" fill="white"/>
                  <path d="M17.3 19.9849C17.3 19.6149 17.6 19.3149 17.97 19.3149C18.3401 19.3149 18.64 19.6149 18.64 19.9849C18.64 21.4065 19.2045 22.7701 20.2097 23.7753C21.2144 24.78 22.5772 25.3437 23.9981 25.3443C25.5108 25.3384 26.9626 24.7488 28.0501 23.6974L29.5564 22.1913C29.818 21.9295 30.2421 21.9295 30.5037 22.1913C30.7654 22.4529 30.7654 22.877 30.5037 23.1386L28.9897 24.6527L28.726 24.8961C27.4221 26.0404 25.7453 26.6784 24.0027 26.6849H24C22.2231 26.6849 20.5188 25.9792 19.2623 24.7227C18.0058 23.4662 17.3 21.7619 17.3 19.9849Z" fill="white"/>
                  <path d="M29.3351 26.0049V23.3249H26.6551C26.2851 23.3249 25.9851 23.0249 25.9851 22.6549C25.9851 22.2848 26.2851 21.9849 26.6551 21.9849L30.0051 21.9849L30.0738 21.9881C30.4116 22.0225 30.6751 22.308 30.6751 22.6549V26.0049C30.6751 26.3749 30.3751 26.6749 30.0051 26.6749C29.6351 26.6749 29.3351 26.3749 29.3351 26.0049Z" fill="white"/>
                </svg>
              )}
            </button>
          </div>
        )}

        {generatedGreetings.length > 0 && (
          <div ref={generatedGreetingsRef} className="GTS-generated-greetings">
            <h4>💡 Згенеровані ідеї привітань:</h4>
            <div className="GTS-greeting-options">
              {generatedGreetings.map((greeting, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(greeting)}
                  className="GTS-greeting-option"
                >
                  {greeting}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="GTS-greeting-tips">
                  <p>Перевірте згенерований текст на помилки та відредагуйте за необхідності</p>
        </div>
      </div>
    </section>
  );
});

export default GreetingTextSection;

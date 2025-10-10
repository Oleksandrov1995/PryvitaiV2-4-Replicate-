import React, { useState, forwardRef, useRef, useEffect } from "react";
import "./GreetingTextSection.css";
import { greetingTextPrompts } from "../../../prompts/openai/greetingTextPrompts";
import { API_URLS } from "../../../config/api";

const GreetingTextSection = forwardRef(({ onTextChange, scrollToNextSection, formData }, ref) => {
  const [greetingText, setGreetingText] = useState("");
  const [previewText, setPreviewText] = useState(""); // Проміжний стейт для попереднього перегляду
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGreetings, setGeneratedGreetings] = useState([]);
  const [userCoins, setUserCoins] = useState(0); // Додаємо стан для монет користувача
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

  const handleExampleClick = (example) => {
    handleTextChange(example);
    
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
      alert('Недостатньо монет для генерації тексту. Потрібно 10 монет. У вас: ' + userCoins);
      return;
    }

    setIsGenerating(true);
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
      setGeneratedGreetings(data.greetings || []);
      
      // Оновлюємо кількість монет після успішної генерації
      if (data.coinsLeft !== undefined) {
        setUserCoins(data.coinsLeft);
        // Додатково можемо відправити подію для оновлення інших компонентів
        window.dispatchEvent(new CustomEvent('coinsUpdated', { detail: { coins: data.coinsLeft } }));
      }
      
      // Скролимо до згенерованих привітань після їх отримання
      setTimeout(() => {
        if (generatedGreetingsRef.current && data.greetings && data.greetings.length > 0) {
          generatedGreetingsRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300); // Невелика затримка щоб DOM встиг оновитися
      
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
    <section ref={sectionRef} className="greeting-text-section">
      <h2>Текст привітання</h2>
      {/* <p className="description">
        Напишіть особисте привітання або побажання. Це буде основний текст вашої картки.
      </p> */}

      <div className="generation-controls">
        <button 
          onClick={generateGreetingIdeas}
          disabled={isGenerating || userCoins < 10}
          className="generate-button"
          style={{ display: generatedGreetings.length > 0 ? 'none' : 'block' }}
        >
          {isGenerating ? 'Генерую...' : 'Згенерувати ідеї тексту привітання (10 🪙)'}
        </button>
        
        <div className="coins-info" style={{ display: generatedGreetings.length > 0 ? 'none' : 'block' }}>
          <span className="coins-count">У вас: {userCoins} 🪙</span>
          {userCoins < 10 && (
            <span className="insufficient-coins">Недостатньо монет для генерації</span>
          )}
        </div>
      </div>
        {/* <span>Генерація займе орієнтовно 30 секунд</span> - треба додати стилі */}

      <div className="greeting-text-container">
        <textarea
          ref={textareaRef}
          value={previewText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Або Ваш варіант - наприклад: 'Бажаю здоров'я, щастя та квітучого процвітання!'"
          className="greeting-textarea"
          maxLength={maxLength}
        />
        
        <div className="character-counter">
          <span>Мінімум 20 символів для продовження</span>
          <span className={`character-count ${getCharacterCountClass()}`}>
            {previewText.length}/{maxLength}
          </span>
         
        </div>



        {generatedGreetings.length > 0 && (
          <div className="confirm-actions">
            <button 
              onClick={() => {
                // Підтверджуємо текст - переносимо з preview в основний стейт
                setGreetingText(previewText);
                
                if (scrollToNextSection) {
                  scrollToNextSection();
                }
              }}
              className="confirm-button"
              disabled={!previewText || previewText.length < 20}
            >
              ✅ Підтвердити ідею
            </button>
            
            <button 
              onClick={generateGreetingIdeas}
              disabled={isGenerating || userCoins < 10}
              className="regenerate-button"
              title={userCoins < 10 ? 'Недостатньо монет' : 'Згенерувати нові ідеї (10 монет)'}
            >
              🔄 {userCoins >= 10 ? '(10 🪙)' : ''}
            </button>
          </div>
        )}

        {generatedGreetings.length > 0 && (
          <div ref={generatedGreetingsRef} className="generated-greetings">
            <h4>💡 Згенеровані ідеї привітань:</h4>
            <div className="greeting-options">
              {generatedGreetings.map((greeting, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(greeting)}
                  className="greeting-option"
                >
                  {greeting}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="greeting-tips">
                  <p>Перевірте згенерований текст на помилки та відредагуйте за необхідності</p>
        </div>
      </div>
    </section>
  );
});

export default GreetingTextSection;

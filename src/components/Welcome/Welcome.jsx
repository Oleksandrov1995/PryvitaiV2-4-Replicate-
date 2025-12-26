import React from "react";
import "./Welcome.css";
import GroupIcon from "../../images/Group.svg";

const Welcome = () => {
  const handleCopyUrl = async () => {
    const url = "https://pryvitai.com/UniversalGreetingPage";
    
    try {
      // Спроба використання Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        console.log("✅ URL скопійовано через Clipboard API");
        // Показати повідомлення користувачу
        alert("Посилання скопійовано!");
        return;
      }
      
      // Fallback метод для старіших браузерів
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log("✅ URL скопійовано через execCommand");
        alert("Посилання скопійовано!");
      } else {
        throw new Error("execCommand failed");
      }
    } catch (error) {
      console.error("❌ Помилка копіювання:", error);
      alert("Не вдалося скопіювати посилання. Будь ласка, скопіюйте вручну.");
    }
  };

  const handleOpenInBrowser = () => {
    const url = "https://pryvitai.com/UniversalGreetingPage";
    const ua = navigator.userAgent || "";

    console.log("Спроба відкрити URL:", url);
    console.log("User Agent:", ua);

    try {
      // === Telegram WebView ===
      if (ua.includes("Telegram")) {
        console.log("📱 Виявлено Telegram WebView - перенаправлення в зовнішній браузер");
        // Використовуємо Telegram Web App API для відкриття в зовнішньому браузері
        if (window.Telegram?.WebApp?.openLink) {
          window.Telegram.WebApp.openLink(url);
          return;
        }
        // Fallback - відкриття через системний браузер
        window.open(url, '_system');
        return;
      }

      // === Instagram / Facebook / Meta WebView ===
      if (ua.includes("Instagram") || ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("FB_IAB")) {
        console.log("📱 Виявлено Instagram/Facebook WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS - комбінація методів для надійного відкриття
        try {
          window.location.href = url;
          setTimeout(() => {
            if (document.hasFocus()) {
              window.open(url, '_blank');
            }
          }, 1000);
        } catch (e) {
          window.location.assign(url);
        }
        return;
      }

      // === TikTok WebView ===
      if (ua.toLowerCase().includes("tiktok") || ua.includes("BytedanceWebview")) {
        console.log("📱 Виявлено TikTok WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS TikTok - прямий перехід
        window.location.href = url;
        return;
      }

      // === Twitter WebView ===
      if (ua.includes("Twitter")) {
        console.log("📱 Виявлено Twitter WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS Twitter - прямий перехід працює краще
        window.location.href = url;
        return;
      }

      // === WhatsApp WebView ===
      if (ua.includes("WhatsApp")) {
        console.log("📱 Виявлено WhatsApp WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS WhatsApp - надійний метод
        try {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Fallback якщо не спрацювало
          setTimeout(() => {
            if (document.hasFocus()) {
              window.location.href = url;
            }
          }, 500);
        } catch (e) {
          window.location.href = url;
        }
        return;
      }

      // === WeChat WebView ===
      if (ua.includes("MicroMessenger")) {
        console.log("📱 Виявлено WeChat WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS WeChat - спеціальна обробка (WeChat блокує багато методів)
        window.location.replace(url);
        return;
      }

      // === LinkedIn WebView ===
      if (ua.includes("LinkedInApp")) {
        console.log("📱 Виявлено LinkedIn WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS LinkedIn
        window.location.href = url;
        return;
      }

      // === Viber WebView ===
      if (ua.includes("Viber")) {
        console.log("📱 Виявлено Viber WebView - перенаправлення в зовнішній браузер");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS Viber
        window.location.assign(url);
        return;
      }

      // === Загальний WebView детектор ===
      const isWebView = ua.includes("wv") || ua.includes("WebView") || 
                       window.navigator.standalone === false ||
                       (window.outerWidth === 0 && window.outerHeight === 0);

      if (isWebView) {
        console.log("📱 Виявлено загальний WebView");
        if (ua.includes("Android")) {
          window.location.href = `intent://${url.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
          return;
        }
        // iOS WebView - покращена логіка
        if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) {
          try {
            // Спроба 1: Створення невидимого посилання
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Спроба 2: Якщо фокус залишився, використовуємо window.location
            setTimeout(() => {
              if (document.hasFocus()) {
                window.location.assign(url);
              }
            }, 1000);
          } catch (e) {
            // Останній варіант
            window.location.href = url;
          }
          return;
        }
        // Загальний fallback
        window.location.href = url;
        return;
      }

      // === Звичайні браузери ===
      console.log("🖥️ Звичайний браузер");
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        console.log("✅ Успішно відкрито в новій вкладці");
        return;
      }

      // Fallback для блокованих попапів
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("✅ Використано метод createElement");

    } catch (error) {
      console.error("❌ Помилка при відкритті:", error);
      
      // Останній fallback
      try {
        window.location.assign(url);
        console.log("✅ Використано window.location.assign");
      } catch (fallbackError) {
        console.error("❌ Fallback помилка:", fallbackError);
        window.location.href = url;
        console.log("✅ Використано window.location.href");
      }
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-icon">
          <img src={GroupIcon} alt="Group Icon" />
        </div>

        <h1 className="welcome-title">
          Для створення листівок перейдіть
          <br />
          у Ваш браузер
        </h1>

        <p className="welcome-subtitle">
          Для зручної реєстрації та збереження листівок відкрийте сторінку у
          Вашому браузері
        </p>

        <button className="welcome-button" onClick={handleOpenInBrowser}>
          Відкрити в браузері
        </button>
        
        <div className="welcome-manual-link">
          <p>Або скопіюйте посилання:</p>
          <div className="welcome-url-container">
            <input 
              type="text" 
              value="https://pryvitai.com/UniversalGreetingPage"
              readOnly
              className="welcome-url-input"
              onClick={(e) => e.target.select()}
            />
            <button 
              className="welcome-copy-button"
              onClick={handleCopyUrl}
              title="Копіювати посилання"
            >
              📋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

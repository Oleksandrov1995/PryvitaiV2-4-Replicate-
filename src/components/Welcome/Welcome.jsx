import React from 'react';
import './Welcome.css';
import GroupIcon from '../../images/Group.svg';

const Welcome = () => {
const handleOpenInBrowser = () => {
const url = "https://pryvitai.com/UniversalGreetingPage";


// 1. Electron
if (window.require) {
try {
const { shell } = window.require('electron');
shell.openExternal(url);
return;
} catch (e) {}
}


// 2. Windows UWP
if (window.external && typeof window.external.msLaunchUri === 'function') {
try {
window.external.msLaunchUri(url);
return;
} catch (e) {}
}


// 3. React Native WebView
if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
window.ReactNativeWebView.postMessage(
JSON.stringify({
type: 'OPEN_EXTERNAL_BROWSER',
url: url,
})
);
return;
}


// 4. Fallback
window.open(url, '_blank', 'noopener,noreferrer');
};
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* Іконка */}
        <div className="welcome-icon">
          <img src={GroupIcon} alt="Group Icon" />
        </div>
        
        {/* Заголовок */}
        <h1 className="welcome-title">
          Для створення листівок перейдіть
          <br />
          у Ваш браузер
        </h1>
        
        {/* Підзаголовок */}
        <p className="welcome-subtitle">
          Для зручної реєстрації та збереження листівок відкрийте сторінку у Вашому браузері
        
         
        </p>
        
        {/* Кнопка */}
        <button 
          className="welcome-button"
          onClick={handleOpenInBrowser}
        >
          Відкрити в браузері
        </button>
      </div>
    </div>
  );
};

export default Welcome;
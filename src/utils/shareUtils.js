/**
 * Утиліти для поділення контенту
 */

/**
 * Поділитися зображенням через Web Share API як файлом або fallback
 * @param {Object} img - об'єкт зображення з url
 * @param {string} img.url - URL зображення
 * @param {string} title - заголовок для поділення (за замовчуванням 'Згенероване зображення')
 */
export const shareImage = async (img, title = 'Згенероване зображення') => {
  if (!img.url) {
    console.error('❌ URL зображення не вказано');
    return;
  }

  try {
    // Завантажуємо зображення як blob
    const response = await fetch(img.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Створюємо файл з blob
    const fileName = `pryvitai-image-${Date.now()}.jpg`;
    const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

    // Перевіряємо чи підтримується Web Share API з файлами
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        // Поділитися файлом через нативне API
        await navigator.share({
          title: title,
          text: 'Подивіться на це зображення, створене за допомогою Pryvitai!',
          files: [file]
        });
        return;
      } catch (shareError) {
        console.log('Помилка при поділитися файлом:', shareError);
        // Продовжуємо до fallback
      }
    }

    // Fallback 1: спробуємо поділитися тільки посиланням
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Подивіться на це зображення, створене за допомогою Pryvitai!',
          url: img.url
        });
        return;
      } catch (shareUrlError) {
        console.log('Помилка при поділитися посиланням:', shareUrlError);
        // Продовжуємо до останнього fallback
      }
    }

    // Fallback 2: автоматичне завантаження файлу
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Файл завантажено! Тепер ви можете поділитися ним через будь-який месенджер або соціальну мережу.');
    
  } catch (error) {
    console.error('❌ Помилка при завантаженні зображення для поділення:', error);
    
    // Останній fallback: копіювання посилання
    try {
      await navigator.clipboard.writeText(img.url);
      alert('Посилання на зображення скопійовано в буфер обміну!');
    } catch (clipboardError) {
      console.error('Помилка копіювання:', clipboardError);
      // Fallback для старих браузерів
      const textArea = document.createElement('textarea');
      textArea.value = img.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Посилання скопійовано в буфер обміну!');
    }
  }
};
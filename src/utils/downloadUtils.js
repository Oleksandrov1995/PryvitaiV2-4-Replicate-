/**
 * Утиліти для завантаження файлів
 */

/**
 * Завантажує зображення з URL
 * @param {string} imageUrl - URL зображення для завантаження
 * @param {string} filename - ім'я файлу (за замовчуванням з timestamp)
 */
export const downloadImageFromUrl = async (imageUrl, filename = `pryvitai-${Date.now()}.png`) => {
  if (!imageUrl) {
    console.error('❌ URL зображення не вказано');
    return;
  }

  try {
    // Завантажуємо зображення як blob
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Створюємо URL для blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Додаємо в DOM, клікаємо та видаляємо
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Очищуємо ресурси
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ Зображення успішно завантажено: ${filename}`);
    return true;
  } catch (error) {
    console.error('❌ Помилка при завантаженні зображення:', error);
    
    // Fallback: спробуємо через пряме посилання
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Fallback завантаження виконано');
      return true;
    } catch (fallbackError) {
      console.error('❌ Fallback завантаження також не вдалося:', fallbackError);
      alert('Не вдалося завантажити файл. Спробуйте ще раз або використайте інший браузер.');
      return false;
    }
  }
};
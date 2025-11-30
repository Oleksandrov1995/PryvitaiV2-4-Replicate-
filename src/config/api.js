// Конфігурація API
const API_CONFIG = {
  // Базова URL для API запитів - використовуємо HTTP замість HTTPS
  BASE_URL:   'https://vps66716.hyperhost.name:5000/api',
  

  
  // Альтернативні хости для тестування
  ALTERNATIVE_HOSTS: [
    'https://vps66716.hyperhost.name:5000/api',
  
    'http://localhost:5000/api',
   
  ],
  
  // Окремі endpoints
  ENDPOINTS: {
    UPLOAD_PHOTO: '/upload-photo',
    GENERATE_GREETING: '/generate-greeting',
    GENERATE_IMAGE_PROMPT: '/generate-image-promt',
    GENERATE_IMAGE_REPLICATE: '/generate-image-replicate',
    HEALTH: '/health',

    // Автентифікація та користувачі
    GOOGLE_AUTH: '/google-auth',
    REGISTER: '/register',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    GET_ME: '/me',
    UPDATE_PHONE: '/update-phone',
    CHANGE_PASSWORD: '/change-password',
    DELETE_ACCOUNT: '/delete-account',
  UPDATE_AVATAR: '/update-avatar',

    // Маршрути галереї користувача
    ADD_TO_GALLERY: '/users/gallery',
    GET_GALLERY: '/users/gallery',
    DELETE_FROM_GALLERY: (index) => `/users/gallery/${index}`,

    // Маршрути генерації зображень
    GENERATE_IMAGE_OPENAI: '/openai/generateimage',

    // Платежі
    CREATE_PAYMENT: '/payment/create',
    VERIFY_PAYMENT: '/payment/verify',

    // Події календаря
    EVENTS_LIST: '/events',
    EVENTS_CREATE: '/events',
    EVENTS_UPDATE: (eventId) => `/events/${eventId}`,
    EVENTS_DELETE: (eventId) => `/events/${eventId}`,
  }
};

// Функція для отримання повного URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Експорт окремих URL для зручності
export const API_URLS = {
  UPLOAD_PHOTO: getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_PHOTO),
  GENERATE_GREETING: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_GREETING),
  GENERATE_IMAGE_PROMPT: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE_PROMPT),
  GENERATE_IMAGE_REPLICATE: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE_REPLICATE),
  HEALTH: getApiUrl(API_CONFIG.ENDPOINTS.HEALTH),

  // Автентифікація та користувачі
  GOOGLE_AUTH: getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_AUTH),
  REGISTER: getApiUrl(API_CONFIG.ENDPOINTS.REGISTER),
  LOGIN: getApiUrl(API_CONFIG.ENDPOINTS.LOGIN),
  FORGOT_PASSWORD: getApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD),
  RESET_PASSWORD: getApiUrl(API_CONFIG.ENDPOINTS.RESET_PASSWORD),
  GET_ME: getApiUrl(API_CONFIG.ENDPOINTS.GET_ME),
  UPDATE_PHONE: getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PHONE),
  CHANGE_PASSWORD: getApiUrl(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD),
  DELETE_ACCOUNT: getApiUrl(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT),
  UPDATE_AVATAR: getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_AVATAR),

  // Маршрути галереї користувача
  ADD_TO_GALLERY: getApiUrl(API_CONFIG.ENDPOINTS.ADD_TO_GALLERY),
  GET_GALLERY: getApiUrl(API_CONFIG.ENDPOINTS.GET_GALLERY),
  DELETE_FROM_GALLERY: (index) => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_FROM_GALLERY(index)}`,

  // Маршрути генерації зображень
  GENERATE_IMAGE_OPENAI: getApiUrl(API_CONFIG.ENDPOINTS.GENERATE_IMAGE_OPENAI),

  // Платежі
  CREATE_PAYMENT: getApiUrl(API_CONFIG.ENDPOINTS.CREATE_PAYMENT),
  VERIFY_PAYMENT: getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT),

  // Події календаря
  events: {
    list: getApiUrl(API_CONFIG.ENDPOINTS.EVENTS_LIST),
    create: getApiUrl(API_CONFIG.ENDPOINTS.EVENTS_CREATE),
    update: (eventId) => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS_UPDATE(eventId)}`,
    delete: (eventId) => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EVENTS_DELETE(eventId)}`,
  }
};

export default API_CONFIG;

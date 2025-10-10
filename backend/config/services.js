const dotenv = require('dotenv');
const OpenAI = require('openai');
const cloudinary = require('cloudinary').v2;

// Завантаження змінних середовища
dotenv.config();

// Ініціалізація OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Конфігурація Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  openai,
  cloudinary
};

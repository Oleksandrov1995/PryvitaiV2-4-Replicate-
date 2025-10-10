const { cloudinary } = require('../config/services');

// Контролер для завантаження фото на Cloudinary
const uploadPhoto = async (req, res) => {
  try {
    const { photoBase64 } = req.body;

    if (!photoBase64) {
      return res.status(400).json({ 
        error: 'Фото є обов\'язковим' 
      });
    }

    console.log('Завантажую фото на Cloudinary...');

    // Завантаження фото на Cloudinary
    const uploadResult = await cloudinary.uploader.upload(photoBase64, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      resource_type: 'image',
      folder: 'pryvitai-photos',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    console.log('Фото успішно завантажено:', uploadResult.secure_url);

    res.json({ 
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

  } catch (error) {
    console.error('Помилка при завантаженні фото:', error);
    
    res.status(500).json({ 
      error: 'Внутрішня помилка сервера при завантаженні фото',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  uploadPhoto
};

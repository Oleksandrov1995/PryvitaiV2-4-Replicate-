const { openai } = require('../config/services');
const User = require('../models/User');

// Контролер для генерації зображення промпта
const generateImagePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Промпт є обов\'язковим' 
      });
    }

    console.log('Відправляю запит до OpenAI для генерації промпта зображення...');
    console.log('Промпт:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Translate prompt to English"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const generatedPrompt = completion.choices[0].message.content;
    console.log('Згенерований промпт від OpenAI:', generatedPrompt);

    res.json({ 
      generatedPrompt: generatedPrompt.trim()
    });

  } catch (error) {
    console.error('Помилка при генерації промпта зображення:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'Перевищено ліміт запитів до OpenAI API' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Неправильний API ключ OpenAI' 
      });
    }

    res.status(500).json({ 
      error: 'Внутрішня помилка сервера при генерації промпта зображення',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Контролер для генерації привітань
const generateGreeting = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.userId; // Отримуємо з middleware авторизації

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Промпт є обов\'язковим' 
      });
    }

    // Перевіряємо, чи має користувач достатньо монет
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Користувача не знайдено' 
      });
    }

    if (user.coins < 10) {
      return res.status(400).json({ 
        error: 'Недостатньо монет для генерації тексту. Потрібно 10 монет.' 
      });
    }

    console.log('Відправляю запит до OpenAI...');
    console.log('Промпт:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Ти - експерт з написання привітань українською мовою. Твоя задача - створювати теплі, персоналізовані привітання. Завжди повертай відповідь у форматі JSON масиву з 5 елементів."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('Відповідь від OpenAI:', response);

    // Парсинг JSON відповіді
    let greetings;
    try {
      greetings = Array.isArray(responseText) ? responseText : JSON.parse(responseText);
    } catch (parseError) {
      console.error('Помилка парсингу JSON:', parseError);
      // Якщо OpenAI повернув не JSON, спробуємо витягти тексти вручну
      greetings = response
        .split('\n')
        .filter(line => line.trim() && !line.includes('[') && !line.includes(']'))
        .map(line => line.replace(/^\d+\.\s*"?|"?$/g, '').trim())
        .filter(line => line.length > 10)
        .slice(0, 5);
    }

    // Перевіряємо, чи є достатньо привітань
    if (!Array.isArray(greetings) || greetings.length === 0) {
      throw new Error('Не вдалося згенерувати привітання');
    }

    // Знімаємо 10 монет після успішної генерації
    user.coins -= 10;
    await user.save();

    res.json({ 
      greetings: greetings.slice(0, 5), // Обмежуємо до 5 привітань
      coinsLeft: user.coins // Повертаємо залишок монет
    });

  } catch (error) {
    console.error('Помилка при генерації привітання:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'Перевищено ліміт запитів до OpenAI API' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Неправильний API ключ OpenAI' 
      });
    }

    res.status(500).json({ 
      error: 'Внутрішня помилка сервера при генерації привітання',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  generateImagePrompt,
  generateGreeting
};

require('dotenv').config();
const Replicate = require("replicate");
const User = require('../models/User');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

exports.generateImage = async (req, res) => {
  try {
    const { modelId, input, isRegeneration = false } = req.body;
    const userId = req.user.userId; // Отримуємо з middleware авторизації

    // Визначаємо необхідну кількість монет
    const coinsRequired = isRegeneration ? 50 : 100;

    // Перевіряємо, чи має користувач достатньо монет
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Користувача не знайдено' 
      });
    }

    if (user.coins < coinsRequired) {
      return res.status(400).json({ 
        error: `Недостатньо монет для генерації зображення. Потрібно ${coinsRequired} монет.` 
      });
    }

    console.log("🚀 Sending request to Replicate:", { modelId, input, isRegeneration });

    // 1️⃣ Запускаємо генерацію
    const prediction = await replicate.predictions.create({
      model: modelId,
      input,
    });

    console.log("📡 Prediction created:", prediction.id);

    // 2️⃣ Чекаємо завершення (polling)
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      console.log(`⏳ Status: ${result.status}...`);
      await new Promise((r) => setTimeout(r, 2000)); // чекати 2 сек
      result = await replicate.predictions.get(result.id);
    }

    console.log("✅ Final prediction:", result);

    // 3️⃣ Перевіряємо, чи є URL
    const generatedImageUrl =
      Array.isArray(result.output) && result.output.length > 0
        ? result.output[0]
        : typeof result.output === "string"
        ? result.output
        : null;

    if (!generatedImageUrl) {
      return res.status(500).json({
        error: "Could not extract image URL from Replicate response.",
        replicateResponse: result,
      });
    }

    // Знімаємо монети після успішної генерації (50 за регенерацію, 100 за нову)
    user.coins -= coinsRequired;
    await user.save();

    // 4️⃣ Повертаємо URL та оновлений баланс
    return res.json({ 
      generatedImageUrl,
      coinsLeft: user.coins, // Повертаємо залишок монет
      coinsDeducted: coinsRequired // Інформація про знято монет
    });
  } catch (error) {
    console.error("❌ replicate error:", error);
    return res.status(500).json({
      error: "Replicate request failed",
      details: error.message,
    });
  }
};

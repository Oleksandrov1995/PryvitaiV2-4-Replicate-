const crypto = require('crypto');
require('dotenv').config();

const wayforpayConfig = {
  merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
  merchantSecretKey: process.env.WAYFORPAY_MERCHANT_SECRET_KEY,
  merchantPassword: process.env.WAYFORPAY_MERCHANT_PASSWORD,
  merchantDomainName: process.env.WAYFORPAY_MERCHANT_DOMAIN,
  returnUrl: process.env.WAYFORPAY_RETURN_URL,
  serviceUrl: process.env.WAYFORPAY_SERVICE_URL,
  paymentSuccessUrl: process.env.PAYMENT_SUCCESS_URL,
  paymentErrorUrl: process.env.PAYMENT_ERROR_URL
};

// Функція для генерації підпису WayForPay
const generateSignature = (data, secretKey) => {
  const signString = Object.values(data).join(';');
  return crypto.createHmac('md5', secretKey).update(signString).digest('hex');
};

// Створення платежу
const createPayment = async (req, res) => {
  try {
    console.log('🔍 CREATE_PAYMENT: Отримано запит:', {
      body: req.body,
      user: req.user,
      headers: {
        authorization: req.headers.authorization ? 'Присутній' : 'Відсутній'
      }
    });

    const { planId, planTitle, amount, coins } = req.body;
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (!userId) {
      console.log('❌ CREATE_PAYMENT: Користувач не авторизований, req.user:', req.user);
      return res.status(401).json({
        success: false,
        message: 'Користувач не авторизований'
      });
    }

    console.log(`🔄 Створення платежу:`);
    console.log(`   Користувач: ${req.user.name} (${req.user.email})`);
    console.log(`   User ID: ${userId}`);
    console.log(`   План: ${planTitle} (ID: ${planId})`);
    console.log(`   Сума: ${amount} грн`);
    console.log(`   Монети: ${coins}`);

    // Генеруємо унікальний ID замовлення з інформацією про план
    const orderId = `order_${userId}_${planId}_${Date.now()}`;
    console.log(`   Order ID: ${orderId}`);
    
    // Дані для WayForPay
    const paymentData = {
      merchantAccount: wayforpayConfig.merchantAccount,
      merchantDomainName: wayforpayConfig.merchantDomainName,
      orderReference: orderId,
      orderDate: Math.floor(Date.now() / 1000),
      amount: amount,
      currency: 'UAH',
      productName: [planTitle],
      productPrice: [amount],
      productCount: [1],
      clientFirstName: req.user.name || 'Користувач',
      clientLastName: req.user.surname || '',
      clientEmail: req.user.email,
      clientPhone: req.user.phone || '',
      language: 'UA',
      returnUrl: wayforpayConfig.returnUrl,
      serviceUrl: wayforpayConfig.serviceUrl
    };

    // Генеруємо підпис
    const signatureData = {
      merchantAccount: paymentData.merchantAccount,
      merchantDomainName: paymentData.merchantDomainName,
      orderReference: paymentData.orderReference,
      orderDate: paymentData.orderDate,
      amount: paymentData.amount,
      currency: paymentData.currency,
      productName: paymentData.productName[0],
      productCount: paymentData.productCount[0],
      productPrice: paymentData.productPrice[0]
    };

    paymentData.merchantSignature = generateSignature(signatureData, wayforpayConfig.merchantSecretKey);

    // Зберігаємо інформацію про замовлення в базі (опціонально)
    // Тут можна додати логіку збереження в MongoDB

    res.json({
      success: true,
      paymentData: paymentData,
      wayforpayUrl: 'https://secure.wayforpay.com/pay'
    });

  } catch (error) {
    console.error('Помилка створення платежу:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при створенні платежу'
    });
  }
};

// Обробка callback від WayForPay
const handleCallback = async (req, res) => {
  try {
    console.log('🔔 CALLBACK: Отримано запит від WayForPay:', req.body);
    console.log('🔔 CALLBACK: Headers:', req.headers);
    console.log('🔔 CALLBACK: Content-Type:', req.get('Content-Type'));
    
    // Перевіряємо чи є дані в body
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('⚠️ CALLBACK: Отримано порожній body від WayForPay');
      return res.json({
        orderReference: 'empty_body',
        status: 'decline',
        time: Math.floor(Date.now() / 1000)
      });
    }

    let callbackData = req.body;

    // WayForPay може відправляти дані як JSON рядок в ключі urlencoded
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      const bodyKeys = Object.keys(req.body);
      if (bodyKeys.length === 1 && bodyKeys[0].startsWith('{')) {
        try {
          callbackData = JSON.parse(bodyKeys[0]);
          console.log('🔄 CALLBACK: Парсинг JSON з urlencoded:', callbackData);
        } catch (parseError) {
          console.log('❌ CALLBACK: Помилка парсингу JSON:', parseError);
        }
      }
    }
    
    const { 
      merchantAccount, 
      orderReference, 
      amount, 
      currency, 
      authCode, 
      cardPan, 
      transactionStatus, 
      reasonCode,
      merchantSignature 
    } = callbackData;

    console.log(`🔍 CALLBACK: Деталі платежу:`);
    console.log(`   Merchant Account: ${merchantAccount}`);
    console.log(`   Order Reference: ${orderReference}`);
    console.log(`   Transaction Status: ${transactionStatus}`);
    console.log(`   Amount: ${amount} ${currency}`);
    console.log(`   Signature: ${merchantSignature}`);

    // Перевіряємо наявність обов'язкових полів
    if (!merchantAccount || !orderReference || !transactionStatus) {
      console.log('❌ CALLBACK: Відсутні обов\'язкові поля');
      return res.json({
        orderReference: orderReference || 'missing_fields',
        status: 'decline',
        time: Math.floor(Date.now() / 1000)
      });
    }

    // Перевіряємо підпис
    const signatureData = {
      merchantAccount,
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reasonCode
    };

    const expectedSignature = generateSignature(signatureData, wayforpayConfig.merchantSecretKey);
    console.log(`🔐 CALLBACK: Перевірка підпису:`);
    console.log(`   Отриманий: ${merchantSignature}`);
    console.log(`   Очікуваний: ${expectedSignature}`);

    if (merchantSignature !== expectedSignature) {
      console.log('❌ CALLBACK: Підпис не співпадає, відхиляємо запит');
      return res.status(400).json({
        orderReference,
        status: 'decline',
        time: Math.floor(Date.now() / 1000)
      });
    }

    console.log('✅ CALLBACK: Підпис перевірено успішно');

    // Якщо платіж успішний
    if (transactionStatus === 'Approved') {
      const User = require('../models/User');
      
      // Витягуємо userId та planId з orderReference
      const orderParts = orderReference.split('_');
      if (orderParts.length < 3) {
        console.log('❌ CALLBACK: Неправильний формат orderReference:', orderReference);
        return res.json({
          orderReference,
          status: 'accept',
          time: Math.floor(Date.now() / 1000)
        });
      }
      
      const userId = orderParts[1];
      const planId = orderParts[2];
      
      console.log(`🔄 CALLBACK: Обробка успішного платежу:`);
      console.log(`   Order Reference: ${orderReference}`);
      console.log(`   User ID: ${userId}`);
      console.log(`   Plan ID: ${planId}`);
      console.log(`   Сума: ${amount} грн`);
      
      // Визначаємо кількість монет за сумою платежу та ID плану
      let coinsToAdd = 0;
      let tariffName = '';
      
      // Спочатку намагаємось визначити за planId
      switch(planId) {
        case 'micro':
          coinsToAdd = 600;
          tariffName = 'Мікро';
          break;
        case 'mini':
          coinsToAdd = 1300;
          tariffName = 'Міні';
          break;
        case 'yearly':
          coinsToAdd = 4000;
          tariffName = 'Річний';
          break;
        case 'pryvitanator':
          coinsToAdd = 12700;
          tariffName = 'Привітанатор';
          break;
        case 'generator':
          coinsToAdd = 38000;
          tariffName = 'Генератор';
          break;
        default:
          // Якщо planId не розпізнано, визначаємо за сумою
          console.log(`⚠️ CALLBACK: Невідомий planId "${planId}", визначаємо за сумою`);
          switch(parseInt(amount)) {
            case 89:
              coinsToAdd = 600;
              tariffName = 'Мікро';
              break;
            case 165:
              coinsToAdd = 1300;
              tariffName = 'Міні';
              break;
            case 386:
              coinsToAdd = 4000;
              tariffName = 'Річний';
              break;
            case 985:
              coinsToAdd = 12700;
              tariffName = 'Привітанатор';
              break;
            case 1987:
              coinsToAdd = 38000;
              tariffName = 'Генератор';
              break;
            default:
              console.log('❌ CALLBACK: Невідома сума платежу:', amount);
          }
      }
      
      console.log(`💰 CALLBACK: Нараховується ${coinsToAdd} монет, тариф: "${tariffName}"`);
      
      // Нараховуємо монети користувачу
      if (coinsToAdd > 0) {
        try {
          console.log(`🔄 CALLBACK: Оновлення користувача ${userId}...`);
          
          const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { 
              $inc: { coins: coinsToAdd },
              $set: { tariff: tariffName }
            },
            { new: true } // Повертає оновлений документ
          );
          
          if (updatedUser) {
            console.log(`✅ CALLBACK: Платіж успішно оброблено:`);
            console.log(`   Користувач: ${updatedUser.name} (${updatedUser.email})`);
            console.log(`   Нараховано: ${coinsToAdd} монет`);
            console.log(`   Новий тариф: ${tariffName}`);
            console.log(`   Загальна кількість монет: ${updatedUser.coins}`);
          } else {
            console.error(`❌ CALLBACK: Користувача з ID ${userId} не знайдено`);
          }
        } catch (error) {
          console.error(`❌ CALLBACK: Помилка при оновленні користувача ${userId}:`, error);
        }
      } else {
        console.log(`⚠️ CALLBACK: Монети не нараховуються (${coinsToAdd})`);
      }
      
      console.log(`✅ CALLBACK: Платіж успішний: ${orderReference}, сума: ${amount} грн`);
    } else {
      // Обробка невдалих платежів
      console.log(`❌ CALLBACK: Платіж не успішний: ${orderReference}, статус: ${transactionStatus}, причина: ${reasonCode}`);
      
      // Можна додати логіку для збереження інформації про невдалі платежі
      // наприклад, для аналітики або служби підтримки
    }

    // Відповідь для WayForPay
    const response = {
      orderReference,
      status: 'accept',
      time: Math.floor(Date.now() / 1000)
    };
    
    console.log(`📤 CALLBACK: Відправляємо відповідь WayForPay:`, response);
    res.json(response);

  } catch (error) {
    console.error('❌ CALLBACK: Критична помилка обробки callback:', error);
    res.status(500).json({
      orderReference: req.body.orderReference || '',
      status: 'decline',
      time: Math.floor(Date.now() / 1000)
    });
  }
};

// Сторінка успішного платежу
const paymentSuccess = async (req, res) => {
  try {
    // Логіка для обробки успішного повернення користувача
    res.redirect(wayforpayConfig.paymentSuccessUrl);
  } catch (error) {
    console.error('Помилка сторінки успіху:', error);
    res.redirect(wayforpayConfig.paymentErrorUrl);
  }
};

// Сторінка невдалого платежу
const paymentError = async (req, res) => {
  try {
    // Логіка для обробки невдалого платежу
    console.log('Невдалий платіж, перенаправлення на сторінку помилки');
    res.redirect(wayforpayConfig.paymentErrorUrl);
  } catch (error) {
    console.error('Помилка сторінки помилки:', error);
    res.redirect(wayforpayConfig.paymentErrorUrl);
  }
};

// Отримання інформації про платежі користувача
const getUserPaymentInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = require('../models/User');
    
    const user = await User.findById(userId).select('name email tariff coins');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tariff: user.tariff,
        coins: user.coins
      }
    });
    
  } catch (error) {
    console.error('Помилка отримання інформації користувача:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка сервера'
    });
  }
};

module.exports = {
  createPayment,
  handleCallback,
  paymentSuccess,
  paymentError,
  getUserPaymentInfo
};
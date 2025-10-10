# Інтеграція з WayForPay

## Налаштування

1. Створіть файл `.env` в папці `backend/` за зразком `.env.example`
2. Заповніть необхідні дані WayForPay:

```bash
WAYFORPAY_MERCHANT_ACCOUNT=your_merchant_account
WAYFORPAY_MERCHANT_SECRET_KEY=your_merchant_secret_key
WAYFORPAY_MERCHANT_PASSWORD=your_merchant_password
WAYFORPAY_MERCHANT_DOMAIN=your_domain.com
WAYFORPAY_RETURN_URL=https://your_domain.com/payment-success
WAYFORPAY_SERVICE_URL=https://your_domain.com/api/payment/callback
```

## Як працює система платежів

### 1. Ініціація платежу
- Користувач натискає на тарифний план
- Система перевіряє авторизацію
- Створюється запит на `/api/payment/create`
- Генерується підпис для WayForPay
- Користувач перенаправляється на WayForPay

### 2. Обробка платежу
- WayForPay обробляє платіж
- Надсилає callback на `/api/payment/callback`
- Система перевіряє підпис
- При успішному платежі нараховуються монети
- Оновлюється тариф користувача

### 3. Повернення користувача
- Після платежу користувач повертається на сайт
- Показується сторінка успіху `/payment-success`
- Автоматичне перенаправлення в профіль

## API Endpoints

### POST /api/payment/create
Створення платежу (потребує авторизації)

**Body:**
```json
{
  "planId": "micro",
  "planTitle": "Мікро",
  "amount": 89,
  "coins": 600
}
```

**Response:**
```json
{
  "success": true,
  "paymentData": {
    "merchantAccount": "...",
    "orderReference": "...",
    "amount": 89,
    // ... інші поля для WayForPay
  },
  "wayforpayUrl": "https://secure.wayforpay.com/pay"
}
```

### POST /api/payment/callback
Callback від WayForPay (без авторизації)

### GET /api/payment/success
Сторінка успішного платежу

## Тарифні плани

| План | Ціна | Монети | ID |
|------|------|--------|-----|
| Мікро | 89 грн | 600 | micro |
| Міні | 165 грн | 1300 | mini |
| Річний | 386 грн | 4000 | yearly |
| Привітанатор | 985 грн | 12700 | premium |

## Безпека

- Всі секретні ключі зберігаються в `.env`
- Підписи перевіряються при кожному callback
- Токени авторизації перевіряються перед створенням платежу
- orderReference містить userId для ідентифікації
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function authMiddleware(req, res, next) {
  console.log('🔐 AUTH: Перевірка авторизації...');
  console.log('🔐 AUTH: Headers:', req.headers.authorization ? 'Authorization header присутній' : 'Authorization header відсутній');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('❌ AUTH: Токен не надано');
    return res.status(401).json({ error: 'Токен не надано' });
  }
  
  console.log('🔍 AUTH: Токен отримано, перевіряємо...');
  console.log('🔍 AUTH: Токен (перші 20 символів):', token.substring(0, 20) + '...');
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ AUTH: Помилка верифікації токена:', err.message);
      return res.status(403).json({ error: 'Невірний токен' });
    }
    
    console.log('✅ AUTH: Токен валідний, користувач:', user.email);
    console.log('✅ AUTH: User ID:', user.id || user.userId || user._id);
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;

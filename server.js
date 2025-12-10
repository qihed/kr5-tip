const express = require('express');
const path = require('path');
const contactsRoutes = require('./routes/contacts');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON (обработка тела запроса)
app.use(express.json());

// Middleware для парсинга URL-encoded данных
app.use(express.urlencoded({ extended: true }));

// Собственный middleware для логирования
app.use(logger);

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты API
app.use('/api/contacts', contactsRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`API доступно по адресу http://localhost:${PORT}/api/contacts`);
});


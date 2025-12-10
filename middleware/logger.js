// Собственный middleware для логирования запросов
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Сохраняем время начала запроса для вычисления времени выполнения
  req.startTime = Date.now();
  
  // Перехватываем событие завершения ответа
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = logger;


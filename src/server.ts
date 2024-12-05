import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import pino from 'pino-http';
import connectToDatabase from './utils/mongoDB';
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes'; // Оновлено для підключення imageRoutes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для обробки JSON
app.use(
  express.json(),
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);


// Підключення маршрутів
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes); // Підключення маршруту для фото
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Підключення до бази даних та запуск сервера
connectToDatabase().then(() => {
  console.log('Connected to the database successfully');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});

// Простий маршрут для перевірки
app.get('/api', (req, res) => {
  console.log('GET /api endpoint accessed');
  res.send('Hello from backend!');
});

import express from 'express';
import path from 'path';
import pino from 'pino-http';
import cors from 'cors';
import connectToDatabase from './utils/mongoDB';
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes';
import errorHandler from './middleware/errorHandler'; // Переконайтесь, що шлях правильний

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Це дозволяє фронтенду доступатися до бекенду на іншому порту

// Проміжна програма для обробки JSON
app.use(
  express.json(),
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

// Статичні файли для доступу до завантажених фото
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// Ваші API маршрути
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Підключення до бази даних та запуск сервера
connectToDatabase().then(() => {
  console.log('Підключено до бази даних успішно');
  app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Не вдалося запустити сервер:', error);
});

// Тестовий маршрут
app.get('/api', (req, res) => {
  console.log('Доступ до GET /api');
  res.send('Привіт від бекенду!');
});

// Використання обробника помилок
app.use(errorHandler);

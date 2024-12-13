// src/server.ts
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import path from 'path';
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Налаштування проміжного ПЗ
app.use(cors()); // Дозволяє CORS
app.use(
  express.json(),
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

// Налаштування доступу до статичних файлів
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// API маршрути
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

// Головний маршрут
app.get('/api', (req, res) => {
  res.send('Привіт від бекенду!');
});

// Обробка помилок
app.use(errorHandler);

// Експортуємо функцію запуску сервера
export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

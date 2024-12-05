import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv'
import connectToDatabase from './utils/mongoDB';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Підключення маршрутів
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware для обробки JSON
app.use(bodyParser.json());

// Підключення до бази даних та запуск сервера
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});

// Простий маршрут для перевірки
app.get('/api', (req, res) => {
  res.send('Hello from backend!');
});

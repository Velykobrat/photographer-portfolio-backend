// src/index.ts
import dotenv from 'dotenv';
import connectToDatabase from './utils/mongoDB';
import { startServer } from './server';
import { createDirIfNotExists } from './utils/createDirIfNotExists';
import path from 'path';

// Завантажуємо змінні оточення
dotenv.config();

// Константи для директорій
const TEMP_UPLOAD_DIR = path.resolve(process.cwd(), 'temp_uploads');
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

const bootstrap = async () => {
  try {
    // Підключення до бази даних
    await connectToDatabase();

    // Створення необхідних директорій, якщо вони не існують
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);

    // Запуск сервера
    startServer();
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    process.exit(1); // Завершуємо процес у разі помилки
  }
};

// Запускаємо програму
bootstrap();

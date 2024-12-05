// controllers/imageController.ts
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Image from '../models/imageModel'; // Модель Mongoose
import { uploadImage, deleteImage as deleteImageService, getUserImages as getUserImagesService } from '../services/imageService';


// Контролер для отримання зображень користувача
export const getUserImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Знаходження всіх зображень у колекції
    const images = await Image.find(); // Використання моделі Mongoose для отримання даних
    res.status(200).json(images);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};


// Контролер для додавання зображення
export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'File is required' });
      return;
    }

    const userId = req.body.userId;
    const newImage = await uploadImage(req.file, userId);

    res.status(201).json(newImage);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Контролер для видалення зображення
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Отримуємо ID з параметрів маршруту

    console.log('Received request to delete image with ID:', id);

    // Перевірка на валідність ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Некоректний формат ID' });
      return; // Повертаємо з функції після відповіді
    }

    // Викликаємо функцію видалення
    const result = await deleteImageService(id);

    // Перевірка на результат
    if (!result) {
      res.status(404).json({ message: 'Зображення не знайдено' });
      return; // Повертаємо з функції після відповіді
    }

    res.status(200).json({ message: 'Зображення успішно видалено' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in deleteImage controller:', error.message);
      res.status(500).json({ message: 'Помилка при видаленні зображення: ' + error.message });
    } else {
      console.error('Unexpected error in deleteImage controller');
      res.status(500).json({ message: 'Сталася непередбачена помилка' });
    }
  }
};
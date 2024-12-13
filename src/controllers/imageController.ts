// controllers/imageController.ts

import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Image from '../models/imageModel'; // Модель Mongoose
import {
  uploadImage as uploadImageService,
  deleteImage as deleteImageService,
  getAllImages as getAllImagesService,
} from '../services/imageService';

// Контролер для отримання всіх зображень
export const getAllImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Отримання всіх зображень із колекції
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

// Контролер для додавання зображення
export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req.file:', req.file);
    console.log('req.fileValidationError:', req.fileValidationError);
    console.log('req.body:', req.body); // Логування тіла запиту

    if (!req.file) {
      res.status(400).json({ message: 'File is required' });
      return;
    }

    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ message: 'UserId is required' });
      return;
    }

    console.log('Calling uploadImageService...');
    const newImage = await uploadImageService(req.file, userId);

    console.log('Image uploaded successfully:', newImage);
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error in addImage:', error); // Логування помилок
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ message: errorMessage });
  }
};


// Контролер для видалення зображення
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('Request to delete image with ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const result = await deleteImageService(id);

    if (result.message === 'Image deleted successfully') {
      res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error in deleteImage controller:', errorMessage);
    res.status(500).json({ message: `Error deleting image: ${errorMessage}` });
  }
};

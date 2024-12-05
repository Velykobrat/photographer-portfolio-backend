// services/imageService.ts
import cloudinary from '../utils/Cloudinary';
import Image from '../models/imageModel';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

// Функція для отримання всіх зображень користувача з бази даних
export const getUserImages = async (userId: string) => {
  try {
    const images = await Image.find({ userId });

    if (!images || images.length === 0) {
      throw new Error('No images found');
    }

    return images;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error retrieving user images: ' + error.message);
    } else {
      throw new Error('Error retrieving user images: An unknown error occurred');
    }
  }
};


// Функція для завантаження зображення в Cloudinary та збереження інформації в базу даних
export const uploadImage = async (file: Express.Multer.File, userId: string) => {
  try {
    const { path } = file;
    const result = await cloudinary.uploader.upload(path, {
      folder: 'photographer-portfolio',
      use_filename: true,
      unique_filename: false,
    });

    const newImage = new Image({
      userId: new Types.ObjectId(userId),
      filePath: result.secure_url,
      description: file.originalname,
    });

    await newImage.save();

    return newImage;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error uploading image: ' + error.message);
    } else {
      throw new Error('Error uploading image: An unknown error occurred');
    }
  }
};


// Функція для видалення зображення з Cloudinary та бази даних
// Видалення з бази даних
export const deleteImage = async (id: string) => {
  try {
    // Перевірка на валідність ObjectId, навіть якщо це вже було в контролері
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    // Видалення зображення з бази даних
    const dbDeleteResult = await Image.deleteOne({ _id: id });
    console.log('Database delete result:', dbDeleteResult);

    // Якщо нічого не було видалено
    if (dbDeleteResult.deletedCount === 0) {
      throw new Error('No image found to delete in the database');
    }

    return { message: 'Image deleted successfully' };
  } catch (error: unknown) {
    console.error('Error in deleteImageService:', error);
    if (error instanceof Error) {
      throw new Error('Error deleting image: ' + error.message);
    } else {
      throw new Error('Error deleting image: An unknown error occurred');
    }
  }
};





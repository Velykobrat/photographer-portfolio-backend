// services/imageService.ts
import cloudinary, { getPublicIdFromUrl } from '../utils/Cloudinary'; // Імпортуємо Cloudinary і допоміжну функцію
import Image from '../models/imageModel'; // Модель для роботи з MongoDB
import { Types } from 'mongoose'; // Для роботи з типами ObjectId
import mongoose from 'mongoose'; // Для перевірки валідності ObjectId

// Функція для отримання всіх зображень користувача з бази даних
export const getUserImages = async (userId: string) => {
  try {
    const images = await Image.find({ userId });

    if (!images.length) {
      throw new Error('No images found');
    }

    return images;
  } catch (error) {
    throw new Error(`Error retrieving user images: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
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
  } catch (error) {
    throw new Error(`Error uploading image: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
  }
};

// Функція для видалення зображення з Cloudinary та бази даних
export const deleteImage = async (id: string) => {
  try {
    // Перевірка на валідність ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    const image = await Image.findById(id);
    if (!image) {
      throw new Error('Image not found');
    }

    const publicId = getPublicIdFromUrl(image.filePath);
    if (!publicId) {
      throw new Error('Public ID not found in the image URL');
    }

    // Видалення зображення з Cloudinary
    const cloudinaryDeleteResult = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', cloudinaryDeleteResult);

    // Видалення зображення з бази даних
    const dbDeleteResult = await Image.deleteOne({ _id: id });
    console.log('Database delete result:', dbDeleteResult);

    if (dbDeleteResult.deletedCount === 0) {
      throw new Error('No image found to delete in the database');
    }

    return { message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Error in deleteImageService:', error);
    throw new Error(`Error deleting image: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
  }
};

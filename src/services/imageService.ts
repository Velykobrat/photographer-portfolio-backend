// services/imageService.ts
import cloudinary, { getPublicIdFromUrl } from '../utils/Cloudinary'; // Інтеграція з Cloudinary
import Image from '../models/imageModel'; // Модель для MongoDB
import { Types } from 'mongoose'; // Робота з ObjectId
import mongoose from 'mongoose'; // Для перевірки валідності ObjectId

// Сервіс для отримання всіх зображень користувача
export const getAllImages = async (userId: string) => {
  try {
    const images = await Image.find({ userId });

    if (!images.length) {
      throw new Error('No images found');
    }

    return images;
  } catch (error) {
    throw new Error(
      `Error retrieving user images: ${error instanceof Error ? error.message : 'An unknown error occurred'}`
    );
  }
};

// Сервіс для завантаження зображення в Cloudinary і базу даних
export const uploadImage = async (file: Express.Multer.File, userId: string) => {
  try {
    const { path: filePath } = file;
    console.log('File path:', filePath);
    console.log('UserId:', userId);

    // Завантаження в Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'photographer-portfolio',
      use_filename: true,
      unique_filename: false,
    });
    console.log('Cloudinary upload result:', result);

    // Створення документа зображення
    const newImage = new Image({
      userId: new Types.ObjectId(userId),
      filePath: result.secure_url,
      description: file.originalname,
    });
    console.log('New image document:', newImage);

    await newImage.save();
    console.log('Image saved successfully');
    return newImage;
  } catch (error) {
    console.error('Error in uploadImage service:', error);
    throw new Error(
      `Error uploading image: ${error instanceof Error ? error.message : 'An unknown error occurred'}`
    );
  }
};


// Сервіс для видалення зображення з Cloudinary і бази даних
export const deleteImage = async (id: string) => {
  try {
    // Перевірка валідності ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    // Пошук зображення в базі даних
    const image = await Image.findById(id);
    if (!image) {
      throw new Error('Image not found');
    }

    // Отримання publicId з Cloudinary URL
    const publicId = getPublicIdFromUrl(image.filePath);
    if (!publicId) {
      throw new Error('Public ID not found in the image URL');
    }

    // Видалення зображення з Cloudinary
    const cloudinaryDeleteResult = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', cloudinaryDeleteResult);

    // Видалення документа з бази даних
    const dbDeleteResult = await Image.deleteOne({ _id: id });
    console.log('Database delete result:', dbDeleteResult);

    if (dbDeleteResult.deletedCount === 0) {
      throw new Error('No image found to delete in the database');
    }

    return { message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw new Error(
      `Error deleting image: ${error instanceof Error ? error.message : 'An unknown error occurred'}`
    );
  }
};

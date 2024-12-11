// utils/Cloudinary.ts

import { v2 as cloudinary } from 'cloudinary';

// Налаштування Cloudinary за допомогою змінних середовища
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функція для отримання public_id з URL Cloudinary
export const getPublicIdFromUrl = (url: string): string | undefined => {
  if (url.includes('cloudinary.com')) {
    const matches = url.match(/\/([^\/]+)$/);
    return matches ? matches[1] : undefined;
  }
  return undefined; // Повертаємо undefined, якщо URL не належить Cloudinary
};

export default cloudinary;

// src/utils/multer.ts

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Налаштування сховища
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    console.log('Зберігаємо файл у папку: uploads/');
    cb(null, 'uploads/'); // Папка для завантажених файлів
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('Призначаємо ім\'я файлу:', filename);
    cb(null, filename);
  },
});

// Фільтрація файлів (опціонально)
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  console.log('Отриманий файл:', file);
  if (file.mimetype.startsWith('image/')) {
    console.log('Файл дозволений:', file.originalname);
    cb(null, true);
  } else {
    console.log('Невірний тип файлу:', file.mimetype);
    cb(null, false);
    req.fileValidationError = 'Invalid file type. Only images are allowed!';
  }
};

// Додаткова обробка помилок
declare global {
  namespace Express {
    interface Request {
      fileValidationError?: string; 
    }
  }
}

const upload = multer({ storage, fileFilter });

export default upload;

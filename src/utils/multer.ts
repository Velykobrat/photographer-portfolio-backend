import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Налаштування сховища
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/'); // Папка для завантажених файлів
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Фільтрація файлів (опціонально)
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  console.log('Отриманий файл:', file);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Файл дозволений
  } else {
    console.log('Невірний тип файлу:', file.mimetype);
    cb(null, false); // Відхиляємо файл
    req.fileValidationError = 'Invalid file type. Only images are allowed!';
  }
};

// Додаткова обробка помилок
declare global {
  namespace Express {
    interface Request {
      fileValidationError?: string; // Додаємо власне поле в Request
    }
  }
}

const upload = multer({ storage, fileFilter });

export default upload;

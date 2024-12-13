import { Router } from 'express';
import { addImage, deleteImage, getAllImages } from '../controllers/imageController';
import { isValidId } from '../middleware/isValidId';
import upload from '../utils/multer';

const router = Router();

// Маршрут для отримання всіх фото
router.get('/collection', getAllImages);

// Маршрут для додавання нового фото
router.post('/upload', upload.single('image'), (req, res, next) => {
  console.log('Middleware multer завершено');
  console.log('req.file:', req.file);
  console.log('req.fileValidationError:', req.fileValidationError);
  next();
}, addImage);

// Маршрут для видалення фото за ID
// Додаємо middleware для перевірки валідності ID
router.delete('/delete/:imageId', isValidId, deleteImage);

export default router;

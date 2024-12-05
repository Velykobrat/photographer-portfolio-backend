import { Router } from 'express';
import { addImage, deleteImage, getUserImages } from '../controllers/imageController';
import upload from '../utils/multer';

const router = Router();

// Маршрут для отримання всіх фото
router.get('/collection', getUserImages);

// Маршрут для додавання нового фото
router.post('/upload', upload.single('image'), addImage);

// Маршрут для видалення фото за ID
router.delete('/delete/:id', deleteImage);

export default router;

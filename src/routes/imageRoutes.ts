import { Router } from 'express';
import { addImage, deleteImage, getUserImages } from '../controllers/imageController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Налаштування для збереження файлів

// Маршрут для додавання нового фото
router.post('/add', upload.single('image'), addImage);

// Маршрут для видалення фото за ID
router.delete('/delete/:id', deleteImage);

// Маршрут для отримання всіх фото користувача
router.get('/user/:userId', getUserImages);

export default router;

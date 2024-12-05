import { Router, Request, Response } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), (req: Request, res: Response): void => {
  const file = req.file as Express.Multer.File | undefined; // Локальна типізація
  if (!file) {
    res.status(400).send('No file uploaded');
    return; // Завершення функції
  }
  res.send(`File uploaded: ${file.filename}`);
});

export default router;

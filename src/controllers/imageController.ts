// controllers/imageController.ts
import { Request, Response } from 'express';
import Image from '../models/imageModel';
import cloudinary, { getPublicIdFromUrl } from '../utils/Cloudinary';
import { Types } from 'mongoose';

export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'File is required' });
      return;
    }

    // Завантаження фото в Cloudinary
    const { path } = req.file;
    const result = await cloudinary.uploader.upload(path, {
      folder: 'photographer-portfolio',
      use_filename: true,
      unique_filename: false,
    });

    // Створення нового документа в базі даних
    const newImage = new Image({
      userId: new Types.ObjectId(req.body.userId), // Змінено на Types.ObjectId
      filePath: result.secure_url,
      description: req.body.description || '',
});
    await newImage.save();

    res.status(201).json(newImage);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Припустимо, що ви отримуєте publicId з URL або іншого джерела
    const publicId: string | undefined = getPublicIdFromUrl(id);

    if (!publicId) {
      res.status(400).json({ message: 'Public ID is required' });
      return;
    }

    // Виклик методу для видалення з Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: 'Image deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};


export const getUserImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const images = await Image.find({ userId });

    if (!images || images.length === 0) {
      res.status(404).json({ message: 'No images found' });
      return;
    }

    res.status(200).json(images);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

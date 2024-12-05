// controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/userModel'; // Імпортуємо модель

// Отримання всіх користувачів
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Використовуємо метод find() для отримання всіх документів
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Додавання нового користувача
export const addUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // Припускаємо, що дані передаються у форматі { email, password }
    const newUser = new User({ email, password });
    await newUser.save(); // Зберігаємо новий документ у базі даних
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

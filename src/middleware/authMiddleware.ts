import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Розширюємо тип Request, щоб TypeScript розпізнавав властивість user
declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; email: string }; // Типізація user
  }
}

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  console.log('Protect middleware triggered');
  const token = req.header('Authorization');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
    console.log('Token verified successfully:', verified);
    req.user = verified; // Додаємо інформацію про користувача в запит
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ message: 'Invalid token' });
  }
};
import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Ключ для підпису токенів

// Реєстрація нового користувача
export const registerUser = async (req: Request, res: Response) => {
  console.log('Request body:', req.body); // Логування запиту

  if (!req.body) {
    console.error('Request body is missing');
    return res.status(400).json({ message: 'Request body is missing' });
  }
  
  const { email, password } = req.body;
  console.log('Received email:', email);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User registered successfully:', newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Логін користувача
export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return; // Завершуємо виконання функції
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Оновлення токену (refresh)
export const refreshUser = async (req: Request, res: Response) => {
  console.log('Refresh user function triggered');
  try {
    const { token } = req.body;
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Token is required' });
    }

    // Асинхронна перевірка токена
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      console.log('Token verified for refresh:', decoded);

      const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, SECRET_KEY, {
        expiresIn: '1h',
      });
      console.log('New token created successfully');

      res.status(200).json({ token: newToken });
    } catch (err) {
      console.error('Token verification failed for refresh:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Вихід (logout)
export const logoutUser = async (req: Request, res: Response) => {
  console.log('Logout user function triggered');
  try {
    // В цьому випадку можемо просто відправити повідомлення про успішний вихід
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

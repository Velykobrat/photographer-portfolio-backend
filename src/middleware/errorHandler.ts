import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);

  if (err instanceof SyntaxError) {
    // Тут не потрібно використовувати `return` перед `res.status().json()`
    res.status(400).json({ message: 'Синтаксична помилка у запиті' });
  } else {
    // Загальний обробник для інших помилок
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};

export default errorHandler;

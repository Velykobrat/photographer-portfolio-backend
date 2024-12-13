// src/middleware/isValidId.ts

import { Request, Response, NextFunction } from 'express';  
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req: Request, res: Response, next: NextFunction) => {  
    const { imageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
        return next(createHttpError(400, 'Невірний ID фотографії'));
    }
    next();
};

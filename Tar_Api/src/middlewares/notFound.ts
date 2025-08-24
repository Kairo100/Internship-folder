// src/middlewares/notfound.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

// Middleware to catch 404 (Not Found) errors for unmatched routes
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
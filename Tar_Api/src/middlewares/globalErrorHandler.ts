// src/middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError'; // Assuming AppError is in utils

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err); // Log the error for developers
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // In a real app, you might handle specific Prisma errors differently here
    // For simplicity, we'll treat most as generic errors for now.
    let error = { ...err }; // Create a copy to avoid modifying original
    error.message = err.message; // Ensure message is copied

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
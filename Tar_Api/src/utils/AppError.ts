// src/utils/AppError.ts
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark as an operational error

    // Capture stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import AppError from './AppError';

// Hash a plain password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify a plain password
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Generate JWT token
export const generateJwtToken = (payload: { id: number }): string => {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    console.error('JWT_SECRET or JWT_EXPIRES_IN not configured!');
    throw new Error('JWT configuration missing.');
  }

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'], // Cast to correct type
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// Verify JWT token
export const verifyJwtToken = (token: string): string | jwt.JwtPayload => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not configured!');
    throw new Error('JWT configuration missing.');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again!', 401);
    }
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired! Please log in again.', 401);
    }
    throw new AppError('Invalid token.', 401);
  }
};

// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '../utils/authUtils'; // Assuming this utility
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { PrismaClient, Role, User } from '@prisma/client';

const prisma = new PrismaClient();

// Extend the Express Request type to include user information
export interface AuthRequest extends Request {
  user?: User; // Or a more specific User type excluding password
}

export const authenticate = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Get token from headers (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    // 2. Get token from cookies
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 3. Verify token
  const decoded: any = verifyJwtToken(token); // decoded will have { id: userId, iat: ..., exp: ... }

  // 4. Check if user still exists
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  // Removed '!currentUser.is_active' check as 'is_active' does not exist in your User model.
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 5. Removed check if user changed password after the token was issued
  // This functionality relies on 'password_changed_at' which does not exist in your User model.
  // if (currentUser.password_changed_at && decoded.iat * 1000 < currentUser.password_changed_at.getTime()) {
  //   return next(new AppError('User recently changed password! Please log in again.', 401));
  // }

  // 6. GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403) // 403 Forbidden
      );
    }
    next();
  };
};

// src/middlewares/restrict.ts
// NOTE: This middleware serves a similar purpose to `authorizeRoles` in auth.middleware.ts.
// In many applications, `authorizeRoles` is robust enough. This file is provided if
// you prefer to separate concerns or need a different type of restriction check.

import { Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { AuthRequest } from '../auth/auth.middleware'; // Import your custom AuthRequest type
import { Role } from '@prisma/client'; // Assuming Role enum from Prisma

// This middleware restricts access to specific roles.
// It's conceptually similar to authorizeRoles, but could be adapted for other
// generic "restriction" logic not strictly tied to authentication roles,
// e.g., restricting by IP, maintenance mode, etc.
// For role-based restriction, `authorizeRoles` is usually preferred.
export const restrictTo = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // If user is not authenticated, req.user will be undefined (should be handled by `authenticate` first)
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403) // 403 Forbidden
      );
    }
    next();
  };
};

// Example of another type of general restriction (not role-based)
// export const restrictToActiveUsers = (req: AuthRequest, res: Response, next: NextFunction) => {
//   if (req.user && !req.user.is_active) {
//     return next(new AppError('Your account is inactive. Please contact support.', 403));
//   }
//   next();
// };

// You would use this by replacing `authorizeRoles` with `restrictTo` in your routes:
// router.post('/', authenticate, restrictTo(Role.Admin, Role.Agent), someController.create);
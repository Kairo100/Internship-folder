// src/notification/notification.routes.ts
import { Router, Response, NextFunction } from 'express';
import * as notificationController from './notification.controller';
import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
import prisma from '../prisma/client';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// Main router for standalone /notifications routes
const router = Router();

// Router for nested routes (e.g., /users/:userId/notifications)
const nestedRouter = Router({ mergeParams: true });

// Apply authentication to all notification routes
router.use(authenticate); // For /api/v1/notifications
nestedRouter.use(authenticate); // For /api/v1/users/:userId/notifications

// Middleware to ensure users only access their own notifications, unless Admin/Agent
const restrictNotificationAccess = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const notificationId = req.params.id ? parseInt(req.params.id) : null;
  const userIdFromParams = req.params.userId ? parseInt(req.params.userId) : null;
  const user = req.user!;

  if (user.role === Role.Admin || user.role === Role.Agent) {
    return next(); // Admins/Agents can do anything
  }

  // If accessing a specific notification by ID, ensure it belongs to the user
  if (notificationId) {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.user_id !== user.id) {
      return next(new AppError('You are not authorized to access this notification.', 403));
    }
  }

  // If accessing notifications via /users/:userId/notifications, ensure userId matches authenticated user
  if (userIdFromParams && userIdFromParams !== user.id) {
      return next(new AppError('You are not authorized to view notifications for other users.', 403));
  }

  next();
});

// Top-level /notifications routes
router
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent), notificationController.createNotification) // Only Admin/Agent can create notifications for others
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), notificationController.getAllNotifications); // Filtering handled in controller to restrict to own for non-admins

router
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.getNotificationById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.updateNotification) // Users can mark their own as read
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictNotificationAccess, notificationController.deleteNotification); // Only Admin/Agent can delete

// Specific route to mark as read/unread
router
  .route('/:id/read')
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.markNotificationReadStatus);

// --- Nested Routes (to be used in user.routes) ---
// Example: /api/v1/users/:userId/notifications
nestedRouter
  .route('/')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.getAllNotifications); // Users should only get their own from this route

nestedRouter
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.getNotificationById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.updateNotification);

nestedRouter
  .route('/:id/read')
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictNotificationAccess, notificationController.markNotificationReadStatus);


export { router, nestedRouter }; // Export both routers
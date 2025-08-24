// src/notification/notification.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as notificationService from './notification.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
// FIX 1: Remove the incorrect import for User from user.model.
// The correct import for User and Role (if needed) is already from @prisma/client.
import { User, Role, NotificationType } from '@prisma/client'; // Ensure NotificationType is also imported
import { createNotificationSchema, updateNotificationSchema, getNotificationByIdSchema, getNotificationByUserIdSchema, getNotificationsQueryParams } from './notification.validation';

// FIX 2: Import AuthRequest from your auth.middleware.
// This interface extends Express's Request to include the 'user' property.
import { AuthRequest } from '../auth/auth.middleware'; // <--- CRITICAL IMPORT

// Create a new Notification
export const createNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createNotificationSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const notification = await notificationService.createNotification(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

// Get all Notifications (with optional filters for userId, isRead, type)
// FIX 3: Change Request to AuthRequest for functions accessing req.user
export const getAllNotifications = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check for nested route parameter (e.g., /users/:userId/notifications)
  const userParams = getNotificationByUserIdSchema.safeParse(req.params);
  let userIdFromParams: number | undefined;
  if (userParams.success) {
    userIdFromParams = userParams.data.userId;
  }

  // Parse query parameters for filtering
  const queryParams = getNotificationsQueryParams.safeParse(req.query);
  if (!queryParams.success) {
      return next(new AppError(queryParams.error.issues[0].message, 400));
  }

  const { is_read, type } = queryParams.data || {};

  // If a user (not Admin/Agent) is trying to access notifications, ensure they only get their own
  if (req.user!.role !== Role.Admin && req.user!.role !== Role.Agent) { // FIX: Use Role enum
      // If nested route is used, ensure it matches the authenticated user
      if (userIdFromParams && userIdFromParams !== req.user!.id) {
          return next(new AppError('You are not authorized to view notifications for other users.', 403));
      }
      // If top-level route is used, default to the authenticated user's ID
      userIdFromParams = req.user!.id;
  }

  const notifications = await notificationService.getAllNotifications(userIdFromParams, is_read, type);
  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// Get Notification by ID
// FIX 3: Change Request to AuthRequest for functions accessing req.user
export const getNotificationById = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const validatedParams = getNotificationByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Notification ID format', 400));
  }

  const notification = await notificationService.getNotificationById(validatedParams.data.id);

  // Users can only view their own notifications unless Admin/Agent
  if (req.user!.role !== Role.Admin && req.user!.role !== Role.Agent && notification.user_id !== req.user!.id) { // FIX: Use Role enum
      return next(new AppError('You are not authorized to view this notification.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      notification,
    },
  });
});

// Update Notification by ID
// FIX 3: Change Request to AuthRequest for functions accessing req.user
export const updateNotification = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const validatedParams = getNotificationByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Notification ID format', 400));
  }

  const validatedBody = updateNotificationSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  // Get current notification to check ownership before update
  const currentNotification = await notificationService.getNotificationById(validatedParams.data.id);
  // Users can only update their own notifications (e.g., mark as read)
  if (req.user!.role !== Role.Admin && req.user!.role !== Role.Agent && currentNotification.user_id !== req.user!.id) { // FIX: Use Role enum
      return next(new AppError('You are not authorized to update this notification.', 403));
  }

  const updatedNotification = await notificationService.updateNotification(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      notification: updatedNotification,
    },
  });
});

// Delete Notification by ID
// FIX 3: Change Request to AuthRequest for functions accessing req.user
export const deleteNotification = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const validatedParams = getNotificationByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Notification ID format', 400));
  }

  // Get current notification to check ownership before delete
  const currentNotification = await notificationService.getNotificationById(validatedParams.data.id);
  // Only Admins/Agents can delete notifications, or users their own if allowed
  // For simplicity, let's restrict deletion to Admin/Agent. Users can mark as read instead.
  if (req.user!.role !== Role.Admin && req.user!.role !== Role.Agent) { // FIX: Use Role enum
      return next(new AppError('You are not authorized to delete notifications.', 403));
  }

  await notificationService.deleteNotification(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});

// Mark a notification as read or unread
// FIX 3: Change Request to AuthRequest for functions accessing req.user
export const markNotificationReadStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const validatedParams = getNotificationByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Notification ID format', 400));
  }

  const isRead = req.body.is_read;
  if (typeof isRead !== 'boolean') {
    return next(new AppError('is_read must be a boolean value.', 400));
  }

  // Get current notification to check ownership
  const currentNotification = await notificationService.getNotificationById(validatedParams.data.id);
  if (req.user!.role !== Role.Admin && req.user!.role !== Role.Agent && currentNotification.user_id !== req.user!.id) { // FIX: Use Role enum
      return next(new AppError('You are not authorized to update this notification.', 403));
  }

  const updatedNotification = await notificationService.markNotificationAsRead(validatedParams.data.id, isRead);
  res.status(200).json({
    status: 'success',
    data: {
      notification: updatedNotification,
    },
  });
});
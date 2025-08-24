// src/notification/notification.validation.ts
import { z } from 'zod'; // No need to import ZodIssueCode unless used elsewhere
import { NotificationType } from '@prisma/client';

// Schema for creating a new Notification
export const createNotificationSchema = z.object({
  user_id: z.number().int().positive('User ID must be a positive integer.'),
  message: z.string().min(5, 'Message must be at least 5 characters long.'),
  // Removed 'invalid_type_error' from here as it's not a valid option for z.nativeEnum
  type: z.nativeEnum(NotificationType).optional().default(NotificationType.General),
  is_read: z.boolean().default(false),
});

// Schema for updating an existing Notification
export const updateNotificationSchema = z.object({
  message: z.string().min(5, 'Message must be at least 5 characters long.').optional(),
  // Removed 'invalid_type_error' from here
  type: z.nativeEnum(NotificationType).optional(),
  is_read: z.boolean().optional(),
  user_id: z.number().int().positive('User ID must be a positive integer.').optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);

// Schema for getting a single Notification by ID (for route parameters)
export const getNotificationByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});

// Schema for filtering notifications by user ID (for nested routes or query params)
export const getNotificationByUserIdSchema = z.object({
  userId: z.string().transform(Number),
});

// Schema for query parameters (e.g., ?is_read=true&type=LOAN_DUE)
export const getNotificationsQueryParams = z.object({
  is_read: z.preprocess((val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  }, z.boolean()).optional(),
  // Removed 'invalid_type_error' from here
  type: z.nativeEnum(NotificationType).optional(),
}).optional();
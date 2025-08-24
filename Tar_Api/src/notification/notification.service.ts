// src/notification/notification.service.ts
import { PrismaClient, NotificationType } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Notification data
interface CreateNotificationData {
  user_id: number;
  message: string;
  type?: NotificationType;
  is_read?: boolean;
}

interface UpdateNotificationData {
  message?: string;
  type?: NotificationType;
  is_read?: boolean;
  user_id?: number;
}

export const createNotification = async (data: CreateNotificationData) => {
  // 1. Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: data.user_id },
  });
  if (!user) {
    throw new AppError('User not found. Cannot create notification for a non-existent user.', 400);
  }

  const notification = await prisma.notification.create({
    data,
    include: {
      user: {
        // Changed to 'name' as per your User model
        select: { id: true, name: true, email: true }
      }
    },
  });
  return notification;
};

export const getAllNotifications = async (userId?: number, isRead?: boolean, type?: NotificationType) => {
  const where: any = {};
  if (userId) {
    where.user_id = userId;
  }
  if (isRead !== undefined) {
    where.is_read = isRead;
  }
  if (type) {
    where.type = type;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { created_at: 'desc' }, // Order by newest first
    include: {
      user: {
        // Changed to 'name' as per your User model
        select: { id: true, name: true, email: true }
      }
    },
  });
  return notifications;
};

export const getNotificationById = async (id: number) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
    include: {
      user: {
        // Changed to 'name' as per your User model
        select: { id: true, name: true, email: true }
      }
    },
  });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  return notification;
};

export const updateNotification = async (id: number, data: UpdateNotificationData) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  // If user_id is being changed (unusual but handled)
  if (data.user_id && data.user_id !== notification.user_id) {
    const newUser = await prisma.user.findUnique({
      where: { id: data.user_id },
    });
    if (!newUser) {
      throw new AppError('New User not found.', 400);
    }
  }

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data,
    include: {
      user: {
        // Changed to 'name' as per your User model
        select: { id: true, name: true, email: true }
      }
    },
  });
  return updatedNotification;
};

export const deleteNotification = async (id: number) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await prisma.notification.delete({
    where: { id },
  });
  return { message: 'Notification deleted successfully' };
};

// Mark a notification as read/unread
export const markNotificationAsRead = async (id: number, isRead: boolean) => {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.is_read === isRead) {
    return notification; // No change needed
  }

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { is_read: isRead },
    include: { user: { select: { id: true, email: true, name: true } } } // Added 'name' here too
  });
  return updatedNotification;
};

// src/user/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createUserSchema, updateUserSchema, getUserByIdSchema, updateMeSchema } from './user.validation';
import { AuthRequest } from '../auth/auth.middleware';
import { CreateUserData, UpdateUserData } from './user.service'; // Corrected import (now that they are exported)

// Create a new user (Admin only)
export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createUserSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  // Transform validatedData to match CreateUserData expected by userService.createUser.
  // This assumes createUserSchema provides first_name, last_name, etc.
  const userDataForService: CreateUserData = {
    // Combine first_name and last_name into 'name' as per your User model
    name: `${validatedData.data.first_name || ''} ${validatedData.data.last_name || ''}`.trim(),
    email: validatedData.data.email,
    password: validatedData.data.password,
    role: validatedData.data.role,
    // phone_number and password_confirm are not in CreateUserData, so they are omitted
  };

  const newUser = await userService.createUser(userDataForService);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// Get all users (Admin only)
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Get a single user by ID (Admin can get any, others their own)
export const getUserById = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const validatedParams = getUserByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid User ID format', 400));
  }

  const userId = validatedParams.data.id;

  // If a user (not Admin/Agent) is trying to get a user, ensure it's their own profile
  if (req.user!.role !== 'Admin' && req.user!.role !== 'Agent' && userId !== req.user!.id) {
    return next(new AppError('You are not authorized to access this user\'s profile.', 403));
  }

  const user = await userService.getUserById(userId);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Update a user by ID (Admin only)
export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getUserByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid User ID format', 400));
  }

  const validatedBody = updateUserSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  // Transform validatedBody.data to match UpdateUserData expected by userService.updateUser.
  // This assumes updateUserSchema might provide first_name, last_name, etc., but not necessarily 'name'.
  const userDataForService: UpdateUserData = {
    // Conditionally include 'name' if first_name or last_name are present from validation
    ...(validatedBody.data.first_name || validatedBody.data.last_name
      ? { name: `${validatedBody.data.first_name || ''} ${validatedBody.data.last_name || ''}`.trim() }
      : {}), // If neither, don't include 'name' in the object, letting the service handle optionality
    email: validatedBody.data.email, // Include email if present
    role: validatedBody.data.role,   // Include role if present
    // phone_number is not in UpdateUserData, so it's omitted
  };

  const updatedUser = await userService.updateUser(validatedParams.data.id, userDataForService);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});


// Get current authenticated user's profile
export const getMe = (req: AuthRequest, res: Response, next: NextFunction) => {
  req.params.id = req.user!.id.toString(); // Set ID to authenticated user's ID
  next(); // Pass to getUserById
};

// Update current authenticated user's profile
export const updateMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Prevent password/role updates here
  if (req.body.password || req.body.password_confirm || req.body.role) {
    return next(
      new AppError(
        'This route is not for password or role updates. Please use /updateMyPassword for passwords.',
        400
      )
    );
  }

  const validatedBody = updateMeSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  // Transform validatedBody.data to match UpdateUserData expected by userService.updateUser.
  // This assumes updateMeSchema might provide first_name, last_name, etc., but not necessarily 'name'.
  const userDataForService: UpdateUserData = {
    // Conditionally include 'name' if first_name or last_name are present from validation
    ...(validatedBody.data.first_name || validatedBody.data.last_name
      ? { name: `${validatedBody.data.first_name || ''} ${validatedBody.data.last_name || ''}`.trim() }
      : {}), // If neither, don't include 'name' in the object
    email: validatedBody.data.email, // Include email if present
    // role is explicitly prevented above, so no need to pass it
    // phone_number is not in UpdateUserData, so it's omitted
  };

  const updatedUser = await userService.updateUser(req.user!.id, userDataForService);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

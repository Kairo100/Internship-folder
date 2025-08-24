// src/user/user.routes.ts
import { Router } from 'express';
import * as userController from './user.controller';
import * as authController from '../auth/auth.controller'; // Import auth controller for password updates
import { authenticate, authorizeRoles } from '../auth/auth.middleware';
import { Role } from '@prisma/client';
import { nestedRouter as nestedNotificationRouter } from '../notification/notification.routes'; // Import nested router for notifications

const userRoutes = Router();

// Routes accessible before authentication (e.g., login, signup handled in auth.routes)
// No direct user creation for unauthenticated users here (handled by Admin via post /users)

// Apply authentication to all routes below this point
userRoutes.use(authenticate);

// User-specific routes (authenticated user can manage their own profile)
userRoutes.patch('/updateMyPassword', authController.updatePassword); // User updates their own password
userRoutes.get('/me', userController.getMe, userController.getUserById); // Get authenticated user's profile
userRoutes.patch('/updateMe', userController.updateMe); // Update authenticated user's profile



// Nested route for notifications specific to a user
// This means you can now access /api/v1/users/:userId/notifications
userRoutes.use('/:userId/notifications', nestedNotificationRouter);

// Admin-only routes for general user management
// These routes are protected by authorizeRoles(Role.Admin)
userRoutes.use(authorizeRoles(Role.Admin)); // Apply admin role restriction from this point downwards

userRoutes.route('/')
  .get(userController.getAllUsers) // Get all users
  .post(userController.createUser); // Create a new user (Admin sets role)

userRoutes.route('/:id')
  .get(userController.getUserById) // Get a specific user by ID
  .patch(userController.updateUser) // Update a specific user by ID

export default userRoutes;

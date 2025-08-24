// src/auth/auth.routes.ts
import { Router } from 'express';
import * as authController from './auth.controller';

const authRouter  = Router();

// Public routes (no authentication required initially)
authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/forgotPassword', authController.forgotPassword);
authRouter.patch('/resetPassword/:token', authController.resetPassword);

// Authenticated route for logging out (requires a valid token to even hit this endpoint)
authRouter.get('/logout', authController.logout);

export default authRouter;
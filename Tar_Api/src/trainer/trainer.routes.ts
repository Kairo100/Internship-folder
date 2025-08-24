// src/trainer/trainer.routes.ts
import { Router } from 'express';
import * as trainerController from './trainer.controller';
import { authenticate, authorizeRoles } from '../auth/auth.middleware'; // Import from central middleware
import { Role } from '@prisma/client'; // Import Role enum from Prisma client

const trainerRoutes = Router();

// Routes for Trainers
trainerRoutes.use(authenticate); // All trainer routes require authentication

trainerRoutes
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent), trainerController.createTrainer) // Only Admin or Agent can create
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), trainerController.getAllTrainers); // All roles can view

trainerRoutes
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), trainerController.getTrainerById) // All roles can view by ID
  .patch(authorizeRoles(Role.Admin, Role.Agent), trainerController.updateTrainer) // Only Admin or Agent can update
  .delete(authorizeRoles(Role.Admin), trainerController.deleteTrainer); // Only Admin can delete

export default trainerRoutes;
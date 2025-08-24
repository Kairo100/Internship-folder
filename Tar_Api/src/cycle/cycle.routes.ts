// src/cycle/cycle.routes.ts
import { Router, Request, Response, NextFunction } from 'express'; // <-- ADDED Request, Response
import * as cycleController from './cycle.controller';
import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { PrismaClient } from '@prisma/client'; // <-- IMPORTED PrismaClient

const prisma = new PrismaClient(); // <-- INITIALIZED PrismaClient here

const cycleRouter = Router();

// Apply authentication to all cycle routes
cycleRouter.use(authenticate);

// Middleware to restrict leaders to their own group's cycles
const restrictCycleAccessToLeader = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const groupIdFromParam = req.params.groupId ? parseInt(req.params.groupId) : null;
  const cycleId = req.params.id ? parseInt(req.params.id) : null;
  const user = req.user!;

  if (user.role === Role.Admin || user.role === Role.Agent) {
    return next(); // Admins/Agents can do anything
  }

  if (user.role === Role.Leader) {
    // Find the group this leader manages
    const leaderGroup = await prisma.group.findUnique({ // <-- 'prisma' is now defined
      where: { leader_user_id: user.id },
      select: { id: true }
    });

    if (!leaderGroup) {
      return next(new AppError('You are a leader but not assigned to any group.', 403));
    }

    // If accessing cycles by group ID
    if (groupIdFromParam && groupIdFromParam !== leaderGroup.id) {
        return next(new AppError('You are not authorized to access cycles of other groups.', 403));
    }

    // If accessing a specific cycle by ID
    if (cycleId) {
      const cycle = await prisma.cycle.findUnique({ where: { id: cycleId } }); // <-- 'prisma' is now defined
      if (!cycle || cycle.group_id !== leaderGroup.id) {
        return next(new AppError('You are not authorized to access this cycle.', 403));
      }
    }
  }
  next();
});

cycleRouter
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent), cycleController.createCycle) // Only Admin or Agent can create
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), cycleController.getAllCycles); // All roles can view (granular control needed for Leader/Member in controller/service)

cycleRouter
  .route('/:id')
  // Leaders/Members should only view cycles of their group.
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictCycleAccessToLeader, cycleController.getCycleById)
  // Leaders/Members might update cycles for their group. Admin/Agent can update all.
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictCycleAccessToLeader, cycleController.updateCycle)
  .delete(authorizeRoles(Role.Admin, Role.Agent), cycleController.deleteCycle); // Only Admin/Agent can delete

// Optional: Nested routes if you want to get cycles for a specific group: /api/v1/groups/:groupId/cycles
// This is good for building dashboards
cycleRouter
  .route('/by-group/:groupId')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictCycleAccessToLeader, cycleController.getAllCycles); // This will need a modification in `getAllCycles` controller/service to filter by `groupId` from params.
  // For simplicity, for `getAllCycles` controller, you might need to add logic to filter by `req.params.groupId` if it exists.
  // Or create a separate controller function like `getCyclesByGroup`.

export default cycleRouter;
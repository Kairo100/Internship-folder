// src/saving/saving.routes.ts
import { Router, Request , Response, NextFunction } from 'express';
import * as savingController from './saving.controller';
import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
import prisma from '../prisma/client';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { nestedRouter as nestedSavingRouter } from '../saving/saving.routes';
import { nestedRouter as nestedLoanRouter } from '../loan/loan.routes'; 
import { nestedRouter as nestedAttendanceRouter } from '../attendance/attendance.routes';


// Main router for standalone /savings routes
const router = Router();

// Router for nested routes (e.g., /meetings/:meetingId/savings)
// This will be merged into the main meeting or member router later
const nestedRouter = Router({ mergeParams: true });

// Apply authentication to all saving routes
router.use(authenticate); // For /api/v1/savings
nestedRouter.use(authenticate); // For /api/v1/meetings/:meetingId/savings or /api/v1/members/:memberId/savings

// Middleware to restrict access based on user role and saving/meeting/member ownership
const restrictSavingAccess = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const savingId = req.params.id ? parseInt(req.params.id) : null;
  const meetingId = req.params.meetingId ? parseInt(req.params.meetingId) : null;
  const memberId = req.params.memberId ? parseInt(req.params.memberId) : null;
  const user = req.user!;

  if (user.role === Role.Admin || user.role === Role.Agent) {
    return next(); // Admins/Agents can do anything
  }

  let authorizedGroupIds: number[] = [];
  let authorizedMemberIds: number[] = [];

  if (user.role === Role.Leader) {
    const leaderGroup = await prisma.group.findUnique({ where: { leader_user_id: user.id }, select: { id: true } });
    if (leaderGroup) {
      authorizedGroupIds.push(leaderGroup.id);
    }
  } else if (user.role === Role.Member) {
    const member = await prisma.member.findFirst({ where: { created_by_user_id: user.id }, select: { id: true, group_id: true } });
    if (member) {
      authorizedMemberIds.push(member.id);
      authorizedGroupIds.push(member.group_id);
    }
  }

  if (savingId) {
    const saving = await prisma.saving.findUnique({
      where: { id: savingId },
      include: { member: { select: { id: true, group_id: true } }, meeting: { select: { id: true, group_id: true } } }
    });

    if (!saving) {
      return next(new AppError('Saving record not found', 404));
    }

    if (user.role === Role.Member) {
      if (!authorizedMemberIds.includes(saving.member_id)) {
        return next(new AppError('You are not authorized to access this saving record.', 403));
      }
    } else if (user.role === Role.Leader) {
      if (!authorizedGroupIds.includes(saving.member.group_id) || !authorizedGroupIds.includes(saving.meeting.group_id)) {
        return next(new AppError('You are not authorized to access this saving record (not in your group).', 403));
      }
    } else {
        return next(new AppError('You are not authorized to perform this action.', 403));
    }
  } else if (meetingId) { // Check for nested /meetings/:meetingId/savings
    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId }, select: { group_id: true } });
    if (!meeting) {
      return next(new AppError('Meeting not found.', 404));
    }
    if (user.role === Role.Leader && !authorizedGroupIds.includes(meeting.group_id)) {
      return next(new AppError('You are not authorized to access savings for this meeting (not in your group).', 403));
    }
    // For members, we can still filter further in service
  } else if (memberId) { // Check for nested /members/:memberId/savings
    const member = await prisma.member.findUnique({ where: { id: memberId }, select: { id: true, group_id: true } });
    if (!member) {
      return next(new AppError('Member not found.', 404));
    }
    if (user.role === Role.Member && !authorizedMemberIds.includes(member.id)) {
        return next(new AppError('You are not authorized to access other members\' savings.', 403));
    } else if (user.role === Role.Leader && !authorizedGroupIds.includes(member.group_id)) {
      return next(new AppError('You are not authorized to access savings for members outside your group.', 403));
    }
  }

  next();
});


// Top-level /savings routes
router
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictSavingAccess, savingController.createSaving) // Leaders can create savings for their group members
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictSavingAccess, savingController.getAllSavings); // Filtering based on role/group/member in service

router
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictSavingAccess, savingController.getSavingById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictSavingAccess, savingController.updateSaving) // Members can update their own savings? Leader for their group?
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictSavingAccess, savingController.deleteSaving); // Admin/Agent can delete


// Example: /api/v1/meetings/:meetingId/savings
nestedRouter
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictSavingAccess, savingController.createSaving)
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictSavingAccess, savingController.getAllSavings);

nestedRouter
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictSavingAccess, savingController.getSavingById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictSavingAccess, savingController.updateSaving)
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictSavingAccess, savingController.deleteSaving);





export { router, nestedRouter }; // Export both routers
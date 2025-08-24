// src/meeting/meeting.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import * as meetingController from './meeting.controller';
import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { PrismaClient } from '@prisma/client';
import { nestedRouter as nestedSavingRouter } from '../saving/saving.routes';
import { nestedRouter as nestedLoanRouter } from '../loan/loan.routes';
import { nestedRouter as nestedAttendanceRouter } from '../attendance/attendance.routes';

const prisma = new PrismaClient();

const meetingRouter = Router();

meetingRouter.use(authenticate);

const restrictMeetingAccess = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const meetingId = req.params.id ? parseInt(req.params.id) : null;
  const user = req.user!;

  if (user.role === Role.Admin || user.role === Role.Agent) {
    return next();
  }

  if (user.role === Role.Leader) {
    const leaderGroup = await prisma.group.findUnique({
      where: { leader_user_id: user.id },
      select: { id: true }
    });

    if (!leaderGroup) {
      return next(new AppError('You are a leader but not assigned to any group.', 403));
    }

    if (meetingId) {
      const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
      if (!meeting || meeting.group_id !== leaderGroup.id) {
        return next(new AppError('You are not authorized to access this meeting.', 403));
      }
    }
  } else if (user.role === Role.Member) {
      const member = await prisma.member.findFirst({
          where: { created_by_user_id: user.id },
          select: { group_id: true }
      });

      if (!member) {
          return next(new AppError('You are a member but not associated with any group.', 403));
      }

      if (meetingId) {
          const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
          if (!meeting || meeting.group_id !== member.group_id) {
              return next(new AppError('You are not authorized to access this meeting.', 403));
          }
      }
  }
  next();
});

meetingRouter
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictMeetingAccess, meetingController.createMeeting)
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), meetingController.getAllMeetings);

meetingRouter
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictMeetingAccess, meetingController.getMeetingById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictMeetingAccess, meetingController.updateMeeting)
  .delete(authorizeRoles(Role.Admin, Role.Agent), meetingController.deleteMeeting);

meetingRouter.use('/:meetingId/savings', nestedSavingRouter);
meetingRouter.use('/:meetingId/loans', nestedLoanRouter);
meetingRouter.use('/:meetingId/attendance', nestedAttendanceRouter);

export default meetingRouter;
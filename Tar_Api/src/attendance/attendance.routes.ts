// src/attendance/attendance.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import * as attendanceController from './attendance.controller';
import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();
const nestedRouter = Router({ mergeParams: true });

router.use(authenticate);
nestedRouter.use(authenticate);

const restrictAttendanceAccess = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const attendanceId = req.params.id ? parseInt(req.params.id) : null;
  const meetingId = req.params.meetingId ? parseInt(req.params.meetingId) : null;
  const memberId = req.params.memberId ? parseInt(req.params.memberId) : null;
  const user = req.user!;

  if (user.role === Role.Admin || user.role === Role.Agent) {
    return next();
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

  if (attendanceId) {
    const attendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: { member: { select: { id: true, group_id: true } }, meeting: { select: { id: true, group_id: true } } }
    });

    if (!attendance) {
      return next(new AppError('Attendance record not found', 404));
    }

    if (user.role === Role.Member) {
      if (!authorizedMemberIds.includes(attendance.member_id)) {
        return next(new AppError('You are not authorized to access this attendance record.', 403));
      }
    } else if (user.role === Role.Leader) {
      if (!authorizedGroupIds.includes(attendance.member.group_id) || !authorizedGroupIds.includes(attendance.meeting.group_id)) {
        return next(new AppError('You are not authorized to access this attendance record (not in your group).', 403));
      }
    } else {
        return next(new AppError('You are not authorized to perform this action.', 403));
    }
  } else if (meetingId) {
    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId }, select: { group_id: true } });
    if (!meeting) {
      return next(new AppError('Meeting not found.', 404));
    }
    if (user.role === Role.Leader && !authorizedGroupIds.includes(meeting.group_id)) {
      return next(new AppError('You are not authorized to access attendance for this meeting (not in your group).', 403));
    }
  } else if (memberId) {
    const member = await prisma.member.findUnique({ where: { id: memberId }, select: { id: true, group_id: true } });
    if (!member) {
      return next(new AppError('Member not found.', 404));
    }
    if (user.role === Role.Member && !authorizedMemberIds.includes(member.id)) {
        return next(new AppError('You are not authorized to access other members\' attendance.', 403));
    } else if (user.role === Role.Leader && !authorizedGroupIds.includes(member.group_id)) {
      return next(new AppError('You are not authorized to access attendance for members outside your group.', 403));
    }
  }

  next();
});

router
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictAttendanceAccess, attendanceController.createAttendance)
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictAttendanceAccess, attendanceController.getAllAttendance);

router
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictAttendanceAccess, attendanceController.getAttendanceById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictAttendanceAccess, attendanceController.updateAttendance)
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictAttendanceAccess, attendanceController.deleteAttendance);

nestedRouter
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictAttendanceAccess, attendanceController.createAttendance)
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictAttendanceAccess, attendanceController.getAllAttendance);

nestedRouter
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictAttendanceAccess, attendanceController.getAttendanceById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictAttendanceAccess, attendanceController.updateAttendance)
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictAttendanceAccess, attendanceController.deleteAttendance);

export { router, nestedRouter };
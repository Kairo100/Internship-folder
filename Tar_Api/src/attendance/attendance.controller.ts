// src/attendance/attendance.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as attendanceService from './attendance.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createAttendanceSchema, updateAttendanceSchema, getAttendanceByIdSchema, getAttendanceByMeetingIdSchema, getAttendanceByMemberIdSchema } from './attendance.validation';

// Create a new Attendance record
export const createAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createAttendanceSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const attendance = await attendanceService.createAttendance(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

// Get all Attendance records (with optional filters for meetingId or memberId)
export const getAllAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check for nested route parameters
  const meetingParams = getAttendanceByMeetingIdSchema.safeParse(req.params);
  const memberParams = getAttendanceByMemberIdSchema.safeParse(req.params);

  let meetingId: number | undefined;
  let memberId: number | undefined;

  if (meetingParams.success) {
    meetingId = meetingParams.data.meetingId;
  }
  if (memberParams.success) {
    memberId = memberParams.data.memberId;
  }

  const attendanceRecords = await attendanceService.getAllAttendance(meetingId, memberId);
  res.status(200).json({
    status: 'success',
    results: attendanceRecords.length,
    data: {
      attendanceRecords,
    },
  });
});

// Get Attendance record by ID
export const getAttendanceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getAttendanceByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Attendance ID format', 400));
  }

  const attendance = await attendanceService.getAttendanceById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      attendance,
    },
  });
});

// Update Attendance record by ID
export const updateAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getAttendanceByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Attendance ID format', 400));
  }

  const validatedBody = updateAttendanceSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  const updatedAttendance = await attendanceService.updateAttendance(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      attendance: updatedAttendance,
    },
  });
});

// Delete Attendance record by ID
export const deleteAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getAttendanceByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Attendance ID format', 400));
  }

  await attendanceService.deleteAttendance(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});
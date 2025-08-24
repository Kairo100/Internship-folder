// src/meeting/meeting.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as meetingService from './meeting.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createMeetingSchema, updateMeetingSchema, getMeetingByIdSchema } from './meeting.validation';

// Create a new Meeting
export const createMeeting = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createMeetingSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const meeting = await meetingService.createMeeting(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      meeting,
    },
  });
});

// Get all Meetings
export const getAllMeetings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const meetings = await meetingService.getAllMeetings();
  res.status(200).json({
    status: 'success',
    results: meetings.length,
    data: {
      meetings,
    },
  });
});

// Get Meeting by ID
export const getMeetingById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getMeetingByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Meeting ID format', 400));
  }

  const meeting = await meetingService.getMeetingById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      meeting,
    },
  });
});

// Update Meeting by ID
export const updateMeeting = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getMeetingByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Meeting ID format', 400));
  }

  const validatedBody = updateMeetingSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  const updatedMeeting = await meetingService.updateMeeting(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      meeting: updatedMeeting,
    },
  });
});

// Delete Meeting by ID
export const deleteMeeting = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getMeetingByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Meeting ID format', 400));
  }

  await meetingService.deleteMeeting(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});
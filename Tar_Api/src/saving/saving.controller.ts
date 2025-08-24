// src/saving/saving.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as savingService from './saving.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createSavingSchema, updateSavingSchema, getSavingByIdSchema, getSavingByMeetingIdSchema, getSavingByMemberIdSchema } from './saving.validation';

// Create a new Saving
export const createSaving = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createSavingSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const saving = await savingService.createSaving(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      saving,
    },
  });
});

// Get all Savings (with optional filters for meetingId or memberId)
export const getAllSavings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check for nested route parameters
  const meetingParams = getSavingByMeetingIdSchema.safeParse(req.params);
  const memberParams = getSavingByMemberIdSchema.safeParse(req.params);

  let meetingId: number | undefined;
  let memberId: number | undefined;

  if (meetingParams.success) {
    meetingId = meetingParams.data.meetingId;
  }
  if (memberParams.success) {
    memberId = memberParams.data.memberId;
  }

  const savings = await savingService.getAllSavings(meetingId, memberId);
  res.status(200).json({
    status: 'success',
    results: savings.length,
    data: {
      savings,
    },
  });
});

// Get Saving by ID
export const getSavingById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getSavingByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Saving ID format', 400));
  }

  const saving = await savingService.getSavingById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      saving,
    },
  });
});

// Update Saving by ID
export const updateSaving = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getSavingByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Saving ID format', 400));
  }

  const validatedBody = updateSavingSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  const updatedSaving = await savingService.updateSaving(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      saving: updatedSaving,
    },
  });
});

// Delete Saving by ID
export const deleteSaving = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getSavingByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Saving ID format', 400));
  }

  await savingService.deleteSaving(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});
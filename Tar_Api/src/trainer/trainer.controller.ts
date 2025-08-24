// src/trainer/trainer.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as trainerService from './trainer.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createTrainerSchema, updateTrainerSchema, getTrainerByIdSchema } from './trainer.validation';

// Create a new Trainer
export const createTrainer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createTrainerSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const trainer = await trainerService.createTrainer(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});

// Get all Trainers
export const getAllTrainers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trainers = await trainerService.getAllTrainers();
  res.status(200).json({
    status: 'success',
    results: trainers.length,
    data: {
      trainers,
    },
  });
});

// Get Trainer by ID
export const getTrainerById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getTrainerByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Trainer ID format', 400));
  }

  const trainer = await trainerService.getTrainerById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      trainer,
    },
  });
});

// Update Trainer by ID
export const updateTrainer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getTrainerByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Trainer ID format', 400));
  }

  const validatedBody = updateTrainerSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  const updatedTrainer = await trainerService.updateTrainer(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      trainer: updatedTrainer,
    },
  });
});

// Delete Trainer by ID
export const deleteTrainer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getTrainerByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Trainer ID format', 400));
  }

  await trainerService.deleteTrainer(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});

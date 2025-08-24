// src/cycle/cycle.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as cycleService from './cycle.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createCycleSchema, updateCycleSchema, getCycleByIdSchema } from './cycle.validation';
import { CreateCycleData, UpdateCycleData } from './cycle.service'; // Import types from service
import { CycleStatus } from '@prisma/client'; // Import CycleStatus enum

// Create a new Cycle
export const createCycle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createCycleSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  // Explicitly map validatedData.data to CreateCycleData
  // Ensure 'status' is cast to CycleStatus if it comes as a string from validation
  const cycleDataForService: CreateCycleData = {
    name: validatedData.data.name,
    status: validatedData.data.status as CycleStatus, // Cast to CycleStatus
    start_date: validatedData.data.start_date,
    end_date: validatedData.data.end_date,
    group_id: validatedData.data.group_id,
  };

  const cycle = await cycleService.createCycle(cycleDataForService);
  res.status(201).json({
    status: 'success',
    data: {
      cycle,
    },
  });
});

// Get all Cycles
export const getAllCycles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const cycles = await cycleService.getAllCycles();
  res.status(200).json({
    status: 'success',
    results: cycles.length,
    data: {
      cycles,
    },
  });
});

// Get Cycle by ID
export const getCycleById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getCycleByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Cycle ID format', 400));
  }

  const cycle = await cycleService.getCycleById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      cycle,
    },
  });
});

// Update Cycle by ID
export const updateCycle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getCycleByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Cycle ID format', 400));
  }

  const validatedBody = updateCycleSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  // Explicitly map validatedBody.data to UpdateCycleData
  // Ensure 'status' is cast to CycleStatus if it comes as a string from validation
  const updateDataForService: UpdateCycleData = {
    name: validatedBody.data.name,
    status: validatedBody.data.status ? (validatedBody.data.status as CycleStatus) : undefined, // Cast and handle optionality
    start_date: validatedBody.data.start_date,
    end_date: validatedBody.data.end_date,
    group_id: validatedBody.data.group_id,
  };

  const updatedCycle = await cycleService.updateCycle(validatedParams.data.id, updateDataForService);
  res.status(200).json({
    status: 'success',
    data: {
      cycle: updatedCycle,
    },
  });
});

// Delete Cycle by ID
export const deleteCycle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getCycleByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Cycle ID format', 400));
  }

  await cycleService.deleteCycle(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});

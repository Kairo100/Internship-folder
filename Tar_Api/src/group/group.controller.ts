// src/group/group.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as groupService from './group.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createGroupSchema, updateGroupSchema, getGroupByIdSchema } from './group.validation';
// Import the types from group.service.ts
import { CreateGroupData, UpdateGroupData } from './group.service'; // This import will now work

// Create a new Group
export const createGroup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createGroupSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  // Transform validatedData.data to match CreateGroupData expected by groupService.createGroup
  // This is crucial because your validation schema might have different field names
  // (e.g., 'trained_by_trainer_id') than your service's data interface ('trainer_id').
  const groupDataForService: CreateGroupData = {
    name: validatedData.data.name,
    location: validatedData.data.location,
    // Map 'trained_by_trainer_id' from validation to 'trainer_id' for the service
    trainer_id: validatedData.data.trained_by_trainer_id,
    leader_user_id: validatedData.data.leader_user_id,
    // Note: 'date_of_first_training' is present in validatedData but not in your Group model or CreateGroupData.
    // It will be omitted when creating the group in the database.
  };

  const group = await groupService.createGroup(groupDataForService);
  res.status(201).json({
    status: 'success',
    data: {
      group,
    },
  });
});

// Get all Groups
export const getAllGroups = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const groups = await groupService.getAllGroups();
  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups,
    },
  });
});

// Get Group by ID
export const getGroupById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getGroupByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Group ID format', 400));
  }

  const group = await groupService.getGroupById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

// Update Group by ID
export const updateGroup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getGroupByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Group ID format', 400));
  }

  const validatedBody = updateGroupSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  // Transform validatedBody.data to match UpdateGroupData expected by groupService.updateGroup
  const groupDataForService: UpdateGroupData = {
    name: validatedBody.data.name,
    location: validatedBody.data.location,
    // Conditionally map 'trained_by_trainer_id' to 'trainer_id' for the service, if present
    ...(validatedBody.data.trained_by_trainer_id !== undefined && { trainer_id: validatedBody.data.trained_by_trainer_id }),
    leader_user_id: validatedBody.data.leader_user_id,
    // Note: 'date_of_first_training' is present in validatedData but not in your Group model or UpdateGroupData.
    // It will be omitted when updating the group in the database.
  };

  const updatedGroup = await groupService.updateGroup(validatedParams.data.id, groupDataForService);
  res.status(200).json({
    status: 'success',
    data: {
      group: updatedGroup,
    },
  });
});

// Delete Group by ID
export const deleteGroup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getGroupByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Group ID format', 400));
  }

  await groupService.deleteGroup(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});


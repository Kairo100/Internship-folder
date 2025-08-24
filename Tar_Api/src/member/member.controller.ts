// src/member/member.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as memberService from './member.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createMemberSchema, updateMemberSchema, getMemberByIdSchema } from './member.validation';

// Create a new Member
export const createMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createMemberSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const member = await memberService.createMember(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      member,
    },
  });
});

// Get all Members
export const getAllMembers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const members = await memberService.getAllMembers();
  res.status(200).json({
    status: 'success',
    results: members.length,
    data: {
      members,
    },
  });
});

// Get Member by ID
export const getMemberById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getMemberByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Member ID format', 400));
  }

  const member = await memberService.getMemberById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      member,
    },
  });
});

// Update Member by ID
export const updateMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getMemberByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Member ID format', 400));
  }

  const validatedBody = updateMemberSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  const updatedMember = await memberService.updateMember(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      member: updatedMember,
    },
  });
});

// Delete Member by ID
export const deleteMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getMemberByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Member ID format', 400));
  }

  await memberService.deleteMember(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});
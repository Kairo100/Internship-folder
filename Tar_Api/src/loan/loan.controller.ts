// src/loan/loan.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as loanService from './loan.service';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import { createLoanSchema, updateLoanSchema, getLoanByIdSchema, getLoanByMeetingIdSchema, getLoanByMemberIdSchema } from './loan.validation';

// Create a new Loan
export const createLoan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createLoanSchema.safeParse(req.body);
  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const loan = await loanService.createLoan(validatedData.data);
  res.status(201).json({
    status: 'success',
    data: {
      loan,
    },
  });
});

// Get all Loans (with optional filters for meetingId or memberId)
export const getAllLoans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Check for nested route parameters
  const meetingParams = getLoanByMeetingIdSchema.safeParse(req.params);
  const memberParams = getLoanByMemberIdSchema.safeParse(req.params);

  let meetingId: number | undefined;
  let memberId: number | undefined;

  if (meetingParams.success) {
    meetingId = meetingParams.data.meetingId;
  }
  if (memberParams.success) {
    memberId = memberParams.data.memberId;
  }

  const loans = await loanService.getAllLoans(meetingId, memberId);
  res.status(200).json({
    status: 'success',
    results: loans.length,
    data: {
      loans,
    },
  });
});

// Get Loan by ID
export const getLoanById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getLoanByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Loan ID format', 400));
  }

  const loan = await loanService.getLoanById(validatedParams.data.id);
  res.status(200).json({
    status: 'success',
    data: {
      loan,
    },
  });
});

// Update Loan by ID
export const updateLoan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getLoanByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Loan ID format', 400));
  }

  const validatedBody = updateLoanSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return next(new AppError(validatedBody.error.issues[0].message, 400));
  }

  const updatedLoan = await loanService.updateLoan(validatedParams.data.id, validatedBody.data);
  res.status(200).json({
    status: 'success',
    data: {
      loan: updatedLoan,
    },
  });
});

// Delete Loan by ID
export const deleteLoan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedParams = getLoanByIdSchema.safeParse(req.params);
  if (!validatedParams.success) {
    return next(new AppError('Invalid Loan ID format', 400));
  }

  await loanService.deleteLoan(validatedParams.data.id);
  res.status(204).json({
    status: 'success',
    data: null, // 204 No Content typically sends no body
  });
});
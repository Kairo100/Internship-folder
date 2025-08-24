// src/repayment/repayment.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as repaymentService from './repayment.service';
import { createRepaymentSchema, updateRepaymentSchema } from './repayment.validation';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../auth/auth.middleware';
import { CreateRepaymentData, UpdateRepaymentData } from './repayment.service'; // This import will now work

export const createRepayment = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // It's crucial that your Zod schema (createRepaymentSchema) now includes 'member_id'
  // and 'date' is typed as Date, or you convert it.
  const validatedData = createRepaymentSchema.safeParse(req.body);

  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  // Extract data from the validated body.
  // Assuming validatedData.data now contains 'member_id'
  const { amount, date, loan_id, member_id } = validatedData.data;

  const repaymentData: CreateRepaymentData = {
    amount,
    date_of_repayment: date, // Map 'date' from request to 'date_of_repayment'
    loan_id,
    member_id, // Pass member_id as required by the service
  };

  const repayment = await repaymentService.createRepayment(repaymentData);

  res.status(201).json({
    status: 'success',
    data: {
      repayment,
    },
  });
});

export const getAllRepayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Assuming loanId and memberId can come from URL params (e.g., /loans/:loanId/repayments or /members/:memberId/repayments)
  const { loanId, memberId } = req.params;
  const queryLoanId = loanId ? parseInt(loanId) : undefined;
  const queryMemberId = memberId ? parseInt(memberId) : undefined;

  const repayments = await repaymentService.getAllRepayments(queryLoanId, queryMemberId);

  res.status(200).json({
    status: 'success',
    results: repayments.length,
    data: {
      repayments,
    },
  });
});

export const getRepaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const repayment = await repaymentService.getRepaymentById(parseInt(id));

  res.status(200).json({
    status: 'success',
    data: {
      repayment,
    },
  });
});

export const updateRepayment = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  // It's crucial that your Zod schema (updateRepaymentSchema) now includes 'member_id'
  // and 'date' is typed as Date, or you convert it.
  const validatedData = updateRepaymentSchema.safeParse(req.body);

  if (!validatedData.success) {
    return next(new AppError(validatedData.error.issues[0].message, 400));
  }

  const updateData: UpdateRepaymentData = {};

  if (validatedData.data.amount !== undefined) {
    updateData.amount = validatedData.data.amount;
  }
  if (validatedData.data.date !== undefined) {
    updateData.date_of_repayment = validatedData.data.date; // Map 'date' to 'date_of_repayment'
  }
  if (validatedData.data.loan_id !== undefined) {
    updateData.loan_id = validatedData.data.loan_id;
  }
  if (validatedData.data.member_id !== undefined) { // Include member_id if present in body
    updateData.member_id = validatedData.data.member_id;
  }

  const updatedRepayment = await repaymentService.updateRepayment(parseInt(id), updateData);

  res.status(200).json({
    status: 'success',
    data: {
      repayment: updatedRepayment,
    },
  });
});

export const deleteRepayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await repaymentService.deleteRepayment(parseInt(id));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// src/repayment/repayment.validation.ts
import { z } from 'zod';

// Schema for creating a new Repayment
export const createRepaymentSchema = z.object({
  amount: z.number().positive('Repayment amount must be a positive number.'),
  // Assuming 'date' comes as a string and needs to be transformed to a Date object
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)),
  loan_id: z.number().int().positive('Loan ID must be a positive integer.'),
  member_id: z.number().int().positive('Member ID must be a positive integer.'), // <--- THIS IS THE MISSING PIECE
});

// Schema for updating an existing Repayment
export const updateRepaymentSchema = z.object({
  amount: z.number().positive('Repayment amount must be a positive number.').optional(),
  // Assuming 'date' comes as a string and needs to be transformed to a Date object
  date: z.string().datetime('Invalid date format for date.').transform((str) => new Date(str)).optional(),
  loan_id: z.number().int().positive('Loan ID must be a positive integer.').optional(),
  member_id: z.number().int().positive('Member ID must be a positive integer.').optional(), // <--- THIS IS ALSO CRUCIAL FOR UPDATES
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update." }
);

// Schema for getting a single Repayment by ID (for route parameters)
export const getRepaymentByIdSchema = z.object({
  id: z.string().transform(Number), // Convert string ID from URL to number
});

// Schema for nested route parameters (e.g., /loans/:loanId/repayments)
export const getRepaymentByLoanIdSchema = z.object({
  loanId: z.string().transform(Number),
});

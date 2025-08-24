// src/repayment/repayment.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Repayment data, aligned with your schema
export interface CreateRepaymentData { // <-- ENSURED 'export' IS HERE
  amount: number;
  date_of_repayment: Date;
  loan_id: number;
  member_id: number; // This field is required by your Repayment model
}

export interface UpdateRepaymentData { // <-- ENSURED 'export' IS HERE
  amount?: number;
  date_of_repayment?: Date;
  loan_id?: number;
  member_id?: number; // This field is required by your Repayment model
}

const updateLoanRepaymentStatus = async (loanId: number) => {
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: { repayments: true },
  });

  if (!loan) {
    throw new AppError('Loan not found when trying to update its repayment status.', 404);
  }

  // Convert Decimal amounts to numbers for arithmetic operations
  const totalRepaid = loan.repayments.reduce((sum, rep) => sum + rep.amount.toNumber(), 0);
  // Convert Decimal loan amount to number for comparison
  const isFullyRepaid = totalRepaid >= loan.amount.toNumber();

  // Update only if status changes to avoid unnecessary writes
  if (loan.is_fully_repaid !== isFullyRepaid) {
    await prisma.loan.update({
      where: { id: loanId },
      data: { is_fully_repaid: isFullyRepaid },
    });
  }
};

export const createRepayment = async (data: CreateRepaymentData) => {
  // 1. Check if the loan exists
  const loan = await prisma.loan.findUnique({
    where: { id: data.loan_id },
    select: { id: true, amount: true, is_fully_repaid: true } // Select necessary fields
  });
  if (!loan) {
    throw new AppError('Loan not found. Cannot record repayment for a non-existent loan.', 400);
  }

  // 2. Check if the member exists (required by schema)
  const member = await prisma.member.findUnique({
    where: { id: data.member_id },
  });
  if (!member) {
    throw new AppError('Member not found. Cannot record repayment for a non-existent member.', 400);
  }

  if (loan.is_fully_repaid) {
    throw new AppError('This loan is already fully repaid. Cannot add more repayments.', 400);
  }

  const repayment = await prisma.repayment.create({
    data: { // Explicitly map data to ensure it matches Prisma's input type
      amount: data.amount,
      date_of_repayment: data.date_of_repayment,
      loan_id: data.loan_id,
      member_id: data.member_id, // Ensure member_id is passed
    },
    include: {
      loan: {
        select: { id: true, amount: true, date: true, is_fully_repaid: true }
      },
      member: { // Include member as per your schema
        select: { id: true, first_name: true, last_name: true, phone: true }
      }
    },
  });

  // After creating repayment, update the loan's repayment status
  await updateLoanRepaymentStatus(data.loan_id);

  return repayment;
};

export const getAllRepayments = async (loanId?: number, memberId?: number) => { // Added memberId filter
  const where: any = {};
  if (loanId) {
    where.loan_id = loanId;
  }
  if (memberId) { // Added filter by memberId
    where.member_id = memberId;
  }

  const repayments = await prisma.repayment.findMany({
    where,
    orderBy: { date_of_repayment: 'desc' }, // Order by newest first
    include: {
      loan: {
        select: { id: true, amount: true, date: true, is_fully_repaid: true, member_id: true }
      },
      member: { // Include member as per your schema
        select: { id: true, first_name: true, last_name: true, phone: true }
      }
    },
  });
  return repayments;
};

export const getRepaymentById = async (id: number) => {
  const repayment = await prisma.repayment.findUnique({
    where: { id },
    include: {
      loan: {
        select: { id: true, amount: true, date: true, is_fully_repaid: true }
      },
      member: { // Include member as per your schema
        select: { id: true, first_name: true, last_name: true, phone: true }
      }
    },
  });
  if (!repayment) {
    throw new AppError('Repayment record not found', 404);
  }
  return repayment;
};

export const updateRepayment = async (id: number, data: UpdateRepaymentData) => {
  const repayment = await prisma.repayment.findUnique({
    where: { id },
  });
  if (!repayment) {
    throw new AppError('Repayment record not found', 404);
  }

  // If loan_id is being changed (unusual but handled)
  if (data.loan_id && data.loan_id !== repayment.loan_id) {
    const newLoan = await prisma.loan.findUnique({
      where: { id: data.loan_id },
    });
    if (!newLoan) {
      throw new AppError('New Loan not found.', 400);
    }
  }

  // If member_id is being changed
  if (data.member_id && data.member_id !== repayment.member_id) {
    const newMember = await prisma.member.findUnique({
      where: { id: data.member_id },
    });
    if (!newMember) {
      throw new AppError('New Member not found.', 400);
    }
  }

  const updatedRepayment = await prisma.repayment.update({
    where: { id },
    data: { // Explicitly map data to ensure it matches Prisma's input type
      amount: data.amount,
      date_of_repayment: data.date_of_repayment,
      loan_id: data.loan_id,
      member_id: data.member_id, // Ensure member_id is passed
    },
    include: {
      loan: {
        select: { id: true, amount: true, date: true, is_fully_repaid: true }
      },
      member: { // Include member as per your schema
        select: { id: true, first_name: true, last_name: true, phone: true }
      }
    },
  });

  // Update status for both old and new loans if loan_id changed
  await updateLoanRepaymentStatus(repayment.loan_id); // Update old loan's status
  if (data.loan_id && data.loan_id !== repayment.loan_id) {
    await updateLoanRepaymentStatus(data.loan_id); // Update new loan's status
  }

  return updatedRepayment;
};

export const deleteRepayment = async (id: number) => {
  const repayment = await prisma.repayment.findUnique({
    where: { id },
  });
  if (!repayment) {
    throw new AppError('Repayment record not found', 404);
  }

  await prisma.repayment.delete({
    where: { id },
  });

  // After deleting repayment, update the loan's repayment status
  await updateLoanRepaymentStatus(repayment.loan_id);

  return { message: 'Repayment record deleted successfully' };
};

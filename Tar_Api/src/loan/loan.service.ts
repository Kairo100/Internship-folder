// src/loan/loan.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Loan data
interface CreateLoanData {
  amount: number;
  date: Date;
  interest_rate?: number;
  due_date: Date;
  is_fully_repaid: boolean; // <--- REMOVED '?' - now it's always a boolean
  member_id: number;
  meeting_id: number;
}

interface UpdateLoanData {
  amount?: number;
  date?: Date;
  interest_rate?: number;
  due_date?: Date;
  is_fully_repaid?: boolean;
  member_id?: number;
  meeting_id?: number;
}

export const createLoan = async (data: CreateLoanData) => {
  // 1. Check if the member exists
  const member = await prisma.member.findUnique({
    where: { id: data.member_id },
  });
  if (!member) {
    throw new AppError('Member not found. Cannot issue loan to a non-existent member.', 400);
  }

  // 2. Check if the meeting exists
  const meeting = await prisma.meeting.findUnique({
    where: { id: data.meeting_id },
  });
  if (!meeting) {
    throw new AppError('Meeting not found. Cannot record loan for a non-existent meeting.', 400);
  }

  const loan = await prisma.loan.create({
    data, // <--- This 'data' is now guaranteed to have 'is_fully_repaid' as boolean
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true }
      },
      meeting: {
        select: { id: true, name: true, date: true }
      }
    },
  });
  return loan;
};

export const getAllLoans = async (meetingId?: number, memberId?: number) => {
  const where: any = {};
  if (meetingId) {
    where.meeting_id = meetingId;
  }
  if (memberId) {
    where.member_id = memberId;
  }

  const loans = await prisma.loan.findMany({
    where,
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true, group_id: true }
      },
      meeting: {
        select: { id: true, name: true, date: true, group_id: true }
      },
      repayments: { // Include related repayments
        select: { id: true, amount: true, date_of_repayment: true } // Corrected field name
      }
    },
  });
  return loans;
};

export const getLoanById = async (id: number) => {
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true }
      },
      meeting: {
        select: { id: true, name: true, date: true }
      },
      repayments: {
        select: { id: true, amount: true, date_of_repayment: true } // Corrected field name
      }
    },
  });
  if (!loan) {
    throw new AppError('Loan record not found', 404);
  }
  return loan;
};

export const updateLoan = async (id: number, data: UpdateLoanData) => {
  const loan = await prisma.loan.findUnique({
    where: { id },
  });
  if (!loan) {
    throw new AppError('Loan record not found', 404);
  }

  // Check for member existence if member_id is provided
  if (data.member_id) {
    const member = await prisma.member.findUnique({
      where: { id: data.member_id },
    });
    if (!member) {
      throw new AppError('New Member not found.', 400);
    }
  }

  // Check for meeting existence if meeting_id is provided
  if (data.meeting_id) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: data.meeting_id },
    });
    if (!meeting) {
      throw new AppError('New Meeting not found.', 400);
    }
  }

  const updatedLoan = await prisma.loan.update({
    where: { id },
    data,
    include: {
      member: {
        select: { id: true, first_name: true, last_name: true }
      },
      meeting: {
        select: { id: true, name: true, date: true }
      },
      repayments: {
        select: { id: true, amount: true, date_of_repayment: true } // Corrected field name
      }
    },
  });
  return updatedLoan;
};

export const deleteLoan = async (id: number) => {
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: { repayments: true }
  });
  if (!loan) {
    throw new AppError('Loan record not found', 404);
  }

  // Prevent deletion if there are associated repayments
  if (loan.repayments.length > 0) {
    throw new AppError('Cannot delete loan with associated repayments. Please delete repayments first.', 400);
  }

  await prisma.loan.delete({
    where: { id },
  });
  return { message: 'Loan record deleted successfully' };
};
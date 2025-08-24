// src/member/member.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';
import bcrypt from 'bcrypt'; // For password hashing

const prisma = new PrismaClient();

// Define types for Member data
interface CreateMemberData {
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  date_of_birth: Date;
  position: string;
  password: string; // Will be hashed
  group_id: number;
  created_by_user_id: number;
}

interface UpdateMemberData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: Date;
  position?: string;
  password?: string; // Will be hashed if provided
  group_id?: number;
  created_by_user_id?: number;
}

export const createMember = async (data: CreateMemberData) => {
  // 1. Check if the group exists
  const group = await prisma.group.findUnique({
    where: { id: data.group_id },
  });
  if (!group) {
    throw new AppError('Group not found. Cannot assign member to a non-existent group.', 400);
  }

  // 2. Check if the creating user exists
  const creatingUser = await prisma.user.findUnique({
    where: { id: data.created_by_user_id },
  });
  if (!creatingUser) {
    throw new AppError('Creating user not found.', 400);
  }

  // Hash the member's password
  const hashedPassword = await bcrypt.hash(data.password, 12); // Use a salt round of 12

  const member = await prisma.member.create({
    data: {
      ...data,
      password: hashedPassword, // Store hashed password
    },
    include: {
      group: {
        select: { id: true, name: true }
      },
      created_by_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name' as per User model
          email: true
        }
      }
    },
  });
  return member;
};

export const getAllMembers = async () => {
  const members = await prisma.member.findMany({
    include: {
      group: {
        select: { id: true, name: true }
      },
      created_by_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name' as per User model
          email: true
        }
      }
    },
  });
  return members;
};

export const getMemberById = async (id: number) => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      group: {
        select: { id: true, name: true }
      },
      created_by_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name' as per User model
          email: true
        }
      },
      savings: { // Include related savings
        select: { id: true, amount: true, date: true }
      },
      loans: { // Include related loans
        select: { id: true, amount: true, date: true, is_fully_repaid: true }
      },
      attendance: { // Include related attendance records
        select: { id: true, status: true, meeting_id: true }
      }
    },
  });
  if (!member) {
    throw new AppError('Member not found', 404);
  }
  return member;
};

export const updateMember = async (id: number, data: UpdateMemberData) => {
  const member = await prisma.member.findUnique({
    where: { id },
  });
  if (!member) {
    throw new AppError('Member not found', 404);
  }

  // Check for group existence if group_id is provided
  if (data.group_id) {
    const group = await prisma.group.findUnique({
      where: { id: data.group_id },
    });
    if (!group) {
      throw new AppError('New Group not found. Cannot assign member to a non-existent group.', 400);
    }
  }

  // Check for created_by_user existence if created_by_user_id is provided
  if (data.created_by_user_id) {
    const creatingUser = await prisma.user.findUnique({
      where: { id: data.created_by_user_id },
    });
    if (!creatingUser) {
      throw new AppError('New creating user not found.', 400);
    }
  }

  // Hash new password if provided
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12);
  }

  const updatedMember = await prisma.member.update({
    where: { id },
    data,
    include: {
      group: {
        select: { id: true, name: true }
      },
      created_by_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name' as per User model
          email: true
        }
      }
    },
  });
  return updatedMember;
};

export const deleteMember = async (id: number) => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { savings: true, loans: true, attendance: true }
  });

  if (!member) {
    throw new AppError('Member not found', 404);
  }

  // Prevent deletion if there are associated savings, loans, or attendance records
  // You might want to implement cascade deletes in Prisma or handle them explicitly here
  if (member.savings.length > 0 || member.loans.length > 0 || member.attendance.length > 0) {
    throw new AppError('Cannot delete member with associated savings, loans, or attendance records. Please delete them first.', 400);
  }

  await prisma.member.delete({
    where: { id },
  });
  return { message: 'Member deleted successfully' };
};

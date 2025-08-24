// src/cycle/cycle.service.ts
import { PrismaClient, CycleStatus } from '@prisma/client'; // Import CycleStatus enum
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for Cycle data
export interface CreateCycleData { // Exported for use in controller
  name: string;
  status: CycleStatus; // Changed from string to CycleStatus enum
  start_date: Date;
  end_date: Date;
  group_id: number;
}

export interface UpdateCycleData { // Exported for use in controller
  name?: string;
  status?: CycleStatus; // Changed from string to CycleStatus enum
  start_date?: Date;
  end_date?: Date;
  group_id?: number;
}

export const createCycle = async (data: CreateCycleData) => {
  // 1. Check if the group exists
  const group = await prisma.group.findUnique({
    where: { id: data.group_id },
  });
  if (!group) {
    throw new AppError('Group not found. Cannot create cycle for a non-existent group.', 400);
  }

  const cycle = await prisma.cycle.create({
    data: { // Explicitly map data to match Prisma's input type
      name: data.name,
      status: data.status,
      start_date: data.start_date,
      end_date: data.end_date,
      group_id: data.group_id,
    },
    include: {
      group: {
        select: { id: true, name: true }
      }
    },
  });
  return cycle;
};

export const getAllCycles = async () => {
  const cycles = await prisma.cycle.findMany({
    include: {
      group: {
        select: { id: true, name: true }
      }
    },
  });
  return cycles;
};

export const getCycleById = async (id: number) => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
    include: {
      group: {
        select: { id: true, name: true }
      },
      meetings: { // Include related meetings for a comprehensive view
        select: { id: true, name: true, date: true, total_savings_collected: true, total_loans_disbursed: true }
      }
    },
  });
  if (!cycle) {
    throw new AppError('Cycle not found', 404);
  }
  return cycle;
};

export const updateCycle = async (id: number, data: UpdateCycleData) => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
  });
  if (!cycle) {
    throw new AppError('Cycle not found', 404);
  }

  // Check for group existence if group_id is provided for update
  if (data.group_id) {
    const group = await prisma.group.findUnique({
      where: { id: data.group_id },
    });
    if (!group) {
      throw new AppError('New Group not found. Cannot assign cycle to a non-existent group.', 400);
    }
  }

  const updatedCycle = await prisma.cycle.update({
    where: { id },
    data: { // Explicitly map data to match Prisma's input type
      name: data.name,
      status: data.status,
      start_date: data.start_date,
      end_date: data.end_date,
      group_id: data.group_id,
    },
    include: {
      group: {
        select: { id: true, name: true }
      }
    },
  });
  return updatedCycle;
};

export const deleteCycle = async (id: number) => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
    include: { meetings: true }
  });

  if (!cycle) {
    throw new AppError('Cycle not found', 404);
  }

  // Prevent deletion if there are associated meetings
  if (cycle.meetings.length > 0) {
    throw new AppError('Cannot delete cycle with associated meetings. Please delete meetings first.', 400);
  }

  await prisma.cycle.delete({
    where: { id },
  });
  return { message: 'Cycle deleted successfully' };
};

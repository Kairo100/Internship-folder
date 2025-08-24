// src/group/group.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';
import { Role } from '@prisma/client'; // Import Role enum for type checking

const prisma = new PrismaClient();

// Define types for Group data
export interface CreateGroupData { // <-- ENSURED 'export' IS HERE
  name: string;
  location: string;
  trainer_id: number; // Corrected to match schema: 'trainer_id'
  leader_user_id: number;
}

export interface UpdateGroupData { // <-- ENSURED 'export' IS HERE
  name?: string;
  location?: string;
  trainer_id?: number; // Corrected to match schema: 'trainer_id'
  leader_user_id?: number;
}

export const createGroup = async (data: CreateGroupData) => {
  // 1. Check if the trainer exists
  const trainer = await prisma.trainer.findUnique({
    where: { id: data.trainer_id }, // Corrected to 'trainer_id'
  });
  if (!trainer) {
    throw new AppError('Trainer not found. Cannot assign group to a non-existent trainer.', 400);
  }

  // 2. Check if the leader user exists and has the 'Leader' role
  const leaderUser = await prisma.user.findUnique({
    where: { id: data.leader_user_id },
  });
  if (!leaderUser) {
    throw new AppError('Leader User not found. Cannot assign a non-existent user as group leader.', 400);
  }
  // Use the imported Role enum for comparison
  if (leaderUser.role !== Role.Leader) {
    throw new AppError('User assigned as leader does not have the "Leader" role.', 400);
  }

  // 3. Ensure this leader is not already leading another group (unique leader_user_id)
  const existingGroupWithLeader = await prisma.group.findFirst({
    where: { leader_user_id: data.leader_user_id }
  });
  if (existingGroupWithLeader) {
    throw new AppError(`User ${leaderUser.email} is already a leader of group "${existingGroupWithLeader.name}". A user can only lead one group.`, 400);
  }

  const group = await prisma.group.create({
    data: { // Explicitly map data to match GroupCreateInput
      name: data.name,
      location: data.location,
      trainer_id: data.trainer_id,
      leader_user_id: data.leader_user_id,
    },
    // Include related data to return a more complete group object
    include: {
      trainer: true, // Changed from trained_by_trainer to trainer
      leader_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name'
          email: true,
          role: true,
        },
      },
    },
  });
  return group;
};

export const getAllGroups = async () => {
  const groups = await prisma.group.findMany({
    include: {
      trainer: true, // Changed from trained_by_trainer to trainer
      leader_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name'
          email: true,
          role: true,
        },
      },
    },
  });
  return groups;
};

export const getGroupById = async (id: number) => {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      trainer: true, // Changed from trained_by_trainer to trainer
      leader_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name'
          email: true,
          role: true,
        },
      },
      members: { // Also include members for a full view
        select: { id: true, first_name: true, last_name: true, phone: true } // Member model has first_name, last_name
      },
      cycles: { // Include cycles for this group
        select: { id: true, name: true, status: true, start_date: true, end_date: true }
      },
      meetings: { // Include meetings for this group
        select: { id: true, name: true, date: true }
      }
    },
  });
  if (!group) {
    throw new AppError('Group not found', 404);
  }
  return group;
};

export const updateGroup = async (id: number, data: UpdateGroupData) => {
  const group = await prisma.group.findUnique({
    where: { id },
  });
  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // If leader_user_id is being updated, perform checks again
  if (data.leader_user_id && data.leader_user_id !== group.leader_user_id) {
    const newLeaderUser = await prisma.user.findUnique({
      where: { id: data.leader_user_id },
    });
    if (!newLeaderUser) {
      throw new AppError('New Leader User not found.', 400);
    }
    // Use the imported Role enum for comparison
    if (newLeaderUser.role !== Role.Leader) {
      throw new AppError('New user assigned as leader does not have the "Leader" role.', 400);
    }
    // Check if the new leader is already leading another group
    const existingGroupWithNewLeader = await prisma.group.findFirst({
      where: {
        leader_user_id: data.leader_user_id,
        NOT: { id: id } // Exclude the current group being updated
      }
    });
    if (existingGroupWithNewLeader) {
      throw new AppError(`User ${newLeaderUser.email} is already a leader of group "${existingGroupWithNewLeader.name}". A user can only lead one group.`, 400);
    }
  }

  // If trainer_id is being updated
  // Corrected to use group.trainer_id
  if (data.trainer_id && data.trainer_id !== group.trainer_id) {
    const newTrainer = await prisma.trainer.findUnique({
      where: { id: data.trainer_id },
    });
    if (!newTrainer) {
      throw new AppError('New Trainer not found.', 400);
    }
  }

  const updatedGroup = await prisma.group.update({
    where: { id },
    data: { // Explicitly map data to avoid TS2322 error
      name: data.name,
      location: data.location,
      trainer_id: data.trainer_id,
      leader_user_id: data.leader_user_id,
    },
    include: {
      trainer: true, // Changed from trained_by_trainer to trainer
      leader_user: {
        select: {
          id: true,
          name: true, // Corrected to 'name'
          email: true,
          role: true,
        },
      },
    },
  });
  return updatedGroup;
};

export const deleteGroup = async (id: number) => {
  const group = await prisma.group.findUnique({
    where: { id },
    include: { members: true, cycles: true, meetings: true }
  });

  if (!group) {
    throw new AppError('Group not found', 404);
  }

  // Prevent deletion if there are associated members, cycles, or meetings
  if (group.members.length > 0 || group.cycles.length > 0 || group.meetings.length > 0) {
    throw new AppError('Cannot delete group with associated members, cycles, or meetings. Please delete them first.', 400);
  }

  await prisma.group.delete({
    where: { id },
  });
  return { message: 'Group deleted successfully' };
};

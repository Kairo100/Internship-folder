// src/trainer/trainer.service.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// Define types for trainer data (optional but good for clarity)
interface CreateTrainerData {
  name: string;
  phone: string;
  address: string;
}

interface UpdateTrainerData {
  name?: string;
  phone?: string;
  address?: string;
}

export const createTrainer = async (data: CreateTrainerData) => {
  const trainer = await prisma.trainer.create({
    data,
  });
  return trainer;
};

export const getAllTrainers = async () => {
  const trainers = await prisma.trainer.findMany();
  return trainers;
};

export const getTrainerById = async (id: number) => {
  const trainer = await prisma.trainer.findUnique({
    where: { id },
  });
  if (!trainer) {
    throw new AppError('Trainer not found', 404);
  }
  return trainer;
};

export const updateTrainer = async (id: number, data: UpdateTrainerData) => {
  const trainer = await prisma.trainer.findUnique({
    where: { id },
  });
  if (!trainer) {
    throw new AppError('Trainer not found', 404);
  }

  const updatedTrainer = await prisma.trainer.update({
    where: { id },
    data,
  });
  return updatedTrainer;
};

export const deleteTrainer = async (id: number) => {
  const trainer = await prisma.trainer.findUnique({
    where: { id },
  });
  if (!trainer) {
    throw new AppError('Trainer not found', 404);
  }

  await prisma.trainer.delete({
    where: { id },
  });
  return { message: 'Trainer deleted successfully' };
};
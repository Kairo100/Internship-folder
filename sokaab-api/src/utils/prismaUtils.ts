import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function exculdePrismaFields(model: string, excludedFields: string[]) {
  const allFields = Object.keys(prisma[model].fields);

  const selectObject = allFields.reduce((acc, field) => {
    if (!excludedFields.includes(field)) {
      acc[field] = true;
    }
    return acc;
  }, {});

  return selectObject;

  //   return prisma[model].findMany({
  //     select: selectObject,
  //   });
}

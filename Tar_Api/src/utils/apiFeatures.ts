// src/utils/apiFeatures.ts
// This class helps build advanced Prisma queries based on URL query parameters.

import { Prisma } from '@prisma/client';

// Define a type for your Prisma model's findMany arguments
// This is a generic type that can be used with any Prisma model's FindManyArgs
type PrismaFindManyArgs = Prisma.Args<any, 'findMany'>;

class APIFeatures {
  query: PrismaFindManyArgs; // The Prisma query object (e.g., { where: {}, orderBy: {}, take: ..., skip: ... })
  queryString: Record<string, any>; // The raw query string from Express (req.query)

  constructor(query: PrismaFindManyArgs, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1) Filtering
  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Parse the filtered query string back to an object for Prisma's `where` clause
    // Example: { "amount": { "gte": 100 } }
    this.query.where = { ...this.query.where, ...JSON.parse(queryStr) };

    return this;
  }

  // 2) Sorting
  sort(): this {
    if (this.queryString.sort) {
      // Example: sort=name,-createdAt
      const sortBy = this.queryString.sort.split(',').map((field: string) => {
        if (field.startsWith('-')) {
          return { [field.substring(1)]: 'desc' };
        } else {
          return { [field]: 'asc' };
        }
      });
      this.query.orderBy = sortBy;
    } else {
      // Default sort (e.g., by createdAt descending)
      this.query.orderBy = { created_at: 'desc' };
    }
    return this;
  }

  // 3) Field Limiting (Selecting specific fields)
  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').reduce((acc: any, field: string) => {
        acc[field.trim()] = true;
        return acc;
      }, {});
      this.query.select = { ...this.query.select, ...fields };
    }
    return this;
  }

  // 4) Pagination
  paginate(): this {
    const page = parseInt(this.queryString.page || '1', 10);
    const limit = parseInt(this.queryString.limit || '10', 10);
    const skip = (page - 1) * limit;

    this.query.skip = skip;
    this.query.take = limit;

    return this;
  }
}

export default APIFeatures;
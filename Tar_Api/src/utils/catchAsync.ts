// src/utils/catchAsync.ts
import { Request, Response, NextFunction } from 'express';

// Defines a generic async function type for controllers
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Wrapper function to catch errors in async controllers
const catchAsync = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // Catch any errors and pass them to the global error handler
  };
};

export default catchAsync;
// src/repayment/repayment.routes.ts
import { Router, Request, Response, NextFunction } from 'express'; // <-- ADDED Request, Response, NextFunction
import * as repaymentController from './repayment.controller';
import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
import { Role } from '@prisma/client';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma for middleware use

// Main router for standalone /repayments routes (less common, but good to have)
const router = Router();

// Router for nested routes (e.g., /loans/:loanId/repayments)
const nestedRouter = Router({ mergeParams: true });

// Apply authentication to all repayment routes
router.use(authenticate); // For /api/v1/repayments
nestedRouter.use(authenticate); // For /api/v1/loans/:loanId/repayments

// Middleware to restrict access based on user role and loan/member/group ownership
const restrictRepaymentAccess = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const repaymentId = req.params.id ? parseInt(req.params.id) : null;
  const loanId = req.params.loanId ? parseInt(req.params.loanId) : null;
  const user = req.user!;

  if (user.role === Role.Admin || user.role === Role.Agent) {
    return next(); // Admins/Agents can do anything
  }

  let authorizedGroupIds: number[] = [];
  let authorizedMemberIds: number[] = [];

  if (user.role === Role.Leader) {
    const leaderGroup = await prisma.group.findUnique({ where: { leader_user_id: user.id }, select: { id: true } });
    if (leaderGroup) {
      authorizedGroupIds.push(leaderGroup.id);
    }
  } else if (user.role === Role.Member) {
    const member = await prisma.member.findFirst({ where: { created_by_user_id: user.id }, select: { id: true, group_id: true } });
    if (member) {
      authorizedMemberIds.push(member.id);
      authorizedGroupIds.push(member.group_id);
    }
  }

  if (repaymentId) {
    const repayment = await prisma.repayment.findUnique({
      where: { id: repaymentId },
      include: { loan: { include: { member: { select: { id: true, group_id: true } } } } }
    });

    if (!repayment) {
      return next(new AppError('Repayment record not found', 404));
    }

    if (user.role === Role.Member) {
      if (!authorizedMemberIds.includes(repayment.loan.member_id)) {
        return next(new AppError('You are not authorized to access this repayment record.', 403));
      }
    } else if (user.role === Role.Leader) {
      if (!authorizedGroupIds.includes(repayment.loan.member.group_id)) {
        return next(new AppError('You are not authorized to access this repayment record (not in your group).', 403));
      }
    } else {
        return next(new AppError('You are not authorized to perform this action.', 403));
    }
  } else if (loanId) { // Check for nested /loans/:loanId/repayments
    const loan = await prisma.loan.findUnique({ where: { id: loanId }, include: { member: { select: { id: true, group_id: true } } } });
    if (!loan) {
      return next(new AppError('Loan not found.', 404));
    }
    if (user.role === Role.Member) {
        if (!authorizedMemberIds.includes(loan.member_id)) {
            return next(new AppError('You are not authorized to access repayments for this loan (not yours).', 403));
        }
    } else if (user.role === Role.Leader) {
      if (!authorizedGroupIds.includes(loan.member.group_id)) {
        return next(new AppError('You are not authorized to access repayments for this loan (not in your group).', 403));
      }
    }
  }

  next();
});

// Top-level /repayments routes
router
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictRepaymentAccess, repaymentController.createRepayment) // Leaders can create repayments for their group's loans
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictRepaymentAccess, repaymentController.getAllRepayments); // Filtering based on role/group/member in service

router
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictRepaymentAccess, repaymentController.getRepaymentById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictRepaymentAccess, repaymentController.updateRepayment) // Leaders might update repayments for their group's loans
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictRepaymentAccess, repaymentController.deleteRepayment); // Admin/Agent can delete

// --- Nested Routes (to be used in loan.routes) ---
// Example: /api/v1/loans/:loanId/repayments
nestedRouter
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictRepaymentAccess, repaymentController.createRepayment)
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictRepaymentAccess, repaymentController.getAllRepayments);

nestedRouter
  .route('/:id')
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictRepaymentAccess, repaymentController.getRepaymentById)
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictRepaymentAccess, repaymentController.updateRepayment)
  .delete(authorizeRoles(Role.Admin, Role.Agent), restrictRepaymentAccess, repaymentController.deleteRepayment);

export { router, nestedRouter }; // Export both routers
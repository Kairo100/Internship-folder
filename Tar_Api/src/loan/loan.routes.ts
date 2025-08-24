  // src/loan/loan.routes.ts
  import { Router, Request, Response, NextFunction } from 'express'; // <-- ADDED Request, Response, NextFunction
  import * as loanController from './loan.controller';
  import { authenticate, authorizeRoles, AuthRequest } from '../auth/auth.middleware';
  import { Role } from '@prisma/client';
  import AppError from '../utils/AppError';
  import catchAsync from '../utils/catchAsync';
  import { PrismaClient } from '@prisma/client';
  import { nestedRouter as nestedRepaymentRouter } from '../repayment/repayment.routes'; // Import nested router for repayments


  const prisma = new PrismaClient(); // Initialize Prisma for middleware use

  // Main router for standalone /loans routes
  const router = Router();

  // Router for nested routes (e.g., /meetings/:meetingId/loans)
  const nestedRouter = Router({ mergeParams: true });

  // Apply authentication to all loan routes
  router.use(authenticate); // For /api/v1/loans
  nestedRouter.use(authenticate); // For /api/v1/meetings/:meetingId/loans or /api/v1/members/:memberId/loans

  // Middleware to restrict access based on user role and loan/meeting/member ownership
  const restrictLoanAccess = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const loanId = req.params.id ? parseInt(req.params.id) : null;
    const meetingId = req.params.meetingId ? parseInt(req.params.meetingId) : null;
    const memberId = req.params.memberId ? parseInt(req.params.memberId) : null;
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

    if (loanId) {
      const loan = await prisma.loan.findUnique({
        where: { id: loanId },
        include: { member: { select: { id: true, group_id: true } }, meeting: { select: { id: true, group_id: true } } }
      });

      if (!loan) {
        return next(new AppError('Loan record not found', 404));
      }

      if (user.role === Role.Member) {
        if (!authorizedMemberIds.includes(loan.member_id)) {
          return next(new AppError('You are not authorized to access this loan record.', 403));
        }
      } else if (user.role === Role.Leader) {
        if (!authorizedGroupIds.includes(loan.member.group_id) || !authorizedGroupIds.includes(loan.meeting.group_id)) {
          return next(new AppError('You are not authorized to access this loan record (not in your group).', 403));
        }
      } else {
          return next(new AppError('You are not authorized to perform this action.', 403));
      }
    } else if (meetingId) { // Check for nested /meetings/:meetingId/loans
      const meeting = await prisma.meeting.findUnique({ where: { id: meetingId }, select: { group_id: true } });
      if (!meeting) {
        return next(new AppError('Meeting not found.', 404));
      }
      if (user.role === Role.Leader && !authorizedGroupIds.includes(meeting.group_id)) {
        return next(new AppError('You are not authorized to access loans for this meeting (not in your group).', 403));
      }
      // For members, we can still filter further in service
    } else if (memberId) { // Check for nested /members/:memberId/loans
      const member = await prisma.member.findUnique({ where: { id: memberId }, select: { id: true, group_id: true } });
      if (!member) {
        return next(new AppError('Member not found.', 404));
      }
      if (user.role === Role.Member && !authorizedMemberIds.includes(member.id)) {
          return next(new AppError('You are not authorized to access other members\' loans.', 403));
      } else if (user.role === Role.Leader && !authorizedGroupIds.includes(member.group_id)) {
        return next(new AppError('You are not authorized to access loans for members outside your group.', 403));
      }
    }

    next();
  });

  // Top-level /loans routes
  router
    .route('/')
    .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictLoanAccess, loanController.createLoan) // Leaders can create loans for their group members
    .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictLoanAccess, loanController.getAllLoans); // Filtering based on role/group/member in service

  router
    .route('/:id')
    .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictLoanAccess, loanController.getLoanById)
    .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictLoanAccess, loanController.updateLoan) // Members might not update, but Leaders can for their group members
    .delete(authorizeRoles(Role.Admin, Role.Agent), restrictLoanAccess, loanController.deleteLoan); // Admin/Agent can delete

  // --- Nested Routes (to be used in meeting.routes or member.routes) ---
  // Example: /api/v1/meetings/:meetingId/loans
  nestedRouter
    .route('/')
    .post(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictLoanAccess, loanController.createLoan)
    .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictLoanAccess, loanController.getAllLoans);

  nestedRouter
    .route('/:id')
    .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), restrictLoanAccess, loanController.getLoanById)
    .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictLoanAccess, loanController.updateLoan)
    .delete(authorizeRoles(Role.Admin, Role.Agent), restrictLoanAccess, loanController.deleteLoan);

    // --- Nested Routes for Repayments within a specific loan ---
  // This means you can now access /api/v1/loans/:loanId/repayments
  router.use('/:loanId/repayments', nestedRepaymentRouter); // Mount the nestedRepaymentRouter here for top-level loan router

  export { router, nestedRouter }; // Export both routers
// src/member/member.routes.ts
import { Router } from 'express';
import * as memberController from './member.controller';
import { authenticate, authorizeRoles } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

import { nestedRouter as nestedSavingRouter } from '../saving/saving.routes';
import { nestedRouter as nestedLoanRouter } from '../loan/loan.routes'; 
import { nestedRouter as nestedAttendanceRouter } from '../attendance/attendance.routes';

const memberRouter = Router();

// Apply authentication to all member routes
memberRouter.use(authenticate);

memberRouter
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent), memberController.createMember) // Only Admin or Agent can create
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), memberController.getAllMembers); // Admin/Agent can see all, Leader might see only their group's members

memberRouter
  .route('/:id')
  // Get specific member - needs logic for Leaders/Members to restrict to their own/group's members
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), memberController.getMemberById)
  // Update member - Admin/Agent can update all, Leaders might update their group's members, Members might update themselves
  .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), memberController.updateMember)
  .delete(authorizeRoles(Role.Admin, Role.Agent), memberController.deleteMember); // Only Admin/Agent can delete

// --- Example of specific authorization for Leader/Member ---
// For `getMemberById` and `updateMember`, a 'Leader' should only access members within *their* group.
// A 'Member' should only access *their own* data. This requires a custom middleware:

/*
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
const prisma = new PrismaClient();

const checkMemberOwnershipOrGroupLeadership = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const memberId = parseInt(req.params.id);
    const user = req.user!; // We know user exists from `authenticate`

    if (user.role === Role.Member) {
        if (user.id !== memberId) { // Assuming member ID is also their user ID, or a link exists
             // If User ID !== Member ID, you'd need to fetch the member and check if created by user.id OR if they are the member.
             const member = await prisma.member.findUnique({ where: { id: memberId }});
             if (!member || member.id !== user.id) { // This `member.id !== user.id` check needs clarification based on your User/Member distinction
                return next(new AppError('You are not authorized to access this member data.', 403));
             }
        }
    } else if (user.role === Role.Leader) {
        // Fetch the group this leader manages
        const leaderGroup = await prisma.group.findUnique({ where: { leader_user_id: user.id } });
        if (!leaderGroup) {
            return next(new AppError('You are a leader but not assigned to any group.', 403));
        }
        // Check if the requested member belongs to this leader's group
        const member = await prisma.member.findUnique({ where: { id: memberId } });
        if (!member || member.group_id !== leaderGroup.id) {
            return next(new AppError('You are not authorized to access members outside your group.', 403));
        }
    }
    next();
});

// Update routes to use this middleware for granular control:
// router.route('/:id')
//   .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), checkMemberOwnershipOrGroupLeadership, memberController.getMemberById)
//   .patch(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), checkMemberOwnershipOrGroupLeadership, memberController.updateMember)
//   .delete(...) // Deletion usually only by Admin/Agent
*/
memberRouter.use('/:memberId/savings', nestedSavingRouter); 
memberRouter.use('/:memberId/loans', nestedLoanRouter);
memberRouter.use('/:memberId/attendance', nestedAttendanceRouter);

export default memberRouter;
// src/group/group.routes.ts
import { Router } from 'express';
import * as groupController from './group.controller';
import { authenticate, authorizeRoles } from '../auth/auth.middleware'; // Import from central middleware
import { AuthRequest } from '../auth/auth.middleware'; // Import AuthRequest for custom types
import { Role } from '@prisma/client'; // Import Role enum from Prisma client

const router = Router();

// Apply authentication to all group routes
router.use(authenticate);

router
  .route('/')
  .post(authorizeRoles(Role.Admin, Role.Agent), groupController.createGroup) // Only Admin or Agent can create
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), groupController.getAllGroups); // All roles can view (consider scope for Leader/Member)

router
  .route('/:id')
  // Get a specific group - Leader should only get THEIR group, others can get any.
  // This needs a specific middleware or logic in controller to check ownership for 'Leader' role.
  .get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader, Role.Member), groupController.getGroupById)
  // Update group - only Admin/Agent. A Leader might be able to update specific fields of THEIR group
  .patch(authorizeRoles(Role.Admin, Role.Agent), groupController.updateGroup)
  .delete(authorizeRoles(Role.Admin), groupController.deleteGroup); // Only Admin can delete

// --- Example of a specific middleware for Leader access to their own group ---
// You could add a middleware here like:
// const restrictGroupAccessToLeader = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
//     const groupId = parseInt(req.params.id);
//     if (req.user?.role === Role.Leader) {
//         const group = await prisma.group.findUnique({ where: { id: groupId } });
//         if (!group || group.leader_user_id !== req.user.id) {
//             return next(new AppError('You are not authorized to access this group.', 403));
//         }
//     }
//     next();
// });
// Then apply it: router.route('/:id').get(authorizeRoles(Role.Admin, Role.Agent, Role.Leader), restrictGroupAccessToLeader, groupController.getGroupById);

export default router;
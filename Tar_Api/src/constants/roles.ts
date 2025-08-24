// src/constants/roles.ts
// This file centralizes role definitions.
// In this project, we are primarily using the Role enum directly from Prisma Client.
// This file serves as a reference or could be extended for other role-related constants.

import { Role } from '@prisma/client';

export const USER_ROLES = Role; // Re-export Prisma's Role enum for consistent reference

// Example of other potential constants related to roles (not directly from Prisma)
export const DEFAULT_SIGNUP_ROLE: Role = Role.Member;
export const ADMIN_ROLE_NAME: string = 'Admin';
export const AGENT_ROLE_NAME: string = 'Agent';
// ... etc.

// You might also define a list of roles for UI purposes if needed
export const AVAILABLE_ROLES: Role[] = Object.values(Role);
import * as z from 'zod';

export const AuthLoginSchema = z.object({
  email: z.string().email().min(3).max(30),
  password: z.string().min(3),
  user_type: z
    .enum(['user_account', 'organisation_member'])
    .default('user_account'),
});

export type AuthLoginDto = z.infer<typeof AuthLoginSchema>;

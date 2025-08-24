import * as z from 'zod';

import { UserSchema } from './index';

export const CreateUserSchema = UserSchema.pick({
  first_name: true,
  last_name: true,
  email_address: true,
  password: true,
})
  .merge(
    z.object({
      confirm_password: z.string(),
      account_type: z.string().optional(),
      title: z.string().optional(),
      User_organisation: z.string().optional(),
    }),
  )
  .strict();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

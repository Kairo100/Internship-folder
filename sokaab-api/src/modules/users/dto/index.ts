import * as z from 'zod';

export const UserSchema = z.object({
  user_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email_address: z.string(),
  password: z.string(),
  email_verified: z.boolean(),
  date_time_added: z.coerce.date(),
  added_by: z.string(),
  account_type: z.string(),
  title: z.string(),
  User_organisation: z.string(),
});

export type UserDTO = z.infer<typeof UserSchema>;

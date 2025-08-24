import * as z from 'zod';

import { ContactsSchema } from './index';

// Contacts
export const CreateContactsSchema = ContactsSchema.pick({
  name: true,
  contact_reason: true,
  email_address: true,
  subject: true,
  message: true,
})
  .merge(
    z.object({
      name: z.string().min(3).max(20),
      contact_reason: z.string().min(3).max(20),
      email_address: z.string().email().min(3).max(30).optional(),
      subject: z.string().min(3).max(50),
      message: z.string().min(3).max(500),
    }),
  )
  .strict();
export type CreateContactsDto = z.infer<typeof CreateContactsSchema>;

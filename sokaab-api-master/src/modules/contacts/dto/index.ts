import * as z from 'zod';

export const ContactsSchema = z.object({
  id: z.number(),
  name: z.string(),
  contact_reason: z.string(),
  email_address: z.string(),
  subject: z.string(),
  message: z.string(),
  added_on: z.coerce.date(),
  added_by: z.string(),
  entity_id: z.number(),
});

export type ContactsDto = z.infer<typeof ContactsSchema>;

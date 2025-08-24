import * as z from 'zod';

import { OrganisationSchema, OrganisationMemberSchema } from './index';

// Organisation
export const CreateOrganisationSchema = OrganisationSchema.pick({
  organisation_name: true,
  organisation_bio: true,
  phone_number: true,
  email_address: true,
  entity_id: true,
})
  .merge(
    z.object({
      website_address: z.string().max(50).optional(),
      address: z.string().max(50).optional(),
      country: z.string().max(50).optional(),
    }),
  )
  .strict();
export type CreateOrganisationDto = z.infer<typeof CreateOrganisationSchema>;

export const UpdateOrganisationSchema = CreateOrganisationSchema.partial();
export type UpdateOrganisationDto = z.infer<typeof UpdateOrganisationSchema>;

// Organisation member
export const CreateOrganisationMemberSchema = OrganisationMemberSchema.pick({
  full_name: true,
  email_address: true,
  telephone_number: true,
  position_held: true,
  password: true,
})
  .merge(z.object({}))
  .strict();
export type CreateOrganisationMemberDto = z.infer<
  typeof CreateOrganisationMemberSchema
>;

export const UpdateOrganisationMemberSchema =
  CreateOrganisationMemberSchema.partial();
export type UpdateOrganisationMemberDto = z.infer<
  typeof UpdateOrganisationMemberSchema
>;

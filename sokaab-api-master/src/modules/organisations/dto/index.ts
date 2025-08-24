import * as z from 'zod';

export const PictureSchema = z.object({
  type: z.string(),
  data: z.array(z.number()),
});

export const OrganisationSchema = z.object({
  organisation_id: z.number(),
  account_status: z.string(),
  organisation_name: z.string(),
  organisation_logo: PictureSchema,
  organisation_bio: z.string(),
  phone_number: z.string(),
  email_address: z.string(),
  website_address: z.string(),
  facebook_page: z.string(),
  twitter_page: z.string(),
  linkedIn_page: z.string(),
  pinterest_page: z.string(),
  address: z.string(),
  post_zip_code: z.string(),
  country: z.string(),
  date_time_added: z.coerce.date(),
  added_by: z.string(),
  entity_id: z.number(),
});

export type OrganisationDto = z.infer<typeof OrganisationSchema>;

export const OrganisationMemberSchema = z.object({
  member_id: z.number(),
  organisation_id: z.number(),
  full_name: z.string().min(5).max(20),
  email_address: z.string(),
  telephone_number: z.string().min(7).max(16),
  position_held: z.string().max(20),
  email_verification_string: z.string(),
  email_verified: z.boolean(),
  password: z.string(),
  date_time_added: z.coerce.date(),
  added_by: z.string(),
});
export type OrganisationMemberDto = z.infer<typeof OrganisationMemberSchema>;

import * as z from 'zod';

export const ProjectReviewSchema = z.object({
  review_id: z.number(),
  reviewer_name: z.string(),
  reviewer_email: z.string(),
  review_comment: z.string(),
  added_on: z.coerce.date(),
  project_id: z.number(),
});
export type ProjectReview = z.infer<typeof ProjectReviewSchema>;

export const ProjectCommitteeSchema = z.object({
  committee_id: z.number(),
  committee_name: z.string(),
  committee_mobile_number: z.string(),
  project_id: z.number(),
  added_by: z.string(),
  date_time_added: z.coerce.date(),
  position_held: z.string(),
});
export type ProjectCommitteeDto = z.infer<typeof ProjectCommitteeSchema>;

export const ProjectAccountSchema = z.object({
  bankId: z.string(),
  project_Id: z.number(),
  date_time_added: z.coerce.date(),
  added_by: z.string(),
  AccNo: z.string(),
});
export type ProjectAccountDto = z.infer<typeof ProjectAccountSchema>;

export const PictureSchema = z.object({
  type: z.string(),
  data: z.array(z.number()),
});
export type Picture = z.infer<typeof PictureSchema>;

export const ProjectSchema = z.object({
  project_id: z.number().optional(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.string(),
  video: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  recommended_amount: z.number(),
  funding_goal: z.number(),
  available_grant: z.number(),
  end_method: z.string(),
  community_name: z.string(),
  country_region: z.string(),
  location_district: z.string(),
  village: z.string(),
  // implementation_start_date: z.coerce.date(),
  // implementation_end_date: z.coerce.date(),
  organisation_id: z.number(),
  added_by: z.string().optional(),
  date_time_added: z.coerce.date().optional(),
  entity_id: z.number(),
  story: z.string().optional(),
  picture_1: PictureSchema.optional(),
  picture_2: PictureSchema.optional(),
  picture_3: PictureSchema.optional(),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  project_value: z.string().optional(),
  Project_reviews: z.array(ProjectReviewSchema).optional(),
  Project_committee: z.array(ProjectCommitteeSchema).optional(),
  Project_accounts: z.array(ProjectAccountSchema).optional(),
  Project_updates: z.array(z.any()).optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

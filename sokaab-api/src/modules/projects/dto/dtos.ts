import * as z from 'zod';

import {
  ProjectSchema,
  ProjectAccountSchema,
  ProjectCommitteeSchema,
} from './index';

// ** Project *
export const CreateProjectSchema = ProjectSchema.pick({
  title: true,
  description: true,
  subtitle: true,
  category: true,
  tags: true,
  video: true,
  start_date: true,
  end_date: true,

  recommended_amount: true,
  project_value: true,
  funding_goal: true,
  available_grant: true,
  end_method: true,

  community_name: true,
  organisation_id: true,
  entity_id: true,

  country_region: true,
  location_district: true,
  village: true,
  latitude: true,
  longitude: true,

  // implementation_start_date: false,
  // implementation_end_date: false,
  // added_by: true,
  // date_time_added: true,
  // story: true,
  // status: true,
})
  .merge(
    z.object({
      // video: z.string().url().optional(),
      project_value: z.string().optional(),
      latitude: z.string().optional().nullable(),
      longitude: z.string().optional().nullable(),
    }),
  )
  .strict();

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;

// export const UpdateProjectSchema = ProjectSchema.pick({
//   title: true,
//   description: true,
//   subtitle: true,
//   category: true,
//   tags: true,
//   video: true,
//   start_date: true,
//   end_date: true,

//   recommended_amount: true,
//   project_value: true,
//   funding_goal: true,
//   available_grant: true,
//   end_method: true,

//   community_name: true,
//   organisation_id: true,
//   entity_id: true,

//   country_region: true,
//   location_district: true,
//   village: true,
//   latitude: true,
//   longitude: true,

//   // implementation_start_date: false,
//   // implementation_end_date: false,
//   // added_by: true,
//   // date_time_added: true,
//   // story: true,
//   // status: true,
// })
//   .merge(
//     z.object({
//       // video: z.string().url().optional(),
//       project_value: z.string().optional(),
//       latitude: z.string().optional().nullable(),
//       longitude: z.string().optional().nullable(),
//     }),
//   )
//   .strict();

export const UpdateProjectSchema = CreateProjectSchema.partial();
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;

// export const UpdateProjectSchema = ProjectSchema.pic(
//   z.object({
//     s: z.string(),
//   }),
// );

// export const UpdateProjectSchema = z.object({
//   email: z.string().nullish(),
//   username: z.string().nullish(),
// });
// .strict();
// export const UpdateProjectSchema = userSchema.pick();
// export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;

// ** Project Status
export const UpdateProjectStorySchema = ProjectSchema.pick({
  story: true,
});
export type UpdateProjectStoryDto = z.infer<typeof UpdateProjectStorySchema>;

// ** Project Accounts *
export const CreateProjectAccountSchema = ProjectAccountSchema.pick({
  bankId: true,
  AccNo: true,
})
  .merge(z.object({}))
  .strict();
export type CreateProjectAccountDto = z.infer<
  typeof CreateProjectAccountSchema
>;

// ** Project Committee
export const CreateProjectCommitteeSchema = ProjectCommitteeSchema.pick({
  committee_name: true,
  committee_mobile_number: true,
  position_held: true,
})
  .merge(z.object({}))
  .strict();
export type CreateProjectCommitteeDto = z.infer<
  typeof CreateProjectCommitteeSchema
>;
export const UpdateProjectCommitteeSchema =
  CreateProjectCommitteeSchema.partial();
export type UpdateProjectCommitteeDto = z.infer<
  typeof UpdateProjectCommitteeSchema
>;

// ** Project Status
export const UpdateProjectStatusSchema = ProjectSchema.pick({
  status: true,
});
export type UpdateProjectStatusDto = z.infer<typeof UpdateProjectStatusSchema>;

// ** Approve Project Updates
export const ApproveProjectUpdateSchema = z.object({
  update_id: z.number(),
  project_id: z.number(),
  approved: z.boolean(),
});
export type ApproveProjectUpdateDto = z.infer<
  typeof ApproveProjectUpdateSchema
>;

export const ProjectImagesSchema = z.object({
  name: z.string(),
  image: z.any(),
});
export type ProjectImagesDto = z.infer<typeof ProjectImagesSchema>;

// IN Kind Donations
export const createInKindDonationSchema = z.object({
  project_id: z.number({
    required_error: 'Project ID is required',
    invalid_type_error: 'Project ID must be a number',
  }),
  donated_by: z.string().max(100).optional().nullable(),
  mobile_number: z.string().max(50).optional().nullable(),
  inkind_type: z.number({
    required_error: 'In-kind donation type is required',
    invalid_type_error: 'In-kind type must be a number',
  }),
  quantity_donated: z.string().max(50).optional().nullable(),
  total_amount: z.number({
    required_error: 'Total amount is required',
    invalid_type_error: 'Total amount must be a number',
  }),
  added_by: z.string().max(50).optional().nullable(),
  project_organisation_id: z.number().optional().default(0),
});

export const updateInKindDonationSchema = z.object({
  project_id: z.number().optional(),
  donated_by: z.string().max(100).optional().nullable(),
  mobile_number: z.string().max(50).optional().nullable(),
  inkind_type: z.number().optional(),
  quantity_donated: z.string().max(50).optional().nullable(),
  total_amount: z.number().optional(),
  added_by: z.string().max(50).optional().nullable(),
  project_organisation_id: z.number().optional(),
});

export const searchFilterSchema = z.object({
  skip: z.coerce.number().min(1).default(1),
  take: z.coerce.number().min(1).max(100).default(10),
  project_id: z.coerce.number().optional(),
  inkind_type: z.coerce.number().optional(),
  donated_by: z.string().optional(),
  mobile_number: z.string().optional(),
  search: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z
    .enum(['id', 'donated_by', 'total_amount', 'added_on'])
    .optional()
    .default('added_on'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateInKindDonationDto = z.infer<
  typeof createInKindDonationSchema
>;
export type UpdateInKindDonationDto = z.infer<
  typeof updateInKindDonationSchema
>;
export type SearchFilterDto = z.infer<typeof searchFilterSchema>;



//for documents upload

// ** Project Documents
export const CreateProjectDocumentSchema = z.object({
  fileName: z.string().optional(), 
  description: z.string().optional(), 
});

export type CreateProjectDocumentDto = z.infer<typeof CreateProjectDocumentSchema>;
export const UpdateProjectDocumentSchema = CreateProjectDocumentSchema.partial();
export type UpdateProjectDocumentDto = z.infer<typeof UpdateProjectDocumentSchema>;







import * as z from 'zod';

import { ProjectSchema } from './index';

// export const CreateProjectSchema = z
//   .object({
//     ...Project.shape,
//     project_id: z.undefined(),
//     added_by: z.undefined(),
//     date_time_added: z.undefined(),
//     entity_id: z.undefined(),
//     latitude: z.undefined(),
//     longitude: z.undefined(),
//     status: z.undefined(),
//     project_value: z.undefined(),
//   })
//   .required();

// export type CreateProject = z.infer<typeof CreateProjectSchema>;

// function fieldWithCustomError(fieldName, schema, errorMessages) {
//   const fieldSchema = z.object({ [fieldName]: schema });

//   const refinedSchema = fieldSchema.refine(
//     (data) => {
//       // Add your custom validation logic here if needed
//       return true;
//     },
//     { message: { [fieldName]: errorMessages } },
//   );

//   return refinedSchema;
// }

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
      //title: z.string().min(3), // Updating the above
      // review_id: z.number().transform((val) => val, { path: ['Review ID'] }),
      // Add additional fields specific to project creation if any
      // For example, createdBy, createdAt, etc.
      // createdBy: z.string(),
      // // Define constraints for specific fields
      // recommended_amount: z.string().min(1), // Example: minimum recommended amount
      // funding_goal: z.number().min(1), // Example: minimum funding goal
      // available_grant: z.number().min(0), // Example: available grant should be non-negative
      // implementation_start_date: z.coerce.date().min(new Date()), // Example: start date should be in the future
      // implementation_end_date: z.coerce
      //   .date()
      //   .min(z.ref('implementation_start_date')), // Example: end date should be after start date
      // picture_1: PictureSchema, // Ensure PictureSchema is included
    }),
  )
  .strict();

export type CreateProject = z.infer<typeof CreateProjectSchema>;

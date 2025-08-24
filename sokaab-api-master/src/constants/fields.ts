const selectedKeys = [
  'project_id',
  'title',
  'subtitle',
  'description',
  'category',
  'tags',
  'video',
  'start_date',
  'end_date',
  'recommended_amount',
  'funding_goal',
  'available_grant',
  'end_method',
  'community_name',
  'country_region',
  'location_district',
  'village',
  'implementation_start_date',
  'implementation_end_date',
  'organisation_id',
  'added_by',
  'date_time_added',
  'entity_id',
  'story',
  'latitude',
  'longitude',
  'status',

  // relationships
  // 'Project_accounts',
];

export const projectSelectedFields = Object.fromEntries(
  selectedKeys.map((key) => [key, true]),
);

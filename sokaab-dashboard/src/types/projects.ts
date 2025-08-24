//** Projects */
export type IProject = {
  project_id: number
  title: string
  subtitle: string
  description: string
  category: string
  tags: string
  video: string
  start_date: Date
  end_date: Date
  recommended_amount: string
  funding_goal: number
  available_grant: number
  end_method: string
  community_name: string
  country_region: string
  location_district: string
  village: string
  implementation_start_date: Date
  implementation_end_date: Date
  organisation_id: number
  added_by: string
  date_time_added: Date
  entity_id: number
  story: string
  picture_1: IPicture
  picture_2: IPicture
  picture_3: IPicture
  latitude: null
  longitude: null
  status: null
  project_value: string
  Project_reviews: IProjectReview[]
  Project_committee: IProjectCommittee[]
  Project_accounts: IProjectAccount[]
  Project_updates: any[]
  images: any
}

export type IProjectReview = {
  review_id: number
  reviewer_name: string
  reviewer_email: string
  review_comment: string
  added_on: Date
  project_id: number
}

export type IPicture = {
  type: string
  data: number[]
}

// ** Accounts *
export type IProjectAccount = {
  bankId: string
  project_Id: number
  date_time_added: Date
  added_by: string
  AccNo: string
}

export type TCreatProjectAccount = {
  bankId: string
  AccNo: string
}

export type TUpdateProjectAccount = Partial<TCreatProjectAccount>

// ** Committees *
export type IProjectCommittee = {
  committee_id: number
  committee_name: string
  committee_mobile_number: string
  project_id: number
  added_by: string
  date_time_added: Date
  position_held: string
}

export type TCreatProjectCommittee = {
  committee_name: string
  committee_mobile_number: string
  position_held: string
}

export type TUpdateProjectCommittee = Partial<TCreatProjectCommittee>

// ** Transactions *
export type IProjectTransaction = {
  id: number
  Acc: number
  TranAmt: number
  CustomerName: string
  Narration: number
  Category: string
  DrCr: string
  TranDate: string
}

// ** In-kind Donations
export type InKindDonations = {
  added_by: string
  added_on: null
  donated_by: string
  id: number
  inkind_type: number
  mobile_number: string
  project_id: number
  project_organisation_id: number
  quantity_donated: string
  total_amount: string
  type_details?: string
}



//New:_ TCreateProjectTransaction
// Type for creating a new project transaction (for sending to backend API)
// This MUST match your Excel EXPECTED_HEADERS and backend CreateProjectTransactionDto
export type TCreatProjectTransaction = {
  TrasdateDate: string; // Date as 'YYYY-MM-DD' string
  TransNo?: string;
  AccNo?: string;
  CustomerName?: string | null;
  TransAmt: number;
  Narration: string;
  DrCr: 'Cr' | 'Dr';
  UTI?: string | null;
  CurrencyCode?: string | null;
  ChargedAmoun?: number | null;
  Category?: string | null;
};

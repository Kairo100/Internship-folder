export type TOrganisation = {
  organisation_id: number
  account_status: string
  organisation_name: string
  organisation_bio: string
  phone_number: string
  email_address: string
  website_address: string
  facebook_page: string
  twitter_page: string
  linkedIn_page: string
  pinterest_page: string
  address: string
  post_zip_code: string
  country: string
  date_time_added: Date
  added_by: string
  entity_id: number
}

export type TCreatOrganisation = {
  organisation_name: string
  organisation_bio: string
  phone_number: string
  email_address: string
  website_address: string
  address: string
  country: string
  entity_id: string
}

export type TUpdateOrganisation = Partial<TCreatOrganisation>

export type TOrganisationMemeber = {
  member_id: number
  organisation_id: number
  full_name: string
  email_address: string
  telephone_number: string
  position_held: string
  email_verification_string: string
  email_verified: boolean
  password: string
  date_time_added: Date
  added_by: string
}

export type TCreatOrganisationMemeber = {
  full_name: string
  email_address: string
  telephone_number: string
  position_held: string
  password: string
}

export type TUpdateOrganisationMember = Partial<TCreatOrganisationMemeber>

export type TLogin = {
  email: string
  password: string
  user_type: 'user_account' | 'organisation_member'
}

export type LoginParams = {
  email: string
  password: string
  user_type: 'user_account' | 'organisation_member'
  rememberMe?: boolean
}

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type UserDataType = {
  id: number | string
  role: string
  email: string
  fullName: string
  user_type: 'user_account' | 'organisation_member'
  first_name?: string
  last_name?: string
  account_type?: string
  // Organization member specific fields
  full_name?: string
  member_id?: number // For organization members, this is the same as id
  organisation_id?: number
  organisation_name?: string
  position_held?: string
  organisation?: any
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

import { TContacts } from 'src/types/contacts'
import axios from './apiConfig'

const endPoint = '/contacts'

// ** Contacts
export const fetchContacts = async (data: any) => {
  const { skip, take, search } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search

  try {
    const response = await axios.get(`${endPoint}/`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

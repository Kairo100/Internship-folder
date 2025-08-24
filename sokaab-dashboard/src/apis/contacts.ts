import { TContacts } from 'src/types/contacts'
import axios from './apiConfig'

const endPoint = '/contacts'

// ** Contacts
export const fetchContacts = async (data: any) => {
  // const { skip, take, search } = data
  const { skip, take, search, startDate, endDate } = data 
  let params: any = {
    skip: skip,
    take: take
  }

 
  // Check for  startDate, and endDate and add them to the params object
  if (search) params.search = search
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  try {
    const response = await axios.get(`${endPoint}/`, {
      params: params  
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

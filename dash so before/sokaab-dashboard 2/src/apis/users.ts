import { IUser } from 'src/types/users'
import axios from './apiConfig'

const endPoint = '/users'

export const fetchUsers = async (data: any) => {
  const { skip, take, search, statusFilter, categoryFilter } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter

  try {
    const response = await axios.get(`${endPoint}/`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

export const getUser = async (id: string) => {
  try {
    const response = await axios.get(`${endPoint}/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const addUser = async (data: any) => {
  const body: Partial<IUser> = {
    email_address: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    password: data.password
  }

  try {
    const response = await axios.post(`${endPoint}`, { ...body, confirm_password: data.confirmPassword })
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const updateUser = async (id: string, updatedData: any) => {
  const body: Partial<IUser> = {
    email_address: updatedData.email,
    first_name: updatedData.firstName,
    last_name: updatedData.lastName,
    password: updatedData.password
  }

  try {
    const response = await axios.put(`${endPoint}/${id}`, { ...body, confirm_password: updatedData.confirmPassword })
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${endPoint}/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

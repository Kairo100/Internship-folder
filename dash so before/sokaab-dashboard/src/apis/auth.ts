import axios from 'axios'
import { TLogin } from 'src/types/auth'
import axiosinstance from './apiConfig'

const endPoint = '/auth'
export const login = async (loginData: TLogin) => {
  try {
    console.log('---------', process.env.API_URL)
    const response = await axiosinstance.post(`${endPoint}/login`, loginData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const authMe = async () => {
  try {
    const response = await axiosinstance.get(`${endPoint}/me/`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

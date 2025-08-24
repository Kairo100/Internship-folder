import { TCreatOrganisation, TCreatOrganisationMemeber, TOrganisation } from 'src/types/organisations'
import axios from './apiConfig'

const endPoint = '/statistics'

export const getProjectStatistics = async (projectId: number) => {
  try {
    const response = await axios.get(`${endPoint}/projects/${projectId}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const getDashboardStatistics = async () => {
  try {
    const response = await axios.get(`${endPoint}/dashboard`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

import { TCreatOrganisation, TCreatOrganisationMemeber, TOrganisation } from 'src/types/organisations'
import axios from './apiConfig'

const endPoint = '/organisations'

// ** Oganisations
export const fetchOrganisations = async (data: any) => {
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

export const getOrganisation = async (id: number) => {
  try {
    const response = await axios.get(`${endPoint}/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const addOrganisation = async (data: TCreatOrganisation) => {
  const newData: Partial<TOrganisation> = {
    ...data,
    entity_id: Number(data.entity_id)
  }

  try {
    const response = await axios.post(`${endPoint}`, newData)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const updateOrganisation = async (id: number, updatedData: Partial<TCreatOrganisation>) => {
  const newData: Partial<TOrganisation> = {
    ...updatedData,
    entity_id: Number(updatedData.entity_id)
  }
  try {
    const response = await axios.put(`${endPoint}/${id}`, newData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteOrganisation = async (id: number) => {
  try {
    const response = await axios.delete(`${endPoint}/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// ** Organisation memebers
export const fetchOrganisationMembers = async (id: number, data: any) => {
  const { skip, take, search, statusFilter, categoryFilter } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter

  try {
    const response = await axios.get(`${endPoint}/${id}/members`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

export const getOrganisationMember = async (id: number, memeberId: number) => {
  try {
    const response = await axios.get(`${endPoint}/${id}/members/${memeberId}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const addOrganisationMember = async (id: number, data: TCreatOrganisationMemeber) => {
  try {
    const response = await axios.post(`${endPoint}/${id}/members`, data)
    return response.data
  } catch (error: any) {
    throw error
  }
}


//adding org stat


export type TOrganisationMetrics = {
  total_projects: number;
  active_projects: number;
  total_funding_raised: number;
  total_matching_funding: number;
};

export const fetchOrganizationMetrics = async (organizationId: number): Promise<TOrganisationMetrics> => {
  try {
    const response = await axios.get(`/statistics${endPoint}/${organizationId}/metrics`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

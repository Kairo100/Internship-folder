import { formatDate } from 'src/utils/date'
import axios from './apiConfig'
import { TCreatProjectAccount, TCreatProjectCommittee , TCreatProjectTransaction} from 'src/types/projects'


//  IDocument type here or import it from the component
interface IDocument {
  document_id: number;
  project_id: number;
  fileName: string;
  fileType: string;
  url: string;
  description?: string | null;
  uploadDate: string; // ISO string
}

const endPoint = '/projects'

//** Projects */
// export const fetchProjects = async ({ isMiniView = false }: { isMiniView?: boolean | undefined }) => {
export const fetchProjects = async (data: any) => {
  const { skip, take, search, statusFilter, categoryFilter, country_region, dateFrom, dateTo  } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter
  if (country_region) params.region = country_region;//added this 
  if (dateFrom) params.dateFrom = dateFrom; // Added this
  if (dateTo) params.dateTo = dateTo; // Added this

  try {
    const response = await axios.get(`${endPoint}/`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    // throw typeof error !== 'string' ? error.data.message : error
    throw error
  }
}

export const getProject = async (id: number) => {
  try {
    const response = await axios.get(`${endPoint}/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const addProject = async (data: any) => {
  // const body = {
  //   ...data,
  //   video: data?.video_url,
  //   start_date: data?.startDate,
  //   end_date: data?.endDate,

  //   category: 'Water',
  //   entity_id: 2,
  //   organisation_id: 5
  // }

  // delete body.video_url
  // delete body.startDate
  // delete body.endDate

  try {
    const response = await axios.post(`${endPoint}`, data)
    return response.data.payload
  } catch (error: any) {
    throw error
  }
}

export const updateProject = async (id: number, updatedData: any) => {
  const body = {
    ...updatedData,
    start_date: new Date(updatedData?.start_date).toISOString(),
    end_date: new Date(updatedData?.end_date).toISOString()
  }

  try {
    const response = await axios.put(`${endPoint}/${id}`, body)
    return response.data.payload
  } catch (error) {
    throw error
  }
}

export const deleteProject = async (id: number) => {
  try {
    const response = await axios.delete(`${endPoint}/${id}`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Project Helpers
export const getProjectHelpers = async () => {
  try {
    const response = await axios.get(`${endPoint}/getProjectHelpers`)
    return response.data
  } catch (error: any) {
    throw error
  }
}

// Project Updates
export const fetchUpdates = async (data: any) => {
  const { skip, take, search, statusFilter, categoryFilter, dateFrom, dateTo } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.statusFilter = statusFilter
  if (dateFrom) params.dateFrom = dateFrom
  if (dateTo) params.dateTo = dateTo

  try {
    const response = await axios.get(`${endPoint}/fetchUpdates`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    // throw typeof error !== 'string' ? error.data.message : error
    throw error
  }
}

export const approveUpdate = async (update_id: number, project_id: number, approved: boolean) => {
  try {
    const response = await axios.put(`${endPoint}/approveProjectUpdate`, {
      update_id,
      project_id,
      approved
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteUpdate = async (update_id: number) => {
  try {
    const response = await axios.delete(`${endPoint}/updates/${update_id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

//** Status */
const statusEndpoint = 'update-status'
export const updateProjectStatus = async (id: number, status: string) => {
  try {
    const response = await axios.put(`${endPoint}/${id}/${statusEndpoint}`, { status })
    return response.data
  } catch (error) {
    throw error
  }
}

//** Story */
const storyEndpoint = 'update-story'
export const updateProjectStory = async (id: number, story: string) => {
  try {
    const response = await axios.put(`${endPoint}/${id}/${storyEndpoint}`, { story })
    return response.data
  } catch (error) {
    throw error
  }
}

//** Accounts */
const accountsEndpoint = 'accounts'
export const fetchProjectAccounts = async (id: number, data: any) => {
  const { skip, take, search, statusFilter, categoryFilter } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter

  try {
    const response = await axios.get(`${endPoint}/${id}/${accountsEndpoint}`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

export const addProjectAccount = async (id: number, data: TCreatProjectAccount) => {
  try {
    const response = await axios.post(`${endPoint}/${id}/${accountsEndpoint}`, data)
    return response.data
  } catch (error: any) {
    throw error
  }
}

//** Committee */
const committeesEndpoint = 'committees'
export const fetchProjectCommittees = async (id: number, data: any) => {
  const { skip, take, search, statusFilter, categoryFilter } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter

  try {
    const response = await axios.get(`${endPoint}/${id}/${committeesEndpoint}`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

export const addProjectCommittee = async (id: number, data: TCreatProjectCommittee) => {
  try {
    const response = await axios.post(`${endPoint}/${id}/${committeesEndpoint}`, data)
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const updateProjectCommittee = async (id: number, committeeId: number, updatedData: any) => {
  try {
    const response = await axios.put(`${endPoint}/${id}/${committeesEndpoint}/${committeeId}`, updatedData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ** Files/Images *
const imagesEndpoint = 'upload-files'
export const uploadFiles = async (id: number, formData: FormData) => {
  try {
    const response = await axios.post(`${endPoint}/${id}/${imagesEndpoint}`, formData)
    return response.data
  } catch (error) {
    throw error
  }
}

//** Transactions */
const transactionsEndpoint = 'transactions'
export const fetchProjectTransactions = async (id: number, data: any) => {
  const { skip, take, search, statusFilter, categoryFilter } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter

  try {
    const response = await axios.get(`${endPoint}/${id}/${transactionsEndpoint}`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}

const inkindDonationsEndpoint = 'in-kind-donations'
export const fetchInkindDonations = async (id: number, data: any) => {
  const { skip, take, search, statusFilter, categoryFilter } = data
  let params: any = {
    skip: skip,
    take: take
  }

  if (search) params.search = search
  if (categoryFilter) params.category = categoryFilter
  if (statusFilter) params.status = statusFilter

  try {
    const response = await axios.get(`${endPoint}/${id}/${inkindDonationsEndpoint}`, {
      params: params
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}



// --- NEW DOCUMENT API CALLS ---
const documentsEndpoint = 'documents'

// Fetch Project Documents
export const fetchProjectDocuments = async (projectId: number): Promise<IDocument[]> => {
  try {
    const response = await axios.get(`${endPoint}/${projectId}/${documentsEndpoint}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Upload Project Document
export const uploadProjectDocument = async (projectId: number, formData: FormData) => {
  try {
    const response = await axios.post(`${endPoint}/${projectId}/${documentsEndpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Crucial for file uploads
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Delete Project Document
export const deleteProjectDocument = async (projectId: number, documentId: number) => {
  try {
    const response = await axios.delete(`${endPoint}/${projectId}/${documentsEndpoint}/${documentId}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};





// New:-  addProjectTransaction 
export const addProjectTransaction = async (projectId: number, data: TCreatProjectTransaction) => { // <-- IMPORTANT: Added TCreatProjectTransaction type for 'data'
  try {
    const response = await axios.post(`${endPoint}/${projectId}/${transactionsEndpoint}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to add transaction. Please try again.';
  }
};
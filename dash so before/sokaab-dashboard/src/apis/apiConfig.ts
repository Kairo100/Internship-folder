import axios, { AxiosError } from 'axios'
import authConfig from 'src/configs/auth'

// Axios instance creation with interceptors
const axiosInstance = axios.create({
  baseURL: process.env.API_URL || ''
})

const excludedEndpoints = ['/auth/login']
// Interceptor to handle response
axiosInstance.interceptors.request.use(
  (config: any) => {
    // Check if the request URL is in the excludedEndpoints array
    if (!excludedEndpoints.some(endpoint => config.url.includes(endpoint))) {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor to handle response
axiosInstance.interceptors.response.use(
  response => response,
  // (error: AxiosError) => {
  (error: any) => {
    let sendingError = null
    if (error.response) {
      // This request reached the server and responsed with the error
      sendingError = error.response
      sendingError = sendingError?.data?.message
    } else if (error.request) {
      // This request did not reach the server... Netwok error
      sendingError = error.message
      // } else sendingError = "error.message"
    } else sendingError = 'Internal Server Error'

    return Promise.reject(sendingError)
  }
)

export default axiosInstance

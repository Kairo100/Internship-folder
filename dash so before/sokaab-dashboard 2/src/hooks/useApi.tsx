import { useState } from 'react'

type ApiFunction = () => Promise<any>

interface ApiHook {
  isLoading: boolean
  // error: string | null
  error: any
  data: any // Change the type according to the expected data structure
  apiCall: (apiFunction: any) => Promise<any>
  clearStates: () => void
}

const useApi = (): ApiHook => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const apiCall = async (apiFunction: ApiFunction): Promise<any> => {
    setError(null)
    setIsLoading(true)

    // console.log('-----  Api hook started ------')
    try {
      const response = await apiFunction
      // console.log('***** Api hook response:', response)
      setData(response)
    } catch (error: any) {
      // console.log('^^^^^^ Api hook error:', error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearStates = () => {
    setError(null)
    setData(null)
  }

  return {
    isLoading,
    error,
    data,
    apiCall,
    clearStates
  }
}

export default useApi

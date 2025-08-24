import { useState } from "react";

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const apiCall = async (apiFunction) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFunction;
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearStates = () => {
    setError(null);
    setData(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    data,
    apiCall,
    clearStates,
  };
};

export default useApi;

import { useState, useEffect } from 'react';
import { fetchProjects } from 'src/apis/projects';

interface IProject {
  project_id: number;
  title: string;
  status: string;
  category: string;
  // Use the correct field names as per your backend
  latitude: number | string | null | undefined; 
  longitude: number | string | null | undefined;
  image_url?: string;
}

interface ICleanedProject {
  project_id: number;
  title: string;
  status: string;
  category: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

interface IProjectsResponse {
  data: IProject[];
  count: number;
}

const PAGE_SIZE = 50; 

const useAllProjectsApi = () => {
  const [allProjects, setAllProjects] = useState<ICleanedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      let currentPage = 0;
      let allProjectsAccumulated: IProject[] = [];
      let totalProjects = -1;

      try {
        setIsLoading(true);
        while (totalProjects === -1 || allProjectsAccumulated.length < totalProjects) {
          const response: IProjectsResponse = await fetchProjects({ 
            skip: currentPage * PAGE_SIZE, 
            take: PAGE_SIZE 
          });

          if (response && response.data) {
            allProjectsAccumulated = [...allProjectsAccumulated, ...response.data];
            totalProjects = response.count;
            currentPage++;
            
            if (response.data.length < PAGE_SIZE) {
                break;
            }
          } else {
            throw new Error('Invalid API response format.');
          }
        }
        
        const validProjects = allProjectsAccumulated
          .filter(p => p.latitude !== undefined && p.latitude !== null && p.longitude !== undefined && p.longitude !== null)
          .map(p => {
            const lat = parseFloat(String(p.latitude));
            const lng = parseFloat(String(p.longitude));
            
            return {
              ...p,
              latitude: lat,
              longitude: lng
            };
          })
          .filter(p => !isNaN(p.latitude) && !isNaN(p.longitude)) as ICleanedProject[];

        setAllProjects(validProjects);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch all projects:", err);
        setError(err);
        setAllProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return {
    projects: allProjects,
    isLoading: isLoading,
    error: error,
  };
};

export default useAllProjectsApi;
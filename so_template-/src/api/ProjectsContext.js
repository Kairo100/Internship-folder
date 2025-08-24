import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [causesData, setCausesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [causesPerPage] = useState(9);
  const [totalCount, setTotalCount] = useState([]);
  const [projectsData, setProjectsData] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [DataSta, setDataSta] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const [galleryData, setGalleryData] = useState([]);

  const location = useLocation();
  const isPage = location.pathname === "/";
  const isPageAbout = location.pathname === "/about";

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    status: "",
    // country_region:  ["Republic of Somaliland", "Puntland", "Galmudug", "Hirshabelle", "Jubaland", "South West State"],
    country_region:  "",
    
    search: "",
    year: "",
    month: "",
  });

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/projects") {
      setFilters({
        category: "",
        status: "",
        // country_region: "Republic of Somaliland",
        country_region: "",
  
        search: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isPageAbout) return;
    setLoading(true);

    const queryParams = new URLSearchParams({
      skip: currentPage,
      take: causesPerPage,
    });

    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.country_region)
      queryParams.append("region", filters.country_region);
//     if (filters.country_region && filters.country_region.length > 0) {
//   filters.country_region.forEach(region => {
//     queryParams.append("region", region);
//   });
// }
    if (filters.search) queryParams.append("search", filters.search);
    // if (filters.start_date) queryParams.append("start_date", filters.start_date);
    // if (filters.end_date) queryParams.append("end_date", filters.end_date);
    if (filters.date) queryParams.append("date", filters.date); // ADD THIS

    axios
      .get(
        `https://api.caprover.sokaab.com/api/public/projects?${queryParams.toString()}`
        // `http://localhost:3000/api/public/projects?${queryParams.toString()}`
      )
      .then((response) => {
        if (Array.isArray(response.data.list)) {
          setCausesData(response.data.list);
          setTotalCount(response.data.counts);
          setLoading(false);
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
        console.timeEnd("API Request");
      })
      .catch((error) => {
        console.error("Error fetching causes:", error);
        console.timeEnd("API Request");
      });
  }, [currentPage, causesPerPage, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // const [randomProject, setRandomProject] = useState(null);
  // useEffect(() => {
  //   if (causesData.length && !randomProject) {
  //     const randomProject = causesData[Math.floor(Math.random() * causesData.length)];
  //     setRandomProject(randomProject);
  //   }
  // }, [causesData]);

  // const [randomProject, setRandomProject] = useState(null);
  // useEffect(() => {
  //   if (causesData.length) {
  //     const now = new Date();

  //     // First, try to find active projects that haven't reached their overall goal yet
  //     const activeProjectsNeedingFunds = causesData.filter(project => {
  //       const endDate = new Date(project.end_date);
  //       const isProjectActive = endDate > now;

  //       const fundraised = project.fundraised || 0;
  //       const communityGoal = project.funding_goal || project.goal || 0;
  //       const availableMatchingGrant = project.available_grant || 0;

  //       const totalProjectValue = communityGoal + availableMatchingGrant;
  //       const hasReachedOverallGoal = fundraised >= totalProjectValue;

  //       return isProjectActive && !hasReachedOverallGoal;
  //     });

  //     // If there are projects needing funds, pick one randomly from them
  //     if (activeProjectsNeedingFunds.length > 0) {
  //       const randomIndex = Math.floor(Math.random() * activeProjectsNeedingFunds.length);
  //       setRandomProject(activeProjectsNeedingFunds[randomIndex]);
  //     } else {
  //       // If no projects needing funds, fall back to any active project
  //       const anyActiveProjects = causesData.filter(project => {
  //         const endDate = new Date(project.end_date);
  //         return endDate > now; // Project is active if end_date is in the future
  //       });

  //       if (anyActiveProjects.length > 0) {
  //         const randomIndex = Math.floor(Math.random() * anyActiveProjects.length);
  //         setRandomProject(anyActiveProjects[randomIndex]);
  //       } else {
  //         // If no active projects at all, set randomProject to null
  //         setRandomProject(null);
  //       }
  //     }
  //   }
  // }, [causesData]);
  const [randomProject, setRandomProject] = useState(null);
  useEffect(() => {
    // Fetch all projects (or a very large number) once for random selection
    // This ensures it's not affected by current pagination/filters for `causesData`
    axios
      .get(`https://api.caprover.sokaab.com/api/public/projects?skip=0&take=50`) // Adjust 'take' if you have many more projects
      .then((response) => {
        if (Array.isArray(response.data.list)) {
          const allProjects = response.data.list;
          const now = new Date();

          // 1. Try to find active projects that haven't reached their overall goal yet
          const activeProjectsNeedingFunds = allProjects.filter((project) => {
            const endDate = new Date(project.end_date);
            const isProjectActive = endDate > now;

            const fundraised = project.fundraised || 0;
            const communityGoal = project.funding_goal || project.goal || 0;
            const availableMatchingGrant = project.available_grant || 0;

            const totalProjectValue = communityGoal + availableMatchingGrant;
            const hasReachedOverallGoal = fundraised >= totalProjectValue;

            return isProjectActive && !hasReachedOverallGoal;
          });

          if (activeProjectsNeedingFunds.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * activeProjectsNeedingFunds.length
            );
            setRandomProject(activeProjectsNeedingFunds[randomIndex]);
          } else {
            // 2. If no projects needing funds, fall back to any active project
            const anyActiveProjects = allProjects.filter((project) => {
              const endDate = new Date(project.end_date);
              return endDate > now; // Project is active if end_date is in the future
            });

            if (anyActiveProjects.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * anyActiveProjects.length
              );
              setRandomProject(anyActiveProjects[randomIndex]);
            } else {
              // 3. If no active projects at all, set randomCtaProject to null
              setRandomProject(null);
            }
          }
        } else {
          console.error(
            "Unexpected API response structure for random CTA project:",
            response.data
          );
          setRandomProject(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects for random CTA:", error);
        setRandomProject(null);
      });
  }, []); // **Empty dependency array** ensures this runs only once on mount.
  const handleClickProjects = (projectId) => {
    if (projectsData[projectId]) {
      setLoading(false);
      return;
    }
    setLoading(true);
    if (!projectsData[projectId]) {
      if (isPageAbout) return;
      axios
        .get(`https://api.caprover.sokaab.com/api/public/projects/${projectId}`)
        .then((response) => {
          setProjectsData((prevState) => ({
            ...prevState,
            [projectId]: {
              communityName: response.data.community_name,
              organizationDetails: response.data,
            },
          }));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
        });
    }
  };

  useEffect(() => {
    axios
      .get("https://api.caprover.sokaab.com/api/statistics/dashboard")
      .then((response) => {
        setDataSta(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const match = location.pathname.match(/^\/projects\/(\d+)/);
  const id = match ? match[1] : null;
  const isProjectDetails = location.pathname === `/projects/${id}`;

  useEffect(() => {
    if (!isProjectDetails) return;
    axios
      .get(`https://api.caprover.sokaab.com/api/public/projects/${id}`)
      .then((response) => {
        setProjectDetails(response.data);
      })
      .catch((error) => {
        console.error("The error:", error);
      });
  }, [id]);

  useEffect(() => {
    console.time("API Request");

    if (!isPageAbout) return;
    setLoading(true);
    axios
      .get(`https://api.caprover.sokaab.com/api/public/projects?skip=0&take=30`)
      .then((response) => {
        if (Array.isArray(response.data.list)) {
          let projects = response.data.list;
          projects.sort((a, b) => {
            const fundA = a.available_grant || 0;
            const fundB = b.available_grant || 0;
            return fundB - fundA;
          });
          const top6Projects = projects.slice(0, 6);
          setGalleryData(top6Projects);
          setLoading(false);
          // setGalleryData(response.data.list);
          // setLoading(false)
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching causes:", error);
      });
  }, [isPageAbout]);

  return (
    <ProjectContext.Provider
      value={{
        causesData,
        totalCount,
        currentPage,
        setCurrentPage,
        causesPerPage,
        projectsData,
        selectedId,
        setSelectedId,
        DataSta,
        projectDetails,
        setProjectDetails,
        handleClickProjects,
        galleryData,
        loading,
        filters,
        setFilters,
        randomProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);

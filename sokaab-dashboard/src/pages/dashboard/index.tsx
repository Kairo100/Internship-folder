import { useEffect, useState } from 'react'
import { Grid, Card, CardHeader, CardContent, Typography, styled, CircularProgress, Box , useTheme, Divider, FormControl, InputLabel, Select, MenuItem, Button} from '@mui/material'
import toast from 'react-hot-toast'

import { getDashboardStatistics } from 'src/apis/statistics'
import useApi from 'src/hooks/useApi'
//added these
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'


//Added these imports
// DataGrid components for the table
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns' // For formatting dates in the table

// Chart components from @mui/x-charts
// IMPORTANT: Ensure these types are imported for proper type checking
import {  PieChart, PieSeriesType, LineChart } from '@mui/x-charts'
import { IProject } from 'src/types/projects' // Assuming this interface is available
import { TOrganisation } from 'src/types/organisations' // Assuming this interface is available
import { fetchProjects } from 'src/apis/projects' // Added import for fetching projects
import { fetchOrganisations } from 'src/apis/organisations' // Added import for fetching organizations
import { useRouter } from 'next/router';
import { projectsDetailsExport } from 'src/utils/projectsDetailsExport';

// const StyledTypography = styled(Typography)(({ theme }) => ({
//   textDecoration: 'none',
//   color: `${theme.palette.primary.main} !important`,
  
// }))

//added this interface
// Define the structure for an organization row in the table
interface OrganizationRow {
  id: number;
  name: string;
  projectCount: number;
}

const Dashboard = () => {
  //added thes
   const theme = useTheme()
   const router = useRouter();
   // ADD THIS NEW STATE to store the pie chart data for categories
  const [categoryPieChartData, setCategoryPieChartData] = useState<PieSeriesType['data']>([]);
  // Add this new state
const [projectsOverTimeData, setProjectsOverTimeData] = useState<{
  dates: Date[];
  projectCounts: number[];
}>({
  dates: [],
  projectCounts: [],
});
// Add these new states at the top with your other state variables
const [selectedYear, setSelectedYear] = useState<string>('All');
const [selectedMonth, setSelectedMonth] = useState<string>('All');

// State to store available years and months for the dropdowns
const [availableYears, setAvailableYears] = useState<string[]>([]);
const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  // ** Hooks
  const {
    isLoading: getDashboardStatisticsLoadingApi,
    error: getDashboardStatisticsErrorApi,
    data: getDashboardStatisticsApiData,
    apiCall: getDashboardStatisticsApicall,
    clearStates: getDashboardStatisticsClearStates
  } = useApi()
  //added these two const for projct and organiztions and use states
  const {
    isLoading: fetchProjectsLoadingApi,
    error: fetchProjectsErrorApi,
    data: projectsApiData,
    apiCall: fetchProjectsApiCall,
    clearStates: fetchProjectsClearStates
  } = useApi()

  const {
    isLoading: fetchOrganisationsLoadingApi,
    error: fetchOrganisationsErrorApi,
    data: organisationsApiData,
    apiCall: fetchOrganisationsApiCall,
    clearStates: fetchOrganisationsClearStates
  } = useApi()

  // State for the active projects table data
  const [activeProjectsData, setActiveProjectsData] = useState<IProject[]>([]);
  // State for the top organizations table data
  const [topOrganizationsData, setTopOrganizationsData] = useState<OrganizationRow[]>([]);
  // Calling Api
  useEffect(() => {
    const fetchData = async () => {
      await getDashboardStatisticsApicall(getDashboardStatistics())
       // Fetch all projects (assuming fetchProjects can get all without pagination for this dashboard view)
      await fetchProjectsApiCall(fetchProjects({ skip: 1, take: 99999 })) // Attempt to fetch a large number

      // Fetch all organizations
      await fetchOrganisationsApiCall(fetchOrganisations({ skip: 1, take: 99999 })) // Attempt to fetch a large number
    }
    fetchData()
  }, [])

  //added these below two effects for org and pro
   // Process projects data once it's available
  // useEffect(() => {
    // if (projectsApiData && projectsApiData.data) {
    //   const today = new Date();
    //   // Filter projects that are 'Live' and whose end_date is in the future
    //   const filteredActiveProjects = projectsApiData.data.filter((project: IProject) =>
    //     project.status === 'Live' &&
    //     new Date(project.end_date).getTime() > today.getTime()
    //   );
    //   setActiveProjectsData(filteredActiveProjects);
  //   }
  // }, [projectsApiData]);
 // Define a fixed color map for your categories
const categoryColors: { [key: string]: string } = {
  'AGRICULTURE': '#1f77b4',
  'COMMUNITY BUILDING': '#ff7f0e',
  'EDUCATION': '#2ca02c',
  'FOOD': '#d62728',
  'HEALTH': '#9467bd',
  'HUMAN RIGHTS': '#8c564b',
  'ICT': '#e377c2',
  'MEDIA & JOURNALISM': '#7f7f7f',
  'WATER': '#bcbd22',
  'HEALTH AND ENVIRONMENTAL SECURITY': '#000000',
  'COMMUNITY STABILIZATION': '#800d56ff',
};

useEffect(() => {
  if (projectsApiData && projectsApiData.data) {

      const today = new Date();
      // Filter projects that are 'Live' and whose end_date is in the future
      const filteredActiveProjects = projectsApiData.data.filter((project: IProject) =>
        project.status === 'Live' &&
        new Date(project.end_date).getTime() > today.getTime()
      );
      setActiveProjectsData(filteredActiveProjects);
    const categoryCounts: { [key: string]: number } = {};

    projectsApiData.data.forEach((project: IProject) => {
      if (project.category) {
        // Step 1: Normalize the category string by trimming whitespace and converting to uppercase
        const normalizedCategory = project.category.trim().toUpperCase();

        // Step 2: Use the normalized string to handle inconsistent data
        let standardizedCategory = normalizedCategory;
        if (standardizedCategory.startsWith('COMUNITY BUIL')) {
          standardizedCategory = 'COMMUNITY BUILDING';
        }

        // Step 3: Use the standardized name to count the projects
        categoryCounts[standardizedCategory] = (categoryCounts[standardizedCategory] || 0) + 1;
      }
    });

    // Step 4: Map the counts for the chart data
    const newPieChartData: PieSeriesType['data'] = Object.keys(categoryCounts).map((category, index) => ({
      id: index,
      value: categoryCounts[category],
      // Use the original category name from the data to display the label
      label: `${category} (${categoryCounts[category]})`,
      // Step 5: Look up the color using the standardized, uppercase key
      color: categoryColors[category] || '#000000',
    }));

    setCategoryPieChartData(newPieChartData);
  }
}, [projectsApiData]);
// useEffect(() => {
//   if (projectsApiData && projectsApiData.data) {
//     const today = new Date();
//     const filteredActiveProjects = projectsApiData.data.filter((project: IProject) =>
//       project.status === 'Live' &&
//       new Date(project.end_date).getTime() > today.getTime()
//     );
//     setActiveProjectsData(filteredActiveProjects);

//     // New logic to count projects by category
//     const categoryCounts: { [key: string]: number } = {};
//     projectsApiData.data.forEach((project: IProject) => {
//       if (project.category_name) {
//         categoryCounts[project.category_name] = (categoryCounts[project.category_name] || 0) + 1;
//       }
//     });

//     // Map the counts into the required format for the PieChart
//     const newPieChartData: PieSeriesType['data'] = Object.keys(categoryCounts).map((category, index) => ({
//       id: index,
//       value: categoryCounts[category],
//       label: `${category} (${categoryCounts[category]})`,
//       // Optional: Add a dynamic color generator
//       color: getRandomColor(),
//     }));
//     setCategoryPieChartData(newPieChartData);
//   }
// }, [projectsApiData]);


  // Process organizations data once it's available and calculate project counts
  // useEffect(() => {
  //   if (organisationsApiData && organisationsApiData.data && projectsApiData && projectsApiData.data) {
  //     const organizations: TOrganisation[] = organisationsApiData.data;
  //     const projects: IProject[] = projectsApiData.data;

  //     const organizationProjectCounts: { [key: string]: number } = {};

  //     // Calculate project counts by iterating through the fetched projects
  //     projects.forEach(project => {
  //       // Ensure project.organization_name is defined before using it as a key
  //       if (project.organization_name) {
  //         organizationProjectCounts[project.organization_name] = (organizationProjectCounts[project.organization_name] || 0) + 1;
  //       }
  //     });

  //     // Map calculated counts back to organization data and prepare for table
  //     const organizationsArray: OrganizationRow[] = organizations
  //       .map(org => ({
  //         id: org.organisation_id, // Use actual organisation_id for uniqueness
  //         name: org.organisation_name || 'Unnamed Organization', // Fallback for name
  //         projectCount: organizationProjectCounts[org.organisation_name || ''] || 0 // Get calculated count
  //       }))
  //       .sort((a, b) => b.projectCount - a.projectCount) // Sort descending by project count
  //       .slice(0, 5); // Take top 3 organizations

  //     setTopOrganizationsData(organizationsArray);
  //   }
  // }, [organisationsApiData, projectsApiData]); // Depend on both as projects data is needed for calculation

//line chart data
useEffect(() => {
  if (projectsApiData && projectsApiData.data) {
    const projects = projectsApiData.data as IProject[];
    
    // Get unique years and months from the data for the dropdowns
    const allYears = [...new Set(projects.map(p => new Date(p.start_date).getFullYear().toString()))];
    const fiveYearsAgo = new Date().getFullYear() - 5;
    const recentYears = allYears.filter(year => parseInt(year) >= fiveYearsAgo).sort();
    
    setAvailableYears(recentYears);

    // If a specific year is selected, populate the months
    if (selectedYear !== 'All') {
      const projectsInSelectedYear = projects.filter(p => new Date(p.start_date).getFullYear().toString() === selectedYear);
      const allMonths = [...new Set(projectsInSelectedYear.map(p => new Date(p.start_date).getMonth().toString()))];
      setAvailableMonths(allMonths);
    } else {
      setAvailableMonths([]);
    }

    // Filter projects based on selectedYear and selectedMonth
    const filteredProjects = projects.filter(project => {
      const projectYear = new Date(project.start_date).getFullYear().toString();
      const projectMonth = new Date(project.start_date).getMonth().toString();
      
      const isYearMatch = selectedYear === 'All' || projectYear === selectedYear;
      const isMonthMatch = selectedMonth === 'All' || projectMonth === selectedMonth;
      
      return isYearMatch && isMonthMatch;
    });

    const projectsByTime: { [key: string]: number } = {};
    filteredProjects.forEach(project => {
      const date = new Date(project.start_date);
      const key = selectedYear !== 'All' 
        ? `${date.getMonth()}` // Key is just the month if a year is selected
        : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`; // Key is year-month if all years
      
      projectsByTime[key] = (projectsByTime[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(projectsByTime).sort();
    const dates = sortedKeys.map(key => {
      if (selectedYear !== 'All') {
        return new Date(parseInt(selectedYear), parseInt(key));
      } else {
        const [year, month] = key.split('-');
        return new Date(parseInt(year), parseInt(month));
      }
    });

    const projectCounts = sortedKeys.map(key => projectsByTime[key]);

    setProjectsOverTimeData({ dates, projectCounts });
  }
}, [projectsApiData, selectedYear, selectedMonth]);
useEffect(() => {
  if (projectsApiData && projectsApiData.data && organisationsApiData && organisationsApiData.data) {
    // Assert that the fetched projects data conforms to the expected structure
    const projects = projectsApiData.data as (IProject & { category_name: string; organization_name: string; })[];
    const organizations = organisationsApiData.data as TOrganisation[];

    const organizationProjectCounts: { [key: string]: number } = {};

    projects.forEach(project => {
      if (project.organization_name) {
        organizationProjectCounts[project.organization_name] = (organizationProjectCounts[project.organization_name] || 0) + 1;
      }
    });

    const organizationsArray = organizations
      .map(org => ({
        id: org.organisation_id,
        name: org.organisation_name || 'Unnamed Organization',
        projectCount: organizationProjectCounts[org.organisation_name || ''] || 0
      }))
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 5);

    setTopOrganizationsData(organizationsArray);
  }
}, [organisationsApiData, projectsApiData]);
// ...
  // Api Success Handling
  useEffect(() => {}, [getDashboardStatisticsApiData])

  // Api Error handling
  useEffect(() => {
    if (getDashboardStatisticsErrorApi)
      toast.error(getDashboardStatisticsErrorApi, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (getDashboardStatisticsErrorApi) getDashboardStatisticsClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [getDashboardStatisticsErrorApi])

  
  // DataGrid columns for the Active Projects Table
  const activeProjectsColumns: GridColDef[] = [
    // { field: 'project_id', headerName: 'ID', flex: 0.5, minWidth: 50 },
    { field: 'title', headerName: 'Project Title', flex: 1.5, minWidth: 200 },
    // {
    //   field: 'organization_name', // Assuming IProject has organization_name
    //   headerName: 'Organization',
    //   flex: 1,
    //   minWidth: 150,
    //   valueGetter: (params) => params.row.organization_name || 'N/A', // Handle potentially missing organization name
    // },
    // {
    //   field: 'start_date',
    //   headerName: 'Start Date',
    //   flex: 1,
    //   minWidth: 120,
    //   renderCell: ({ row }) => format(new Date(row.start_date), 'MMM dd, yyyy')
    // },
    {
      field: 'end_date',
      headerName: 'End Date',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => format(new Date(row.end_date), 'MMM dd, yyyy')
    },
    {
      field: 'funding_goal',
      headerName: 'Funding Goal',
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => `$${(value || 0).toLocaleString()}`
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 100,
      renderCell: ({ value }) => (
        <CustomAvatar skin='light' color={value === 'Live' ? 'success' : 'primary'}>
          {value}
        </CustomAvatar>
      )
    },
  ];

  // DataGrid columns for the Top Organizations Table
  const topOrganizationsColumns: GridColDef[] = [
    // { field: 'id', headerName: 'Rank', flex: 0.5, minWidth: 50 },
    { field: 'name', headerName: 'Organization Name', flex: 1.5, minWidth: 200 },
  ];

  // This is the new function to handle the dashboard export
const handleDashboardExport = () => {
  // Step 1: Prepare the summary statistics data
  const summaryData = [
    {
      'Metric': 'TOTAL PROJECTS',
      'Value': getDashboardStatisticsApiData?.totalProjects?.toLocaleString() || '0'
    },
    {
      'Metric': 'TOTAL BACKERS',
      'Value': getDashboardStatisticsApiData?.backers?.toLocaleString() || '0'
    },
    {
      'Metric': 'TOTAL FUNDS RAISED',
      'Value': `$${Math.floor(getDashboardStatisticsApiData?.fundRaised || 0).toLocaleString()}`
    },
    {
      'Metric': 'TOTAL MATCHING FUNDS',
      'Value': `$${Math.floor(getDashboardStatisticsApiData?.matchingFunds || 0).toLocaleString()}`
    },
    {
      'Metric': 'TOTAL PROJECT VALUES',
      'Value': `$${Math.floor(getDashboardStatisticsApiData?.projectValues || 0).toLocaleString()}`
    },
    {
      'Metric': 'TOTAL FUNDING GOAL',
      'Value': `$${Math.floor(getDashboardStatisticsApiData?.fundingGoals || 0).toLocaleString()}`
    },
    {
      'Metric': 'TOTAL EXPENDITURE',
      'Value': `$${Math.floor(getDashboardStatisticsApiData?.expenditure || 0).toLocaleString()}`
    },
    {
      'Metric': 'TOTAL ACTIVE PROJECTS',
      'Value': getDashboardStatisticsApiData?.activeProjects?.toLocaleString() || '0'
    },
    {
      'Metric': 'TOTAL PENDING PROJECTS',
      'Value': getDashboardStatisticsApiData?.pendingProjects?.toLocaleString() || '0'
    }
  ];

  // Step 2: Prepare the data for the Projects by Category pie chart
  const categoriesData = (categoryPieChartData as Array<{ label: string; value: number }>).map(item => ({
  'Category': item.label.split(' ')[0],
  'Project Count': item.value,
}));

  // Step 3: Prepare the data for the Projects Over Time line chart
  const projectsOverTime = projectsOverTimeData.dates.map((date, index) => ({
    'Date': format(date, 'yyyy-MM-dd'),
    'Project Count': projectsOverTimeData.projectCounts[index],
  }));

  // Step 4: Call your export utility with the prepared data for each sheet
  projectsDetailsExport(
    [
      { sheetName: 'Summary Statistics', data: summaryData },
      { sheetName: 'Projects by Category', data: categoriesData },
      { sheetName: 'Projects Over Time', data: projectsOverTime },
      // You can add more sheets for other charts or data tables here
    ],
    `Dashboard_Statistics_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`
  );

  toast.success("Dashboard statistics exported successfully!");
};

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>

        {/* <CardHeader title=' summary' /> */}
        {getDashboardStatisticsLoadingApi && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10rem' }}>
            <CircularProgress />
          </div>
        )}

        {getDashboardStatisticsApiData && !getDashboardStatisticsLoadingApi && (
          // <Grid container spacing={6}>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL PROJECT VALUES' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {String(parseFloat(getDashboardStatisticsApiData?.projectValues.toFixed(2))).toLocaleString() || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL MATCHING FUNDS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           ${String(getDashboardStatisticsApiData?.matchingFunds.toFixed(2)).toLocaleString() || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL FUNDING GOAL' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           ${parseFloat(getDashboardStatisticsApiData?.fundingGoals.toFixed(2)) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>

          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL FUNDS RAISED' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           ${parseFloat(getDashboardStatisticsApiData?.fundRaised.toFixed(2)) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL BACKERS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {parseFloat(getDashboardStatisticsApiData?.backers.toFixed(2)) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL EXPENDITURE' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           ${parseFloat(getDashboardStatisticsApiData?.expenditure.toFixed(2)) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>

          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL ACTIVE PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {parseFloat(getDashboardStatisticsApiData?.activeProjects) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL PENDING PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {parseFloat(getDashboardStatisticsApiData?.pendingProjects) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL IN-ACTIVE PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {parseFloat(getDashboardStatisticsApiData?.inactiveProjects) || 0}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          // </Grid>


          //commented this
          // <Grid container spacing={6}>
          //   <Grid item xs={12} sm={6}>
          //     <Card>
          //       <CardHeader title='TOTAL PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {getDashboardStatisticsApiData?.totalProjects
          //             ? getDashboardStatisticsApiData.totalProjects.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={6}>
          //     <Card>
          //       <CardHeader title='TOTAL BACKERS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {getDashboardStatisticsApiData?.backers
          //             ? getDashboardStatisticsApiData.backers.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   {/* <Grid item xs={12} sm={6}>
          //     <Card>
          //       <CardHeader title='TOTAL PROJECT VALUES' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {getDashboardStatisticsApiData?.projectValues
          //             ? getDashboardStatisticsApiData.projectValues.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid> */}
          //   <Grid item xs={12} sm={6}>
          //     <Card>
          //       <CardHeader title='TOTAL FUNDS RAISED' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           $
          //           {getDashboardStatisticsApiData?.fundRaised
          //             ? getDashboardStatisticsApiData.fundRaised.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   <Grid item xs={12} sm={6}>
          //     <Card>
          //       <CardHeader title='TOTAL MATCHING FUNDS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           $
          //           {getDashboardStatisticsApiData?.matchingFunds
          //             ? getDashboardStatisticsApiData.matchingFunds.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid>
          //   {/* <Grid item xs={12} sm={6}>
          //     <Card>
          //       <CardHeader title='TOTAL FUNDING GOAL' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           $
          //           {getDashboardStatisticsApiData?.fundingGoals
          //             ? getDashboardStatisticsApiData.fundingGoals.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid> */}

          //   {/* <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL EXPENDITURE' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           $
          //           {getDashboardStatisticsApiData?.expenditure
          //             ? getDashboardStatisticsApiData.expenditure.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid> */}
          //   {/* <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL ACTIVE PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {getDashboardStatisticsApiData?.activeProjects
          //             ? getDashboardStatisticsApiData.activeProjects.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid> */}
          //   {/* <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL PENDING PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {getDashboardStatisticsApiData?.pendingProjects
          //             ? getDashboardStatisticsApiData.pendingProjects.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid> */}
          //   {/* <Grid item xs={12} sm={4}>
          //     <Card>
          //       <CardHeader title='TOTAL IN-ACTIVE PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
          //       <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          //         <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          //           {getDashboardStatisticsApiData?.inactiveProjects
          //             ? getDashboardStatisticsApiData.inactiveProjects.toLocaleString()
          //             : '0'}
          //         </Typography>
          //       </CardContent>
          //     </Card>
          //   </Grid> */}
          // </Grid>
          

          //added this new look of Grid
            <Grid container spacing={6}>
         
       <Grid item xs={12} sm={12} md={12}>
              <Card>
  <CardHeader 
    title='Dashboard Overview'
    action={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* New Export Button */}
        <Button
          onClick={handleDashboardExport}
          variant='contained'
          color='primary'
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:download' />
          Export
        </Button>
      </Box>
    }
  />
  
</Card>
              
            </Grid>
     
            {/* Card 1: TOTAL PROJECTS */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography  variant='h4' sx={{ mb: 1, color: 'primary.main' }}>
                      {getDashboardStatisticsApiData?.totalProjects?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      TOTAL PROJECTS
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='primary' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:list-details' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2: TOTAL BACKERS */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography  variant='h4' sx={{ mb: 1 , color: 'info.main' }}>
                      {getDashboardStatisticsApiData?.backers?.toLocaleString() || '0'}
                    </Typography>
                    <Typography   variant='body2' color='text.secondary'>
                      TOTAL BACKERS
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='info' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:users' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: TOTAL FUNDS RAISED */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant='h4' sx={{ mb: 1 , color: 'success.main' }}>
                     {`$${Math.floor(getDashboardStatisticsApiData?.fundRaised || 0).toLocaleString()}`}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      TOTAL FUNDS RAISED
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='success' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:coin' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 4: TOTAL MATCHING FUNDS */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography  variant='h4' sx={{ mb: 1  , color: 'warning.main'}}>
                  {`$${Math.floor(getDashboardStatisticsApiData?.matchingFunds || 0).toLocaleString()}`}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      TOTAL MATCHING FUNDS
                    </Typography>
                  </Box>
                  <CustomAvatar skin='light' color='warning' sx={{ width: 50, height: 50 }}>
                    <Icon icon='tabler:cash' fontSize='1.75rem' />
                  </CustomAvatar>
                </CardContent>
              </Card>
            </Grid>

            {/* added graphs adn tables */}
             {/* --- Graphs Section --- */}

            <Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      {/* Change the title */}
      <Typography variant='h6' sx={{ mb: 2 }}>
        Projects by Category
      </Typography>
 <PieChart
 series={[{
   data: categoryPieChartData,
   highlightScope: { faded: 'global', highlighted: 'item' },
   faded: { innerRadius: 60, additionalRadius: -30, color: 'gray' },
  
 }]}
 itemGap={70}
 height={235}
 sx={{
   width: '100%',
   height: 'auto',
   minHeight: '250px',
   
 }}
 slotProps={{
   legend: {
     direction:'column',
     position: { vertical: 'middle', horizontal: 'right' },
     padding: { left: 30 },
     
     itemMarkHeight: 10,
     itemMarkWidth: 10,
     labelStyle: {
       fontSize: 8, // Smaller font size for labels
     }
   },
   
 }}

/>
    </CardContent>
  </Card>
</Grid>
           

  <Grid item xs={12} md={6}> {/* This is a child item */}
    <Card>
      <CardContent>
        
        <Typography variant='h6' sx={{ mb: 2 }}>
          Projects Growth Over Time
        </Typography>
        
        {/* Dropdowns */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 , justifyContent:'right'}}>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as string)}
              label="Year"
            >
              <MenuItem value="All">All Years</MenuItem>
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
        </Box>
        
        <LineChart
  xAxis={[{
    data: projectsOverTimeData.dates,
    scaleType: 'time',
    valueFormatter: (date) => {
      if (selectedYear === 'All') {
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'long' });
      }
    },
    label: 'Time',
  }]}
  series={[{
    data: projectsOverTimeData.projectCounts,
    label: 'New Projects',
    color: theme.palette.primary.main,
    showMark: false, 
  }]}
  height={172} 
  margin={{ left: 50, right: 30, top: 20, bottom: 40 }}
/>
      </CardContent>
    </Card>
  </Grid>


            {/* --- Tables Section - Grouped to be flexible --- */}
            <Grid item xs={12}> {/* Outer Grid item ensures tables start on a new row below charts */}
              <Grid container spacing={6}> {/* Inner Grid container for flexible table layout */}
                {/* Active Projects Table */}
                <Grid item xs={12} md={9}>
                  <Card>
                    <CardHeader title='Active Projects (Ongoing)' />
                    <Divider />
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={activeProjectsData}
                        getRowId={(row: IProject) => row.project_id} // Use project_id as unique row ID
                        columns={activeProjectsColumns}
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                          },
                          
                          
                        }}
                        //  onRowClick={(params) => {
                        //  router.push(`/projects/${params.row.project_id}/detail`);
                        //     }}

                      />
                    </Box>
                  </Card>
                </Grid>

                {/* Top Organizations by Projects Table */}
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardHeader title='Top 5 Active Organizations' />
                    <Divider />
                    <Box sx={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={topOrganizationsData}
                        getRowId={(row: OrganizationRow) => row.id} // Use the generated ID or actual org ID
                        columns={topOrganizationsColumns}
                        pageSizeOptions={[5]}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                          },
                        }}
                      //   onRowClick={(params) => {
                      //    router.push(`/organisations/${params.row.id}/detail`);
                      //  }}
                        disableRowSelectionOnClick
                        hideFooterPagination
                      />
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>


        )}
      </Grid>
    </Grid>
  )
}

export default Dashboard

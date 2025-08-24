import { useEffect, useState, useCallback } from 'react'
import { Alert, Card, CardContent, Grid, LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

import ProjectLeftSide from 'src/views/pages/projects/details/LeftSide'
import ProjectRightSide from 'src/views/pages/projects/details/RightSide'
import { getProject } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { IProject } from 'src/types/projects'
import { projectsDetailsExport } from 'src/utils/projectsDetailsExport'

type Props = {
  projectData?: IProject
}

const ProjectDetail = ({ projectData: initialProjectData }: Props) => {
  const router = useRouter()
  const { projectId } = router.query

  // Project details API
  const {
    isLoading: getProjectLoadingApi,
    error: getProjectErrorApi,
    data: getProjectApiData,
    apiCall: getProjectApi,
    clearStates: getProjectClearStates
  } = useApi()

  // Transactions API (used only for export)
  const {
    error: transactionsErrorApi,
    data: transactionsApiData,
    apiCall: fetchTransactionsApi,
    clearStates: clearTransactionsStates
  } = useApi()

  const [projectDetails, setProjectDetails] = useState<IProject | null>(initialProjectData || null)

  // Fetch project details
  useEffect(() => {
    if (projectId) {
      getProjectApi(getProject(Number(projectId)))
    }
  }, [projectId])

  // Update state when data arrives
  useEffect(() => {
    if (getProjectApiData) {
       console.log("Project details data:", getProjectApiData) 
      setProjectDetails(getProjectApiData)
    }
  }, [getProjectApiData])

  // Handle project fetch errors (redirect only once)
  useEffect(() => {
    if (getProjectErrorApi) {
      toast.error(getProjectErrorApi, { duration: 2000 })
      getProjectClearStates()

      if (router.pathname !== '/projects') {
        router.replace('/projects')
      }
    }
  }, [getProjectErrorApi, getProjectClearStates, router])

  // Handle transaction fetch errors
  useEffect(() => {
    if (transactionsErrorApi) {
      toast.error('Transaction export failed: ' + transactionsErrorApi, { duration: 2000 })
      clearTransactionsStates()
    }
  }, [transactionsErrorApi, clearTransactionsStates])

  // Export handler
  const handleExport = useCallback(async () => {
    if (!projectDetails || !projectId) {
      toast.error('Project data not loaded yet.')
      return
    }

    const loadingToastId = toast.loading('Preparing data for export...')

    try {
     

      const projectSummary = [
        {
          'Project ID': projectDetails.project_id,
          'Project Name': projectDetails.title,
          'Category': projectDetails.category,
          'Community Name': projectDetails.community_name,
          'End Method': projectDetails.end_method,
          'Start Date': format(new Date(projectDetails.start_date), 'MMMM do yyyy'),
          'End Date': format(new Date(projectDetails.end_date), 'MMMM do yyyy'),
          'Address': projectDetails.location_district,
          'Village': projectDetails.village,
          'Country/Region': projectDetails.country_region,
          'Date Added': format(new Date(projectDetails.date_time_added), 'MMMM do yyyy'),
          'Funding Goal': `$${projectDetails.funding_goal?.toLocaleString() || 0}`,
          'Match Fund': `$${projectDetails.available_grant?.toLocaleString() || 0}`,
          'Current Status': new Date() >= new Date(projectDetails.end_date) ? 'Closed' : 'Active',
          
        }
      ]

    
      projectsDetailsExport(
        [
          { sheetName: 'Project Summary', data: projectSummary },
          
        ],
        `Project_${projectId}_Details.xlsx`
      )

      toast.success('Project details and transactions exported successfully!', { id: loadingToastId })
    } catch (error: any) {
      console.error('Export failed:', error)
      toast.error('Failed to export data: ' + (error.message || 'Unknown error'), { id: loadingToastId })
    }
  }, [projectDetails, projectId, fetchTransactionsApi, transactionsApiData])

  const overallLoading = getProjectLoadingApi
  const overallError = getProjectErrorApi

  return (
    <Grid container spacing={6}>
      {overallError && (
        <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
          {overallError}
        </Alert>
      )}

      {overallLoading && (
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ padding: '0 2rem', marginTop: '3rem', marginBottom: '3rem' }}>
              <LinearProgress />
            </CardContent>
          </Card>
        </Grid>
      )}

      {!overallLoading && projectDetails && (
        <>
          <Grid item xs={12} md={5} lg={4}>
            <ProjectLeftSide projectId={Number(projectId)} projectData={projectDetails} onExport={handleExport} />
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <ProjectRightSide projectId={Number(projectId)} projectData={projectDetails} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default ProjectDetail

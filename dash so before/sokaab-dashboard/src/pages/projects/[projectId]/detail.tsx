import { useEffect } from 'react'
import { Alert, Card, CardContent, Grid, LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'

import ProjectLeftSide from 'src/views/pages/projects/details/LeftSide'
import ProjectRightSide from 'src/views/pages/projects/details/RightSide'
import { getProject } from 'src/apis/projects'
import useApi from 'src/hooks/useApi'
import { IProject } from 'src/types/projects'

type Props = {
  projectData: IProject
}

const ProjectDetail = ({ projectData }: Props) => {
  // ** Hooks
  const router = useRouter()
  const {
    isLoading: getProjectLoadingApi,
    error: getProjectErrorApi,
    data: getProjectApiData,
    apiCall: getProjectApi,
    clearStates: getProjectClearStates
  } = useApi()

  // ** Var
  const { projectId } = router.query

  // Api calling
  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        await getProjectApi(getProject(Number(projectId)))
      }
    }
    fetchData()
  }, [projectId])

  // Api Success handling
  useEffect(() => {}, [getProjectApiData])

  // Api Error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (getProjectErrorApi) {
        getProjectClearStates()
        router.push('/projects')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [getProjectErrorApi])

  return (
    <Grid container spacing={6}>
      {getProjectErrorApi && (
        <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
          {getProjectErrorApi}
        </Alert>
      )}

      {getProjectLoadingApi && (
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ padding: '0 2rem', marginTop: '3rem', marginBottom: '3rem' }}>
              <LinearProgress />
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* {getProjectApiData && !getProjectLoadingApi && ( */}

      {getProjectApiData && (
        <>
          <Grid item xs={12} md={5} lg={4}>
            <ProjectLeftSide projectId={Number(projectId)} projectData={getProjectApiData} />
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <ProjectRightSide projectId={Number(projectId)} projectData={getProjectApiData} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default ProjectDetail

import { ChangeEvent, useEffect, useState } from 'react'
import {
  CardContent,
  Typography,
  Divider,
  Card,
  Grid,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
 Button
} from '@mui/material'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import { IProject } from 'src/types/projects'
import useApi from 'src/hooks/useApi'
import { updateProjectStatus } from 'src/apis/projects'

//added this
import { projectsDetailsExport } from 'src/utils/projectsDetailsExport'
import Icon from 'src/@core/components/icon'

interface ColorsType {
  [key: string]: ThemeColor
}

const ProjectStatusObj: any = {
  Active: 'success',
  Closed: 'error'
}

type Props = {
  projectId: number
  projectData: IProject
  onExport: () => void // Add this prop for the export handler
}

const ProjectLeftSide = ({ projectData, projectId, onExport }: Props) => {
  // ** States
  const [statusChecked, setStatusChecked] = useState<boolean>()
  const [statusProject, setStatusProject] = useState<string>('')
  const [publishProject, setPublishProject] = useState<boolean>(false)

  // ** Hooks
  const {
    isLoading: updateProjectStatusLoadingApi,
    error: updateProjectStatusErrorApi,
    data: updateProjectStatusApiData,
    apiCall: updateProjectStatusApi,
    clearStates: updateProjectStatusClearStates
  } = useApi()

  // ** Var
  const updateProjectStatusLoadingToast = toast
  const handleOnStatusChecked = async (event: ChangeEvent<HTMLInputElement>) => {
    setPublishProject(event.target.checked)

    const status = event.target.checked ? 'Live' : 'Inactive'
    if (projectId) await updateProjectStatusApi(updateProjectStatus(Number(projectId), status))
  }

  useEffect(() => {
    const populateStatus = () => {
      const status = new Date() >= new Date(projectData?.end_date) ? 'Closed' : 'Active'
      setStatusProject(status)

      if (projectData.status) {
        let publishedStatus: string = projectData.status
        const checked =
          publishedStatus.toLowerCase() == 'Live'.toLowerCase() ||
          publishedStatus.toLowerCase() == 'Active'.toLowerCase()
            ? true
            : false

        setPublishProject(checked)
      }
    }

    populateStatus()
  }, [projectData])

  // Api Success handling
  useEffect(() => {
    if (updateProjectStatusApiData) {
      updateProjectStatusClearStates()
      updateProjectStatusLoadingToast.success('Status updated successfully', {
        duration: 2000
      })
    }
  }, [updateProjectStatusApiData])

  // Api Error handling
  useEffect(() => {
    if (updateProjectStatusErrorApi) {
      setPublishProject(!publishProject)
      updateProjectStatusLoadingToast.error(updateProjectStatusErrorApi, { duration: 2000 })
    }

    const timer = setTimeout(() => {
      if (updateProjectStatusErrorApi) updateProjectStatusClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [updateProjectStatusErrorApi])

  


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {projectData && (
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {/* <CustomAvatar
                skin='light'
                variant='rounded'
                // color={projectData.avatarColor as ThemeColor}
                sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
              >
                {projectData.title && getInitials(projectData.title)}
              </CustomAvatar> */}

              <Typography variant='h5' sx={{ mb: 3, textAlign: 'center' }}>
                {projectData.title}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                // label={projectData.status}
                label={statusProject}
                color={ProjectStatusObj[statusProject]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />
            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Details
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>ID:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.project_id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Category:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.category}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Community Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.community_name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>End Method:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.end_method}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Start Date:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {format(new Date(projectData.start_date), 'MMMM do yyyy')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Address:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.location_district}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Village:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.village}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Country/Region:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{projectData.country_region}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Date added:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {format(new Date(projectData.date_time_added), 'MMMM do yyyy')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />
            <CardContent sx={{ pb: 1 }}>
              <>
              <Box sx={{ display: 'flex', mt: 0, alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Published:</Typography>

                <FormControlLabel
                  control={
                    <Switch
                      color='success'
                      sx={{
                        ml: 3
                      }}
                      size='medium'
                      checked={publishProject}
                      onChange={handleOnStatusChecked}
                    />
                  }
                  label=''
                />

                {updateProjectStatusLoadingApi && <CircularProgress size={20} style={{ color: 'dodgerblue' }} />}

                 <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: 4 }}> {/* Added margin-top */}
                <Button
                  variant='tonal'
                  color='primary'
                  sx={{ mr: 4 }}
                  startIcon={ <Icon fontSize='1.125rem' icon='tabler:download' />}
                  onClick={onExport} // Call the passed-down onExport prop
                >
                  Export Details
                </Button>
              </Box>
              </Box>
       
  {/* ... export btn */}
    

</>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

export default ProjectLeftSide

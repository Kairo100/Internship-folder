import { useEffect } from 'react'
import { Grid, Card, CardHeader, CardContent, Typography, styled, CircularProgress , Box} from '@mui/material'
import toast from 'react-hot-toast'

import { getProjectStatistics } from 'src/apis/statistics'
import useApi from 'src/hooks/useApi'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
const StyledTypography = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: '1.8rem !important',
  fontWeight: 'bold'
}))

type Props = {
  projectId: number
}

const ProjectSummary = ({ projectId }: Props) => {
  // ** Hooks
  const {
    isLoading: getProjectStatisticsLoadingApi,
    error: getProjectStatisticsErrorApi,
    data: getProjectStatisticsApiData,
    apiCall: getProjectStatisticsApicall,
    clearStates: getProjectStatisticsClearStates
  } = useApi()

  const formatNumber = (num?: number): string => new Intl.NumberFormat().format(num ?? 0)

  // Calling Api
  useEffect(() => {
    const fetchData = async () => {
      if (projectId) await getProjectStatisticsApicall(getProjectStatistics(projectId))
    }
    fetchData()
  }, [])

  // Api Success Handling
  useEffect(() => {}, [getProjectStatisticsApiData])

  // Api Error handling
  useEffect(() => {
    if (getProjectStatisticsErrorApi)
      toast.error(getProjectStatisticsErrorApi, {
        duration: 3000
      })

    const timer = setTimeout(() => {
      if (getProjectStatisticsErrorApi) getProjectStatisticsClearStates()
    }, 2000)

    return () => clearTimeout(timer)
  }, [getProjectStatisticsErrorApi])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <CardHeader title=' summary' /> */}
        {/* {getProjectStatisticsLoadingApi && <CircularProgress />} */}
        {getProjectStatisticsLoadingApi && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10rem' }}>
            <CircularProgress />
          </div>
        )}

        {getProjectStatisticsApiData && !getProjectStatisticsLoadingApi && (
       
         <Grid container spacing={6}>

  <Grid item xs={12} sm={4}>
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize', color:'info.main' }}>
            {formatNumber(getProjectStatisticsApiData?.matchingFund + getProjectStatisticsApiData?.fundingGoal)}
          </Typography>
          <Typography sx={{ p: 1, m: 0, fontSize: '0.6rem !important' }}>PROJECT VALUE</Typography>
          
        </Box>
        <CustomAvatar skin='light' color='info' sx={{ width: 50, height: 50 }}>
          <Icon icon='tabler:chart-bar' fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          
          <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' ,color:'primary.main'}}>
            {formatNumber(getProjectStatisticsApiData?.matchingFund) || 0}
          </Typography>
          <Typography sx={{ p: 1, m: 0, fontSize: '0.6rem !important' }}> TOTAL MATCHING FUNDS </Typography>
        </Box>
        <CustomAvatar skin='light' color='primary' sx={{ width: 50, height: 50 , }}>
          <Icon icon='tabler:currency-dollar' fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>

          <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
            {formatNumber(getProjectStatisticsApiData?.fundingGoal) || 0}
          </Typography>
          <Typography sx={{ p: 1, m: 0, fontSize: '0.6rem !important' }}> TOTAL FUNDING GOAL </Typography>
        </Box>
        <CustomAvatar skin='light' color='secondary' sx={{ width: 50, height: 50 }}>
          <Icon icon='tabler:target-arrow' fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={4}>
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          
          <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' , color:'warning.main'}}>
            {formatNumber(getProjectStatisticsApiData?.fundRaised) || 0}
          </Typography>
          <Typography sx={{ p: 1, m: 0, fontSize: '0.6rem !important' }}> TOTAL FUNDS RAISED </Typography>
        </Box>
        <CustomAvatar skin='light' color='warning' sx={{ width: 50, height: 50 }}>
          <Icon icon='tabler:cash' fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={4}>
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
       
          <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize', color:'success.main' }}>
            {formatNumber(getProjectStatisticsApiData?.backers) || 0}
          </Typography>
             <Typography sx={{ p: 1, m: 0, fontSize: '0.6rem !important' }}> TOTAL BACKERS </Typography>
        </Box>
        <CustomAvatar skin='light' color='success' sx={{ width: 50, height: 50 }}>
          <Icon icon='tabler:users' fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} sm={4}>
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          
          <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize', color:'error.main' }}>
            {formatNumber(getProjectStatisticsApiData?.expenditure) || 0}
          </Typography>
          <Typography sx={{ p: 1, m: 0, fontSize: '0.6rem !important' }}> TOTAL EXPENDITURE </Typography>
        </Box>
        <CustomAvatar skin='light' color='error' sx={{ width: 50, height: 50 }}>
          <Icon icon='tabler:wallet' fontSize='1.75rem' />
        </CustomAvatar>
      </CardContent>
    </Card>
  </Grid>
</Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default ProjectSummary

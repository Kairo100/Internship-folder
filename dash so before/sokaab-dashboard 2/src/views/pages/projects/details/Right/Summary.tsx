import { useEffect } from 'react'
import { Grid, Card, CardHeader, CardContent, Typography, styled, CircularProgress } from '@mui/material'
import toast from 'react-hot-toast'

import { getProjectStatistics } from 'src/apis/statistics'
import useApi from 'src/hooks/useApi'

const StyledTypography = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
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
                <Typography sx={{ p: 3, m: 0, fontSize: '0.9rem !important' }}>PROJECT VALUE</Typography>
                <CardContent
                  sx={{
                    p: 3,
                    pt: 0,
                    pb: '0 !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {/* {getProjectStatisticsApiData?.matchingFund + getProjectStatisticsApiData?.fundingGoal || 0} */}
                    {formatNumber(getProjectStatisticsApiData?.matchingFund + getProjectStatisticsApiData?.fundingGoal)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                {/* <CardHeader title='TOTAL MATCHING FUNDS' sx={{ p: 2, m: 0, fontSize: '20rem !important' }} /> */}
                <Typography sx={{ p: 3, m: 0, fontSize: '0.9rem !important' }}> TOTAL MATCHING FUNDS </Typography>
                <CardContent
                  sx={{
                    p: 3,
                    pt: 0,
                    pb: '0 !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {formatNumber(getProjectStatisticsApiData?.matchingFund) || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                {/* <CardHeader title='TOTAL FUNDING GOAL' sx={{ p: 2, m: 0, fontSize: '20rem !important' }} /> */}
                <Typography sx={{ p: 3, m: 0, fontSize: '0.9rem !important' }}> TOTAL FUNDING GOAL </Typography>
                <CardContent
                  sx={{
                    p: 3,
                    pt: 0,
                    pb: '0 !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {formatNumber(getProjectStatisticsApiData?.fundingGoal) || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                {/* <CardHeader title='TOTAL FUNDS RAISED' sx={{ p: 2, m: 0, fontSize: '20rem !important' }} /> */}
                <Typography sx={{ p: 3, m: 0, fontSize: '0.9rem !important' }}> TOTAL FUNDS RAISED </Typography>
                <CardContent
                  sx={{
                    p: 3,
                    pt: 0,
                    pb: '0 !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {formatNumber(getProjectStatisticsApiData?.fundRaised) || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                {/* <CardHeader title='TOTAL BACKERS' sx={{ p: 2, m: 0, fontSize: '20rem !important' }} /> */}
                <Typography sx={{ p: 3, m: 0, fontSize: '0.9rem !important' }}> TOTAL BACKERS </Typography>
                <CardContent
                  sx={{
                    p: 3,
                    pt: 0,
                    pb: '0 !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {formatNumber(getProjectStatisticsApiData?.backers) || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                {/* <CardHeader title='TOTAL EXPENDITURE' sx={{ p: 2, m: 0, fontSize: '20rem !important' }} /> */}
                <Typography sx={{ p: 3, m: 0, fontSize: '0.9rem !important' }}> TOTAL EXPENDITURE </Typography>
                <CardContent
                  sx={{
                    p: 3,
                    pt: 0,
                    pb: '0 !important',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {formatNumber(getProjectStatisticsApiData?.expenditure) || 0}
                  </Typography>
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

import { useEffect } from 'react'
import { Grid, Card, CardHeader, CardContent, Typography, styled, CircularProgress } from '@mui/material'
import toast from 'react-hot-toast'

import { getDashboardStatistics } from 'src/apis/statistics'
import useApi from 'src/hooks/useApi'

const StyledTypography = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
  fontSize: '2.4rem !important'
}))

const Dashboard = () => {
  // ** Hooks
  const {
    isLoading: getDashboardStatisticsLoadingApi,
    error: getDashboardStatisticsErrorApi,
    data: getDashboardStatisticsApiData,
    apiCall: getDashboardStatisticsApicall,
    clearStates: getDashboardStatisticsClearStates
  } = useApi()

  // Calling Api
  useEffect(() => {
    const fetchData = async () => {
      await getDashboardStatisticsApicall(getDashboardStatistics())
    }
    fetchData()
  }, [])

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

          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title='TOTAL PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {getDashboardStatisticsApiData?.totalProjects
                      ? getDashboardStatisticsApiData.totalProjects.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title='TOTAL BACKERS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {getDashboardStatisticsApiData?.backers
                      ? getDashboardStatisticsApiData.backers.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title='TOTAL PROJECT VALUES' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {getDashboardStatisticsApiData?.projectValues
                      ? getDashboardStatisticsApiData.projectValues.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title='TOTAL FUNDS RAISED' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    $
                    {getDashboardStatisticsApiData?.fundRaised
                      ? getDashboardStatisticsApiData.fundRaised.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title='TOTAL MATCHING FUNDS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    $
                    {getDashboardStatisticsApiData?.matchingFunds
                      ? getDashboardStatisticsApiData.matchingFunds.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title='TOTAL FUNDING GOAL' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    $
                    {getDashboardStatisticsApiData?.fundingGoals
                      ? getDashboardStatisticsApiData.fundingGoals.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}

            {/* <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title='TOTAL EXPENDITURE' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    $
                    {getDashboardStatisticsApiData?.expenditure
                      ? getDashboardStatisticsApiData.expenditure.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
            {/* <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title='TOTAL ACTIVE PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {getDashboardStatisticsApiData?.activeProjects
                      ? getDashboardStatisticsApiData.activeProjects.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
            {/* <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title='TOTAL PENDING PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {getDashboardStatisticsApiData?.pendingProjects
                      ? getDashboardStatisticsApiData.pendingProjects.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
            {/* <Grid item xs={12} sm={4}>
              <Card>
                <CardHeader title='TOTAL IN-ACTIVE PROJECTS' sx={{ p: 5, m: 0, fontSize: '20rem !important' }} />
                <CardContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography component={StyledTypography} noWrap sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {getDashboardStatisticsApiData?.inactiveProjects
                      ? getDashboardStatisticsApiData.inactiveProjects.toLocaleString()
                      : '0'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default Dashboard

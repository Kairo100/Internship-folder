import { useEffect } from 'react'
import { Alert, Card, CardContent, Grid, LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'

import OrganisationLeftSide from 'src/views/pages/organisations/details/LeftSide'
import OrganisationRightSide from 'src/views/pages/organisations/details/RightSide'
import { getOrganisation } from 'src/apis/organisations'
import useApi from 'src/hooks/useApi'

const OrganisationDetail = () => {
  // ** Hooks
  const router = useRouter()
  const {
    isLoading: getOrganisationLoadingApi,
    error: getOrganisationErrorApi,
    data: getOrganisationApiData,
    apiCall: getOrganisationApi,
    clearStates: getOrganisationClearStates
  } = useApi()

  // ** Var
  const { organisationId } = router.query

  // Api calling
  useEffect(() => {
    const fetchData = async () => {
      if (organisationId) {
        await getOrganisationApi(getOrganisation(Number(organisationId)))
      }
    }
    fetchData()
  }, [organisationId])

  // Api Success handling
  useEffect(() => {}, [getOrganisationApiData])

  // Api Error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (getOrganisationErrorApi) {
        getOrganisationClearStates()
        router.push('/organisations')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [getOrganisationErrorApi])

  return (
    <Grid container spacing={6}>
      {getOrganisationErrorApi && (
        <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
          {getOrganisationErrorApi}
        </Alert>
      )}

      {getOrganisationLoadingApi && (
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ padding: '0 2rem', marginTop: '3rem', marginBottom: '3rem' }}>
              <LinearProgress />
            </CardContent>
          </Card>
        </Grid>
      )}
      {getOrganisationApiData && (
        <>
          <Grid item xs={12} md={5} lg={4}>
            <OrganisationLeftSide organisationData={getOrganisationApiData} />
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <OrganisationRightSide organisationId={Number(organisationId)} />
          </Grid>
        </>
      )}
    </Grid>
  )
}

export default OrganisationDetail

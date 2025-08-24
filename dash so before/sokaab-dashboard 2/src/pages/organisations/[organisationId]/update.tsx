import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Grid, Card, CardContent, Button, MenuItem, Alert, Box, LinearProgress } from '@mui/material'
import toast from 'react-hot-toast'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

// ** CleaveJS
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

import CustomTextField from 'src/@core/components/mui/text-field'
import PageHeader from 'src/@core/components/page-header'
import useApi from 'src/hooks/useApi'
import { getOrganisation, updateOrganisation } from 'src/apis/organisations'
import { TUpdateOrganisation } from 'src/types/organisations'

const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

const defaultValues: TUpdateOrganisation = {
  organisation_name: '',
  organisation_bio: '',
  phone_number: '',
  email_address: '',
  website_address: '',
  address: '',
  country: '',
  entity_id: ''
}

const schema = yup.object().shape({
  organisation_name: yup.string().required().min(5).max(20),
  organisation_bio: yup.string().min(10).max(500),
  phone_number: yup.string().required().min(7).max(16),
  email_address: yup.string().email().required(),
  website_address: yup.string().max(50).url('Website URl must be a valid URL'),
  address: yup.string().max(50),
  country: yup.string().max(14),
  entity_id: yup.string().required()
})

const UpdateOrganisation = () => {
  // ** States

  // ** Hooks
  const router = useRouter()
  const {
    setValue,

    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const {
    // isLoading: updateOrganisationLoadingApi,
    error: updateOrganisationErrorApi,
    data: updateOrganisationApiData,
    apiCall: updateOrganisationApi,
    clearStates: updateOrganisationClearStates
  } = useApi()
  const {
    isLoading: getOrganisationLoadingApi,
    error: getOrganisationErrorApi,
    data: getOrganisationApiData,
    apiCall: getOrganisationApi,
    clearStates: getOrganisationClearStates
  } = useApi()

  // ** Var
  const updateOrganisationLoadingToast = toast
  const { organisationId } = router.query

  const onSubmit = async (data: TUpdateOrganisation) => {
    updateOrganisationLoadingToast.loading('Loading...')

    if (organisationId) {
      let newData: Partial<TUpdateOrganisation> = { ...data }

      await updateOrganisationApi(updateOrganisation(Number(organisationId), newData))
    }
  }

  const populatingUpdateData = (data: any) => {
    setValue('organisation_name', data.organisation_name)
    setValue('organisation_bio', data.organisation_bio)
    setValue('phone_number', data.phone_number)
    setValue('email_address', data.email_address)
    setValue('website_address', data.website_address)
    setValue('address', data.address)
    setValue('country', data.country)
    setValue('entity_id', data.entity_id)
  }

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
  useEffect(() => {
    if (getOrganisationApiData) populatingUpdateData(getOrganisationApiData)

    if (updateOrganisationApiData) {
      updateOrganisationLoadingToast.dismiss()
      updateOrganisationLoadingToast.success('Organisation updated successfully', {
        duration: 2000
      })
      router.push('/organisations')
    }
  }, [getOrganisationApiData, updateOrganisationApiData])

  // Api Error handling
  useEffect(() => {
    if (updateOrganisationErrorApi) updateOrganisationLoadingToast.dismiss()

    const timer = setTimeout(() => {
      if (updateOrganisationErrorApi) {
        updateOrganisationLoadingToast.dismiss()
        updateOrganisationClearStates()
      }

      if (getOrganisationErrorApi) {
        getOrganisationClearStates()
        router.push('/organisations')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [getOrganisationErrorApi, updateOrganisationErrorApi])

  return (
    <CleaveWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Update Organisation</Typography>} />
        <Grid item xs={12}>
          <Card>
            {updateOrganisationErrorApi && (
              <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
                {updateOrganisationErrorApi}
              </Alert>
            )}
            {getOrganisationErrorApi && (
              <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
                {getOrganisationErrorApi}
              </Alert>
            )}

            {getOrganisationLoadingApi && (
              <CardContent style={{ padding: '0 2rem', marginTop: '3rem', marginBottom: '3rem' }}>
                <Box>
                  <LinearProgress />
                </Box>
              </CardContent>
            )}

            {!getOrganisationLoadingApi && (
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={5}>
                    {/* Inputs */}
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='organisation_name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.organisation_name)}
                            {...(errors.organisation_name && { helperText: errors.organisation_name.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <InputLabel htmlFor='prefix'>Phone Number</InputLabel>
                      <Controller
                        name='phone_number'
                        control={control}
                        rules={{ required: true }}
                        defaultValue=''
                        render={({ field: { value, onChange, onBlur } }) => {
                          return (
                            <>
                              <Cleave
                                options={{
                                  prefix: '+252',
                                  blocks: [4, 2, 7],
                                  numericOnly: true
                                }}
                                style={errors.phone_number && { borderColor: '#EA5455' }}
                                value={value}
                                onBlur={onBlur}
                                onChange={onChange}
                                placeholder=''
                              />
                              {errors.phone_number && (
                                <p style={{ fontSize: '0.8rem', color: '#EA5455', marginTop: '0.1rem' }}>
                                  {errors.phone_number.message}
                                </p>
                              )}
                            </>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name='email_address'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='Email Address'
                            type='email'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.email_address)}
                            {...(errors.email_address && { helperText: errors.email_address.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Controller
                        name='address'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='Address'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.address)}
                            {...(errors.address && { helperText: errors.address.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Controller
                        name='organisation_bio'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='Bio'
                            multiline
                            rows={3}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.organisation_bio)}
                            {...(errors.organisation_bio && { helperText: errors.organisation_bio.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Controller
                        name='website_address'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='website_address'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.website_address)}
                            {...(errors.website_address && { helperText: errors.website_address.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='country'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='country'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.country)}
                            {...(errors.country && { helperText: errors.country.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='entity_id'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            select
                            fullWidth
                            value={value}
                            onBlur={onBlur}
                            label='Entity'
                            SelectProps={{
                              value: value,
                              displayEmpty: true,
                              onChange: e => onChange(e)
                            }}
                            id='validation-basic-select'
                            error={Boolean(errors.entity_id)}
                            aria-describedby='validation-basic-select'
                            {...(errors.entity_id && { helperText: errors.entity_id.message })}
                          >
                            <MenuItem value=''>Select a Entity</MenuItem>
                            <MenuItem value='1'>Bulshokaab</MenuItem>
                            <MenuItem value='2'>Sokaab</MenuItem>
                            <MenuItem value='3'>Tarmiye</MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12}>
                      <Button type='submit' variant='contained'>
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </CleaveWrapper>
  )
}

export default UpdateOrganisation

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Grid, Card, CardContent, Button, MenuItem, Alert, Box, LinearProgress } from '@mui/material'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import useApi from 'src/hooks/useApi'
import { getUser, updateUser } from 'src/apis/users'
import { useEffect, useState } from 'react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  confirmPassword?: string
}

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const schema = yup.object().shape({
  firstName: yup.string().required().min(5).max(20),
  lastName: yup.string().required().min(5).max(30),
  email: yup.string().email().required(),
  password: yup.string().notRequired(),
  confirmPassword: yup.string().test('passwords-match', 'Passwords must match', function (value) {
    const { password } = this.parent
    if (!password && !value) return true // Both empty is valid
    if (password && !value) return false // Password set but no confirm
    if (!password && value) return false // Confirm set but no password
    return password === value // Both set, must match
  })
})

const UpdateUser = () => {
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
    // isLoading: updateUserLoadingApi,
    error: updateUserErrorApi,
    data: updateUserApiData,
    apiCall: updateUserApi,
    clearStates: updateUserClearStates
  } = useApi()
  const {
    isLoading: getUserLoadingApi,
    error: getUserErrorApi,
    data: getUserApiData,
    apiCall: getUserApi,
    clearStates: getUserClearStates
  } = useApi()

  // ** Var
  const updateUserLoadingToast = toast
  const { userId } = router.query

  const onSubmit = async (data: FormData) => {
    updateUserLoadingToast.loading('Loading...')
    if (userId) {
      let newData: Partial<FormData> = { ...data }

      // Only include password if it's been changed
      if (!data.password) {
        delete newData.password
        delete newData.confirmPassword
      }

      console.log('^^^^^', newData)
      await updateUserApi(updateUser(userId.toString(), newData))
    }
  }

  const populatingUpdateData = (data: any) => {
    setValue('firstName', data.first_name)
    setValue('lastName', data.last_name)
    setValue('email', data.email_address)
    // Don't populate password fields
    setValue('password', '')
    setValue('confirmPassword', '')
  }

  // Calling Api
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await getUserApi(getUser(userId.toString()))
      }
    }
    fetchData()
  }, [userId])

  // Success handling
  useEffect(() => {
    if (getUserApiData) populatingUpdateData(getUserApiData)

    if (updateUserApiData) {
      updateUserLoadingToast.dismiss()
      updateUserLoadingToast.success('User Added Successfully', {
        duration: 2000
      })
      router.push('/users')
    }
  }, [getUserApiData, updateUserApiData])

  // Api Api Error handling
  useEffect(() => {
    if (updateUserErrorApi) updateUserLoadingToast.dismiss()

    const timer = setTimeout(() => {
      if (updateUserErrorApi) {
        updateUserLoadingToast.dismiss()
        updateUserClearStates()
      }

      if (getUserErrorApi) {
        getUserClearStates()
        router.push('/users')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [getUserErrorApi, updateUserErrorApi])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Edit User</Typography>} />
        <Grid item xs={12}>
          <Card>
            {updateUserErrorApi && (
              <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
                {updateUserErrorApi}
              </Alert>
            )}
            {getUserErrorApi && (
              <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
                {getUserErrorApi}
              </Alert>
            )}

            {getUserLoadingApi && (
              <CardContent style={{ padding: '0 2rem', marginTop: '3rem', marginBottom: '3rem' }}>
                <Box>
                  <LinearProgress />
                </Box>
              </CardContent>
            )}

            {!getUserLoadingApi && (
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={5}>
                    {/* Inputs */}
                    <>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name='firstName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomTextField
                              fullWidth
                              label='First Name'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              placeholder=''
                              error={Boolean(errors.firstName)}
                              {...(errors.firstName && { helperText: errors.firstName.message })}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Controller
                          name='lastName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomTextField
                              fullWidth
                              label='Last Name'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              placeholder=''
                              error={Boolean(errors.lastName)}
                              {...(errors.lastName && { helperText: errors.lastName.message })}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Controller
                          name='email'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomTextField
                              fullWidth
                              label='Email'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              placeholder=''
                              error={Boolean(errors.email)}
                              {...(errors.email && { helperText: errors.email.message })}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name='password'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomTextField
                              fullWidth
                              label='New Password'
                              type='password'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              placeholder='Leave empty to keep current password'
                              error={Boolean(errors.password)}
                              helperText={
                                errors.password?.message || 'Leave empty if you dont want to change the password'
                              }
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name='confirmPassword'
                          control={control}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <CustomTextField
                              fullWidth
                              label='Confirm New Password'
                              type='password'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              placeholder='Leave empty to keep current password'
                              error={Boolean(errors.confirmPassword)}
                              helperText={errors.confirmPassword?.message || 'Confirm new password only if changing'}
                            />
                          )}
                        />
                      </Grid>
                    </>

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
    </DatePickerWrapper>
  )
}

export default UpdateUser

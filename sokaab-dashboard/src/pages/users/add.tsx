import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { Typography, Grid, Card, CardContent, Button, MenuItem, Alert } from '@mui/material'
import toast from 'react-hot-toast'

import CustomTextField from 'src/@core/components/mui/text-field'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import useApi from 'src/hooks/useApi'
import { addUser } from 'src/apis/users'
import { useEffect, useState } from 'react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
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
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    // .oneOf([yup.ref('password', null)])
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required()
})

const AddUser = () => {
  // ** States
  const [tempError, setTempError] = useState<string>('')

  // ** Hooks
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { isLoading: apiLoading, error: apiError, data: apiData, apiCall: addUserApi } = useApi()

  // ** Var
  const apiLoadingToast = toast

  const onSubmit = async (data: FormData) => {
    if (addUserApi) {
      apiLoadingToast.loading('Loading...')
      await addUserApi(addUser(data))
    }
  }

  // Api Success handling
  useEffect(() => {
    if (apiData) {
      apiLoadingToast.dismiss()
      apiLoadingToast.success('User Added Successfully', {
        duration: 2000
      })
      router.push('/users')
    }
  }, [apiData])

  // Api Error handling
  useEffect(() => {
    if (apiError) setTempError(apiError)

    const timer = setTimeout(() => {
      setTempError('')
    }, 1000)

    return () => clearTimeout(timer)
  }, [apiError])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader title={<Typography variant='h4'>Add User</Typography>} />
        <Grid item xs={12}>
          <Card>
            {tempError && (
              <Alert variant='filled' severity='error' sx={{ py: 0, mx: 5, mt: 5 }}>
                {tempError}
              </Alert>
            )}

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
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='Password'
                            type='password'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.password)}
                            {...(errors.password && { helperText: errors.password.message })}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name='confirmPassword'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <CustomTextField
                            fullWidth
                            label='Confirm Password'
                            type='password'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors.confirmPassword)}
                            {...(errors.confirmPassword && { helperText: errors.confirmPassword.message })}
                          />
                        )}
                      />
                    </Grid>
                  </>

                  {/* Actions */}
                  <Grid item xs={12}>
                    <Button type='submit' variant='contained'>
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default AddUser

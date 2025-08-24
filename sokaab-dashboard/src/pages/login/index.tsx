// ** React Imports
import { ChangeEvent, ReactNode, useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Button,
  Typography,
  IconButton,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { useAuth } from 'src/hooks/useAuth'
import { TLogin } from 'src/types/auth'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

interface State {
  password: string
  showPassword: boolean
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(3).required(),
  user_type: yup.string().oneOf(['user_account', 'organisation_member']).required()
})

const defaultValues = {
  email: '',
  password: '',
  user_type: 'user_account'
}

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const auth = useAuth()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const onSubmit = (data: TLogin) => {
    const { email, password, user_type } = data
    const rememberMe = true
    auth.login({ email, password, user_type, rememberMe }, (err: any) => {
      if (err !== 'Internal Server Error' || err !== 'Internal Server Error') {
        toast.error(err, {
          duration: 3000
        })
      } else {
        setError('email', {
          type: 'manual',
          message: 'Email or Password is invalid'
        })
      }
    })
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 9 }}>
              <img src='/images/logos/sokaab-logo.png' style={{ width: '11rem' }} alt='' />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                {`Welcome! 👋🏻   Please login `}
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id='user-type-label'>Login As</InputLabel>
                <Controller
                  name='user_type'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      labelId='user-type-label'
                      label='Login As'
                      error={Boolean(errors.user_type)}
                    >
                      <MenuItem value='user_account'>Admin/User Account</MenuItem>
                      <MenuItem value='organisation_member'>Organisation Member</MenuItem>
                    </Select>
                  )}
                />
                {errors.user_type && (
                  <Typography variant='caption' color='error'>
                    {errors.user_type.message}
                  </Typography>
                )}
              </FormControl>

              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    autoFocus
                    fullWidth
                    id='email'
                    label='Email'
                    sx={{ mb: 4 }}
                    placeholder=''
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />

              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    sx={{ mb: 1.5 }}
                    label='Password'
                    id='auth-login-password'
                    placeholder=''
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.password)}
                    {...(errors.password && { helperText: errors.password.message })}
                    type={values.showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            <Typography component={LinkStyled} href='/forgot-password'>
                  Forgot Password?
                </Typography>
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4, mt: 3 }}>
                Login
              </Button>
              {/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>New to Sokaab?</Typography>
                <Typography component={LinkStyled} href='/pages/auth/register-v1'>
                  Create an account
                </Typography>
              </Box> */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Thinking of joining Sokaab?</Typography>
                <Typography component={LinkStyled} href='https://www.sokaab.com/how-it-works'>
                  Learn More
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage

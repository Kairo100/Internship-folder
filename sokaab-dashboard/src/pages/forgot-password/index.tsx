// ** React Imports
import { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, Typography, CardContent } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon' 
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'


const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

// ** Schema for validation
const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required')
})

interface ForgotPasswordFormData {
  email: string
}

const ForgotPasswordPage = () => {
  
  const theme = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Handle form submission
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: data.email })
      // });
      // const result = await response.json();

      // Placeholder for API call success/failure
      console.log('Forgot password request for:', data.email);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call delay

      toast.success('If an account with that email exists, a password reset link has been sent.', { duration: 5000 });


    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again later.', { duration: 5000 });
    }
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 9 }}>
             
              <img src='/images/logos/sokaab-logo.png' style={{ width: '11rem' }} alt='Logo' />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Enter your email and we'll send you instructions to reset your password.
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    type='email'
                    label='Email'
                    sx={{ mb: 4 }}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />

              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </Button>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}
              >
                <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                <LinkStyled href='/pages/auth/login-v1'>Back to login</LinkStyled>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

ForgotPasswordPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPasswordPage.guestGuard = true

export default ForgotPasswordPage
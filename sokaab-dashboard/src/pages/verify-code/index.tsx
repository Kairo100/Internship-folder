import { ReactNode, useState } from 'react'
import { Box, Button, Typography, CardContent } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import Link from 'next/link'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const VerifyCodePage = () => {
  const theme = useTheme()
  const [code, setCode] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch(`${process.env.API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Invalid code');

    toast.success('Code verified! Now reset your password.');
    // Store token/tempId in localStorage to identify user
    localStorage.setItem('resetToken', result.resetToken);
    window.location.href = '/pages/auth/reset-password';
  } catch (error: any) {
    toast.error(error.message || 'Invalid code.');
  }
};


  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Typography variant='h4' sx={{ mb: 1.5 }}>
              Enter Verification Code 📩
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4 }}>
              We sent a 6-digit code to your email.
            </Typography>
            <form onSubmit={handleVerify}>
              <CustomTextField
                fullWidth
                label='Verification Code'
                value={code}
                onChange={e => setCode(e.target.value)}
                sx={{ mb: 4 }}
              />
              <Button fullWidth type='submit' variant='contained'>
                Verify Code
              </Button>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href='/pages/auth/forgot-password'>Resend Code</Link>
            </Box>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

VerifyCodePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
VerifyCodePage.guestGuard = true
export default VerifyCodePage

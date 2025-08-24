import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Typography, CardContent } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard, { CardProps } from '@mui/material/Card';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomTextField from 'src/@core/components/mui/text-field';
import Icon from 'src/@core/components/icon';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper';

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}));

// ** Schema for validation
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm password is required')
});

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const theme = useTheme();

  // State to toggle password visibility
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>({
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  // ** Handle form submission
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      // In a real application, you would typically extract a reset token from the URL
      // (e.g., const { query } = useRouter(); const token = query.token as string;)
      // and send it along with the new password to your API.
      console.log('Reset password request with new password:', data.newPassword);
      console.log('Confirm password:', data.confirmPassword);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Placeholder for actual API call to reset password
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: 'your-reset-token-here', newPassword: data.newPassword })
      // });
      // const result = await response.json();

      toast.success('Your password has been reset successfully! You can now log in.', { duration: 5000 });

    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password. Please try again later.', { duration: 5000 });
    }
  };

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
                Reset Password 🔑
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Set your new password for your account.
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='newPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    autoFocus
                    label='New Password'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    type={showNewPassword ? 'text' : 'password'}
                    sx={{ mb: 4 }}
                    error={Boolean(errors.newPassword)}
                    {...(errors.newPassword && { helperText: errors.newPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={() => setShowNewPassword(!showNewPassword)}>
                          <Icon icon={showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </Box>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='confirmPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Confirm New Password'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    type={showConfirmPassword ? 'text' : 'password'}
                    sx={{ mb: 4 }}
                    error={Boolean(errors.confirmPassword)}
                    {...(errors.confirmPassword && { helperText: errors.confirmPassword.message })}
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <Icon icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </Box>
                      )
                    }}
                  />
                )}
              />

              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Set new password'}
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
  );
};

ResetPasswordPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

// This page might typically not be guestGuard true if a token is required,
// but keeping it as is based on your original structure.
ResetPasswordPage.guestGuard = true;

export default ResetPasswordPage;

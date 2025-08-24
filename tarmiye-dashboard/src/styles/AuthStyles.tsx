// authStyles.tsx
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

export const AuthWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

export const AuthCard = styled(Card)(({ theme }) => ({
  maxWidth: 420,
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '95%',
    boxShadow: theme.shadows[1],
  },
}));

export const LinkStyled = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`,
  fontWeight: 500,
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

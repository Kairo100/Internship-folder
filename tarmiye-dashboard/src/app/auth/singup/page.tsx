// 'use client'

// import React, { useState, createContext, useContext, useMemo } from 'react';
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import Image from 'next/image';
// import theme from '@/styles/theme';

// // Context and mock auth functions
// const AuthContext = createContext(null);
// const useAuth = () => useContext(AuthContext);

// const AuthProvider = ({ children }) => {
//   const login = ({ email, password, rememberMe }) => {
//     console.log('Simulating login:', { email, password, rememberMe });
//     return new Promise(resolve => setTimeout(resolve, 500));
//   };
//   const signup = ({ name, email, password }) => {
//     console.log('Simulating signup:', { name, email, password });
//     return new Promise(resolve => setTimeout(resolve, 1000));
//   };

//   const auth = useMemo(() => ({ login, signup }), []);
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// // Settings mock
// const SettingsContext = createContext(null);
// const useSettings = () => useContext(SettingsContext);
// const SettingsProvider = ({ children }) => {
//   const settings = { skin: 'default', mode: 'light' };
//   return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
// };

// // Styled components
// const AuthWrapper = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: theme.palette.background.default,
//   padding: theme.spacing(3),
// }));

// const AuthCard = styled(Card)(({ theme }) => ({
//   maxWidth: 420,
//   width: '100%',
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[4],
//   overflow: 'hidden',
// }));

// const LinkStyled = styled('a')(({ theme }) => ({
//   textDecoration: 'none',
//   color: `${theme.palette.primary.main} !important`,
//   fontWeight: 500,
//   '&:hover': { textDecoration: 'underline' },
// }));


// //icons 
// const Icon = ({ icon, fontSize = '1.25rem' }) => {
//   if (icon === 'tabler:eye') {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={fontSize}
//         height={fontSize}
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//         <circle cx="12" cy="12" r="3" />
//       </svg>
//     );
//   }

//   if (icon === 'tabler:eye-off') {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={fontSize}
//         height={fontSize}
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         {/* Corrected path for tabler:eye-off */}
//         <path d="M10.585 10.587a2 2 0 0 0 2.828 2.83" />
//         <path d="M9.363 5.365A9.453 9.453 0 0 1 12 4c7 0 11 8 11 8a18.02 18.02 0 0 1-2.088 3.538" />
//         <path d="M3.284 3.286L1 12s4 8 11 8a18.02 18.02 0 0 0 4.538-.619" />
//         <line x1="3" y1="3" x2="21" y2="21" /> {/* This creates the cross-out effect */}
//       </svg>
//     );
//   }

//   return null;
// };
// // Validation schema
// const schema = yup.object().shape({
//   fullName: yup.string().required('Full Name is required'),
//   email: yup.string().email('Enter a valid email').required('Email is required'),
//   password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
// });

// interface FormData {
//   fullName: string;
//   email: string;
//   password: string;
// }

// const SignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const auth = useAuth();
//   const theme = useTheme();
//   const { settings } = useSettings();
//   const hidden = useMediaQuery(theme.breakpoints.down('md'));

//   const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
//     defaultValues: { fullName: '', email: '', password: '' },
//     mode: 'onBlur',
//     resolver: yupResolver(schema)
//   });

//   const onSubmit = async (data: FormData) => {
//     try {
//       await auth.signup({ name: data.fullName, email: data.email, password: data.password });
//       auth.login({ email: data.email, password: data.password, rememberMe: true });
//     } catch (error) {
//       console.error('Signup failed:', error);
//     }
//   };

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent
//           sx={{
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center'
//           }}
//         >
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image src="/images/logo/logo.png" alt="Tarmiye Logo" width={50} height={50} />
//           </Box>
//             {/* Title */}
// <Typography
//   variant="h6"
//   gutterBottom
//   sx={{
//     fontWeight: 'bold',
//     textAlign: 'center',
//   }}
// >
//   Welcome to Tarmiye Dashboard
// </Typography>

// <Typography
//   sx={{
//     color: 'text.secondary',
//     mb: 1,               // smaller bottom margin to reduce space
//     fontSize: '1rem', // smaller font size (you can tweak this)
//     textAlign: 'center',  // center horizontally
//   }}
// >
//   Create your account to start your journey with us
// </Typography>


//           {/* Form */}
//           <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="fullName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     placeholder="John Doe"
//                     {...field}
//                     error={Boolean(errors.fullName)}
//                     helperText={errors.fullName?.message}
//                   />
//                 )}
//               />
//             </Box>

//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     placeholder="user@example.com"
//                     {...field}
//                     error={Boolean(errors.email)}
//                     helperText={errors.email?.message}
//                   />
//                 )}
//               />
//             </Box>

//                           {/* Password Field */}
//                  <Box sx={{ mb: 4 }}>
//                    <Controller
//                   name='password'
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       fullWidth
//                       label='Password'
//                       placeholder='********'
//                       type={showPassword ? 'text' : 'password'}
//                       {...field}
//                       error={Boolean(errors.password)}
//                       helperText={errors.password?.message}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position='end'>
//                             <IconButton
//                               edge='end'
//                               onMouseDown={e => e.preventDefault()}
//                               onClick={() => setShowPassword(!showPassword)}
//                             >
//                               <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                             </IconButton>
//                           </InputAdornment>
//                         )
//                       }}
//                     />
//                   )}
//                 />
//               </Box>

//             <FormControlLabel
//               label="I agree to privacy policy & terms"
//               control={<Checkbox defaultChecked />}
//               sx={{ mb: 2 }}
//             />

//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{
//                 mb: 2,
//                 py: 1.2,
//                 fontWeight: 600,
//                 fontSize: '1rem',
//                 borderRadius: theme.shape.borderRadius,
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Signing Up...' : 'Sign Up'}
//             </Button>

//             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 }}>Already have an account?</Typography>
//               <Typography component={LinkStyled} href="login" >
//                 Sign In instead
//               </Typography>
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>
//     </AuthWrapper>
//   );
// };

// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <SettingsProvider>
//         <SignupPage />
//       </SettingsProvider>
//     </AuthProvider>
//   </ThemeProvider>
// );

// // export default App;
// 'use client'

// import React, { useState, createContext, useContext } from 'react';
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import Image from 'next/image';
// import theme from '@/styles/theme';

// // ----------------------
// // Auth Context (Login/Signup simulation)
// // ----------------------
// const AuthContext = createContext<any>(null);
// const useAuth = () => useContext(AuthContext);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const login = async ({ email, password, rememberMe }: any) => {
//     console.log('Login:', { email, password, rememberMe });
//     return new Promise(resolve => setTimeout(resolve, 500));
//   };

//   const signup = async ({ name, email, password }: any) => {
//     console.log('Signup:', { name, email, password });
//     return new Promise(resolve => setTimeout(resolve, 1000));
//   };

//   return (
//     <AuthContext.Provider value={{ login, signup }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ----------------------
// // Styled Components
// // ----------------------
// const AuthWrapper = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: theme.palette.background.default,
//   padding: theme.spacing(3),
// }));

// const AuthCard = styled(Card)(({ theme }) => ({
//   maxWidth: 420,
//   width: '100%',
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[4],
//   overflow: 'hidden',
// }));

// const LinkStyled = styled('a')(({ theme }) => ({
//   textDecoration: 'none',
//   color: `${theme.palette.primary.main} !important`,
//   fontWeight: 500,
//   '&:hover': { textDecoration: 'underline' },
// }));

// // ----------------------
// // Eye Icon Component
// // ----------------------
// const Icon = ({ icon, fontSize = '1.25rem' }) => {
//   if (icon === 'tabler:eye') {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={fontSize}
//         height={fontSize}
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//         <circle cx="12" cy="12" r="3" />
//       </svg>
//     );
//   }

//   if (icon === 'tabler:eye-off') {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={fontSize}
//         height={fontSize}
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M10.585 10.587a2 2 0 0 0 2.828 2.83" />
//         <path d="M9.363 5.365A9.453 9.453 0 0 1 12 4c7 0 11 8 11 8a18.02 18.02 0 0 1-2.088 3.538" />
//         <path d="M3.284 3.286L1 12s4 8 11 8a18.02 18.02 0 0 0 4.538-.619" />
//         <line x1="3" y1="3" x2="21" y2="21" />
//       </svg>
//     );
//   }

//   return null;
// };

// // ----------------------
// // Validation Schema
// // ----------------------
// const schema = yup.object({
//   fullName: yup.string().required('Full Name is required'),
//   email: yup.string().email('Enter a valid email').required('Email is required'),
//   password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
// });

// // ----------------------
// // Signup Component
// // ----------------------
// const SignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const auth = useAuth();
//   const muiTheme = useTheme();
//   const hidden = useMediaQuery(muiTheme.breakpoints.down('md'));

//   const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
//     defaultValues: { fullName: '', email: '', password: '' },
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data: any) => {
//     try {
//       await auth.signup({ name: data.fullName, email: data.email, password: data.password });
//       await auth.login({ email: data.email, password: data.password, rememberMe: true });
//     } catch (error) {
//       console.error('Signup failed:', error);
//     }
//   };

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image src="/images/logo/logo.png" alt="Tarmiye Logo" width={50} height={50} />
//           </Box>

//           {/* Title */}
//           <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//             Welcome to Tarmiye Dashboard
//           </Typography>
//           <Typography sx={{ color: 'text.secondary', mb: 1, fontSize: '1rem', textAlign: 'center' }}>
//             Create your account to start your journey with us
//           </Typography>

//           {/* Form */}
//           <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
//             {/* Full Name */}
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="fullName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     placeholder="John Doe"
//                     {...field}
//                     error={!!errors.fullName}
//                     helperText={errors.fullName?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Email */}
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     placeholder="user@example.com"
//                     {...field}
//                     error={!!errors.email}
//                     helperText={errors.email?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Password */}
//             <Box sx={{ mb: 4 }}>
//               <Controller
//                 name="password"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Password"
//                     placeholder="********"
//                     type={showPassword ? 'text' : 'password'}
//                     {...field}
//                     error={!!errors.password}
//                     helperText={errors.password?.message}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton onClick={() => setShowPassword(!showPassword)}>
//                             <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Checkbox */}
//             <FormControlLabel
//               control={<Checkbox defaultChecked />}
//               label="I agree to privacy policy & terms"
//               sx={{ mb: 2 }}
//             />

//             {/* Submit Button */}
//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{ mb: 2, py: 1.2, fontWeight: 600, fontSize: '1rem' }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Signing Up...' : 'Sign Up'}
//             </Button>

//             {/* Sign In Link */}
//             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 }}>
//                 Already have an account?
//               </Typography>
//               <Typography component={LinkStyled} href="login">
//                 Sign In instead
//               </Typography>
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>
//     </AuthWrapper>
//   );
// };

// // ----------------------
// // Main App
// // ----------------------
// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <SignupPage />
//     </AuthProvider>
//   </ThemeProvider>
// );

// export default App;

















// 'use client'

// import React, { useState, createContext, useContext } from 'react';
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import Image from 'next/image';
// import theme from '@/styles/theme';
// import { createTheme } from '@mui/material/styles'; // Added for self-contained theme
// import Snackbar from '@mui/material/Snackbar';     // For displaying messages
// import MuiAlert from '@mui/material/Alert';       // For styling the Snackbar message

// // Context for Auth
// const AuthContext = createContext<any>(null);
// const useAuth = () => useContext(AuthContext);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const login = async ({ email, password, rememberMe }: any) =>
//     new Promise(resolve => setTimeout(resolve, 500));

//   const signup = async ({ name, email, password }: any) =>
//     new Promise(resolve => setTimeout(()=>{   showMessage('Successfully sing up in!', 'success'),,(resolve, 1000)});

//   return (
//     <AuthContext.Provider value={{ login, signup }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Styled components with responsive breakpoints
// const AuthWrapper = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: theme.palette.background.default,
//   padding: theme.spacing(3),
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(1),
//   },
// }));

// const AuthCard = styled(Card)(({ theme }) => ({
//   maxWidth: 420,
//   width: '100%',
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[4],
//   overflow: 'hidden',
//   [theme.breakpoints.down('sm')]: {
//     maxWidth: '95%',
//     boxShadow: theme.shadows[1],
//   },
// }));

// const LinkStyled = styled('a')(({ theme }) => ({
//   textDecoration: 'none',
//   color: `${theme.palette.primary.main} !important`,
//   fontWeight: 500,
//   '&:hover': { textDecoration: 'underline' },
// }));

// // Eye icon
// const Icon = ({ icon, fontSize = '1.25rem' }) => {
//   if (icon === 'tabler:eye') {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={fontSize}
//         height={fontSize}
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//         <circle cx="12" cy="12" r="3" />
//       </svg>
//     );
//   }

//   if (icon === 'tabler:eye-off') {
//     return (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width={fontSize}
//         height={fontSize}
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M10.585 10.587a2 2 0 0 0 2.828 2.83" />
//         <path d="M9.363 5.365A9.453 9.453 0 0 1 12 4c7 0 11 8 11 8a18.02 18.02 0 0 1-2.088 3.538" />
//         <path d="M3.284 3.286L1 12s4 8 11 8a18.02 18.02 0 0 0 4.538-.619" />
//         <line x1="3" y1="3" x2="21" y2="21" />
//       </svg>
//     );
//   }

//   return null;
// };

// // Alert component for Snackbar
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });
// const [message, setMessage] = useState('');
// const [messageType, setMessageType] = useState('success'); // 'success', 'error', 'info', 'warning'

// const showMessage = (msg, type = 'success') => {
//   setMessage(msg);
//   setMessageType(type);
// };

// const clearMessage = () => {
//   setMessage('');
// };

// // Validation
// const schema = yup.object({
//   fullName: yup.string().required('Full Name is required'),
//   email: yup.string().email('Enter a valid email').required('Email is required'),
//   password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
// });

// const SignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const auth = useAuth();
//   const muiTheme = useTheme();
//   const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));

//   const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
//     defaultValues: { fullName: '', email: '', password: '' },
 
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data: any) => {
//     await auth.signup({ name: data.fullName, email: data.email, password: data.password });
//     await auth.login({ email: data.email, password: data.password, rememberMe: true });
//   };

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent
//           sx={{
//             p: isSmallScreen ? 2 : 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image
//               src="/images/logo/logo.png"
//               alt="Tarmiye Logo"
//               width={isSmallScreen ? 40 : 50}
//               height={isSmallScreen ? 40 : 50}
//             />
//           </Box>

//           {/* Title */}
//           <Typography
//             variant="h6"
//             gutterBottom
//             sx={{
//               fontWeight: 'bold',
//               textAlign: 'center',
//               fontSize: isSmallScreen ? '1rem' : '1.25rem',
//             }}
//           >
//             Welcome to Tarmiye Dashboard
//           </Typography>
//           <Typography
//             sx={{
//               color: 'text.secondary',
//               mb: 1,
//               fontSize: isSmallScreen ? '0.875rem' : '1rem',
//               textAlign: 'center',
//             }}
//           >
//             Create your account to start your journey with us
//           </Typography>

//           {/* Form */}
//           <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
//             {/* Full Name */}
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="fullName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     placeholder="John Doe"
//                     {...field}
//                     error={!!errors.fullName}
//                     helperText={errors.fullName?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Email */}
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     placeholder="user@example.com"
//                     {...field}
//                     error={!!errors.email}
//                     helperText={errors.email?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Password */}
//             <Box sx={{ mb: 4 }}>
//               <Controller
//                 name="password"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Password"
//                     placeholder="********"
//                     type={showPassword ? 'text' : 'password'}
//                     {...field}
//                     error={!!errors.password}
//                     helperText={errors.password?.message}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton onClick={() => setShowPassword(!showPassword)}>
//                             <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Checkbox */}
//             <FormControlLabel
//               control={<Checkbox defaultChecked />}
//               label="I agree to privacy policy & terms"
//               sx={{ mb: 2 }}
//             />

//             {/* Submit Button */}
//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{
//                 mb: 2,
//                 py: 1.2,
//                 fontWeight: 600,
//                 fontSize: isSmallScreen ? '0.9rem' : '1rem',
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Signing Up...' : 'Sign Up'}
//             </Button>

//             {/* Sign In Link */}
//             <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 }}>
//                 Already have an account?
//               </Typography>
//               <Typography component={LinkStyled} href="login">
//                 Sign In instead
//               </Typography>
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>
//     </AuthWrapper>
//   );
// };

// // Main App
// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <SignupPage />
//     </AuthProvider>
//   </ThemeProvider>
// );

// export default App;



























































































































// 'use client'

// import React, { useState, createContext, useContext } from 'react';
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import * as yup from 'yup';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import Image from 'next/image';
// import theme from '@/styles/theme';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import { COLORS } from '@/styles/constants';
// import { AuthProvider } from '@/providers/AuthProvider';
// import { AuthWrapper, AuthCard, LinkStyled } from '../../../styles/AuthStyles';
// import {  signupSchema } from '@/app/utils/validationSchemas';
// import CommonSnackbar from '@/app/components/common/CustomSnackbar';
// import Icon from '@/app/components/common/CustomSnackbar';

// // import { useAuth } from '@/app/contexts/AuthContext';

// // ----------------------
// // Auth Context
// // ----------------------
// const AuthContext = createContext<any>(null);
// const useAuth = () => useContext(AuthContext);

// // const AuthProvider = ({ children }: { children: React.ReactNode }) => {
// //   const login = async ({ email, password, rememberMe }: any) =>
// //     new Promise(resolve => setTimeout(resolve, 500));

// //   const signup = async ({ name, email, password }: any) =>
// //     new Promise(resolve => setTimeout(resolve, 1000)); // Just simulates API delay

// //   return (
// //     <AuthContext.Provider value={{ login, signup }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // ----------------------
// // Styled Components
// // ----------------------
// // const AuthWrapper = styled(Box)(({ theme }) => ({
// //   minHeight: '100vh',
// //   display: 'flex',
// //   alignItems: 'center',
// //   justifyContent: 'center',
// //   backgroundColor: theme.palette.background.default,
// //   padding: theme.spacing(3),
// //   [theme.breakpoints.down('sm')]: {
// //     padding: theme.spacing(1),
// //   },
// // }));

// // const AuthCard = styled(Card)(({ theme }) => ({
// //   maxWidth: 420,
// //   width: '100%',
// //   borderRadius: theme.shape.borderRadius,
// //   boxShadow: theme.shadows[4],
// //   overflow: 'hidden',
// //   [theme.breakpoints.down('sm')]: {
// //     maxWidth: '95%',
// //     boxShadow: theme.shadows[1],
// //   },
// // }));

// // const LinkStyled = styled('a')(({ theme }) => ({
// //   textDecoration: 'none',
// //   color: `${theme.palette.primary.main} !important`,
// //   fontWeight: 500,
// //   '&:hover': { textDecoration: 'underline' },
// // }));

// // ----------------------
// // Eye Icon
// // ----------------------
// // const Icon = ({ icon, fontSize = '1.25rem' }) => {
// //   if (icon === 'tabler:eye') {
// //     return (
// //       <svg xmlns="http://www.w3.org/2000/svg" width={fontSize} height={fontSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
// //         <circle cx="12" cy="12" r="3" />
// //       </svg>
// //     );
// //   }

// //   if (icon === 'tabler:eye-off') {
// //     return (
// //       <svg xmlns="http://www.w3.org/2000/svg" width={fontSize} height={fontSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //         <path d="M10.585 10.587a2 2 0 0 0 2.828 2.83" />
// //         <path d="M9.363 5.365A9.453 9.453 0 0 1 12 4c7 0 11 8 11 8a18.02 18.02 0 0 1-2.088 3.538" />
// //         <path d="M3.284 3.286L1 12s4 8 11 8a18.02 18.02 0 0 0 4.538-.619" />
// //         <line x1="3" y1="3" x2="21" y2="21" />
// //       </svg>
// //     );
// //   }

// //   return null;
// // };

// // ----------------------
// // Alert for Snackbar
// // ----------------------
// const Alert = React.forwardRef(function Alert(props: any, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// // ----------------------
// // Validation Schema
// // ----------------------
// // const schema = yup.object({
// //   fullName: yup.string().required('Full Name is required'),
// //   email: yup.string().email('Enter a valid email').required('Email is required'),
// //   password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
// // });

// // ----------------------
// // Signup Page Component
// // ----------------------
// const SignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState<'success' | 'error'>('success');

//   const auth = useAuth();
//   const muiTheme = useTheme();
//   const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));

//   const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
//     defaultValues: { fullName: '', email: '', password: '' },
//     resolver: yupResolver(signupSchema),
//   });

//   const handleShowMessage = (msg: string, type: 'success' | 'error') => {
//     setMessage(msg);
//     setMessageType(type);
//   };

//   const handleCloseMessage = () => {
//     setMessage('');
//   };

//   const onSubmit = async (data: any) => {
//     try {
//       await auth.signup({ name: data.fullName, email: data.email, password: data.password });
//       handleShowMessage('Successfully signed up!', 'success');
//       await auth.login({ email: data.email, password: data.password, rememberMe: true });
//     } catch (error) {
//       handleShowMessage('Signup failed. Try again.', 'error');
//     }
//   };

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent
//           sx={{
//             p: isSmallScreen ? 2 : 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image
//               src="/images/logo/logo.png"
//               alt="Tarmiye Logo"
//               width={isSmallScreen ? 40 : 50}
//               height={isSmallScreen ? 40 : 50}
//             />
//           </Box>

//           {/* Title */}
//           <Typography
//             variant="h6"
//             gutterBottom
//             sx={{
//               fontWeight: 'bold',
//               textAlign: 'center',
//               fontSize: isSmallScreen ? '1rem' : '1.25rem',
//             }}
//           >
//             Welcome to Tarmiye Dashboard
//           </Typography>
//           <Typography
//             sx={{
//               color: 'text.secondary',
//               mb: 1,
//               fontSize: isSmallScreen ? '0.875rem' : '1rem',
//               textAlign: 'center',
//             }}
//           >
//             Create your account to start your journey with us
//           </Typography>

//           {/* Form */}
//           <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
//             {/* Full Name */}
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="fullName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     placeholder="John Doe"
//                     {...field}
//                     error={!!errors.fullName}
//                     helperText={errors.fullName?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Email */}
//             <Box sx={{ mb: 2 }}>
//               <Controller
//                 name="email"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     placeholder="user@example.com"
//                     {...field}
//                     error={!!errors.email}
//                     helperText={errors.email?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Password */}
//             <Box sx={{ mb: 4 }}>
//               <Controller
//                 name="password"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     fullWidth
//                     label="Password"
//                     placeholder="********"
//                     type={showPassword ? 'text' : 'password'}
//                     {...field}
//                     error={!!errors.password}
//                     helperText={errors.password?.message}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton onClick={() => setShowPassword(!showPassword)}>
//                             <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Checkbox */}
//             <FormControlLabel
//               control={<Checkbox defaultChecked />}
//               label="I agree to privacy policy & terms"
//               sx={{ mb: 2 }}
//             />

//             {/* Submit Button */}
//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{
//                 mb: 2,
//                 py: 1.2,
//                 fontWeight: 600,
//                 fontSize: isSmallScreen ? '0.9rem' : '1rem',
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Signing Up...' : 'Sign Up'}
//             </Button>

//             {/* Sign In Link */}
//             <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 }}>
//                 Already have an account?
//               </Typography>
//               <Typography component={LinkStyled} href="login">
//                 Sign In instead
//               </Typography>
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>

//       {/* Snackbar for messages */}
//       {/* <Snackbar
//         open={!!message}
//         autoHideDuration={3000}
//         onClose={handleCloseMessage}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseMessage} 
//         severity={messageType} 
//         sx={{
//            backgroundColor: messageType === 'success' ? '#ffffffff' : '#ffffffff', // custom green/red
//            color: messageType === 'success' ? COLORS.success : COLORS.warning,
//            fontWeight: 600
//   }}>
//           {message}
//         </Alert>
//       </Snackbar> */}


// <CommonSnackbar
//   open={!!message}
//   message={message}
//   severity={messageType}  // 'success' | 'error' | etc.
//   onClose={() => setMessage('')}
// />

//     </AuthWrapper>
//   );
// };

// // ----------------------
// // Main App
// // ----------------------
// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <SignupPage />
//     </AuthProvider>
//   </ThemeProvider>
// );

// export default App;





























































'use client'

import React, { useState, createContext, useContext } from 'react';
import { ThemeProvider, styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import theme from '@/styles/theme';
import MuiAlert from '@mui/material/Alert';
import { COLORS } from '@/styles/constants';
import { AuthProvider } from '@/providers/AuthProvider';
import { AuthWrapper, AuthCard, LinkStyled } from '../../../styles/AuthStyles';
import {  signupSchema } from '@/app/utils/validationSchemas';
import CommonSnackbar from '@/app/components/common/CustomSnackbar';
import Icon from '@/app/components/common/Icon';
import { useAuth } from '@/app/contexts/AuthContext';  
import { useRouter } from 'next/navigation'; // CORRECT for App Router


// ----------------------
// Auth Context
// ----------------------
// const AuthContext = createContext<any>(null);
// const useAuth = () => useContext(AuthContext);



// ----------------------
// Alert for Snackbar
// ----------------------
const Alert = React.forwardRef(function Alert(props: any, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


// ----------------------
// Signup Page Component
// ----------------------
const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const auth = useAuth();
  const muiTheme = useTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    // defaultValues: { name: '', email: '', password: '' },
    defaultValues: {name: '', email: '', password: '', password_confirm: '' },
    resolver: yupResolver(signupSchema),
  });

  const handleShowMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleCloseMessage = () => {
    setMessage('');
  };

  // const onSubmit = async (data: any) => {
  //   try {
  //     await auth.signup({ name: data.fullName, email: data.email, password: data.password });
  //     handleShowMessage('Successfully signed up!', 'success');
  //     await auth.login({ email: data.email, password: data.password, rememberMe: true });
  //   } catch (error) {
  //     handleShowMessage('Signup failed. Try again.', 'error');
  //   }
  // };
 

const router = useRouter(); // Initialize the router
  // const onSubmit = async (data: any) => {
  //   try {
  //     // The auth.signup function in AuthProvider now handles calling the API and updating the context
  //     await auth.signup({ name: data.name, email: data.email, password: data.password, password_confirm: data.password_confirm, });
  //     handleShowMessage('Successfully signed up and logged in!', 'success');
  //     // The router.replace to dashboard should be handled by AuthProvider's login function
  //     router.replace('/auth/login')
  //   } catch (error: any) {
  //     console.error("SignupPage onSubmit error:", error);
  //     const errorMessage = error.message || 'Signup failed. Please try again.';

  //     // Attempt to parse specific error messages from the backend if available
  //     if (error.response && error.response.data && error.response.data.message) {
  //       if (typeof error.response.data.message === 'string') {
  //         handleShowMessage(error.response.data.message, 'error');
  //       } else if (Array.isArray(error.response.data.message)) {
  //         // If the backend sends an array of messages (e.g., validation errors)
  //         handleShowMessage(error.response.data.message.join(', '), 'error');
  //       } else {
  //         handleShowMessage(errorMessage, 'error');
  //       }
  //     } else {
  //       handleShowMessage(errorMessage, 'error');
  //     }
  //   }
  // };
const onSubmit = async (data: any) => {
    try {
      await auth.signup({ name: data.name, email: data.email, password: data.password, password_confirm: data.password_confirm, });
      handleShowMessage('Successfully signed up!', 'success');
      // Redirect to login page after successful signup.
      router.replace('/auth/login');
    } catch (error: any) {
      // This catch block now receives the friendly error message directly.
      console.error("SignupPage onSubmit error:", error);
      handleShowMessage(error.message, 'error');
    }
  };
  return (
    <AuthWrapper>
      <AuthCard>
        <CardContent
          sx={{
            p: isSmallScreen ? 2 : 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <Image
              src="/images/logo/logo.png"
              alt="Tarmiye Logo"
              width={isSmallScreen ? 40 : 50}
              height={isSmallScreen ? 40 : 50}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: isSmallScreen ? '1rem' : '1.25rem',
            }}
          >
            Welcome to Tarmiye Dashboard
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 1,
              fontSize: isSmallScreen ? '0.875rem' : '1rem',
              textAlign: 'center',
            }}
          >
            Create your account to start your journey with us
          </Typography>

          {/* Form */}
          <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            {/* Full Name */}
            <Box sx={{ mb: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="name"
                    placeholder="John Doe"
                    {...field}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="user@example.com"
                    {...field}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 4 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Password"
                    placeholder="********"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Confirm Password */}
<Box sx={{ mb: 4 }}>
  <Controller
    name="password_confirm"
    control={control}
    render={({ field }) => (
      <TextField
        fullWidth
        label="Confirm Password"
        placeholder="********"
        type={showPasswordConfirm ? 'text' : 'password'}
        {...field}
        error={!!errors.password_confirm}
        helperText={errors.password_confirm?.message}
         InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                            <Icon icon={showPasswordConfirm ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
      />
    )}
  />
</Box>


            {/* Checkbox */}
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="I agree to privacy policy & terms"
              sx={{ mb: 2 }}
            />

            {/* Submit Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mb: 2,
                py: 1.2,
                fontWeight: 600,
                fontSize: isSmallScreen ? '0.9rem' : '1rem',
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>

            {/* Sign In Link */}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ color: 'text.secondary', mr: 1 }}>
                Already have an account?
              </Typography>
              <Typography component={LinkStyled} href="login">
                Sign In instead
              </Typography>
            </Box>
          </form>
        </CardContent>
      </AuthCard>

    

<CommonSnackbar
  open={!!message}
  message={message}
  severity={messageType}  // 'success' | 'error' | etc.
  onClose={() => setMessage('')}
/>

    </AuthWrapper>
  );
};

// ----------------------
// Main App
// ----------------------
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <SignupPage />
    </AuthProvider>
  </ThemeProvider>
);

export default App;


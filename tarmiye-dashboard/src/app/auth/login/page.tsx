// 'use client'

// import React, { useState, useContext, useMemo } from 'react'
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles'
// import CssBaseline from '@mui/material/CssBaseline'
// import Button from '@mui/material/Button'
// import Checkbox from '@mui/material/Checkbox'
// import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import * as yup from 'yup'
// import { useForm, Controller } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import Image from 'next/image'
// import Link from 'next/link'
// import theme from '@/styles/theme'

// // Context & mock auth functions
// const AuthContext = React.createContext(null)
// const useAuth = () => useContext(AuthContext)
// const AuthProvider = ({ children }) => {
//   const login = ({ email, password, rememberMe }) => {
//     console.log('Simulating login:', { email, password, rememberMe })
//     return new Promise((resolve) => setTimeout(resolve, 500))
//   }
//   const auth = useMemo(() => ({ login }), [])
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
// }

// // Styled components
// const AuthWrapper = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: theme.palette.background.default,
//   padding: theme.spacing(3),
// }))

// const AuthCard = styled(Card)(({ theme }) => ({
//   maxWidth: 420,
//   width: '100%',
//   borderRadius: theme.shape.borderRadius ,
//   boxShadow: theme.shadows[4],
//   overflow: 'hidden',
// }))

// const LinkStyled = styled('a')(({ theme }) => ({
//   textDecoration: 'none',
//   color: `${theme.palette.primary.main} !important`,
//   fontWeight: 500,
//   cursor: 'pointer',
//   '&:hover': { textDecoration: 'underline' },
// }))

// // Icons for show/hide password
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
//     )
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
//     )
//   }
//   return null
// }

// // Validation schema
// const schema = yup.object().shape({
//   email: yup.string().email('Enter a valid email').required('Email is required'),
//   password: yup.string().required('Password is required'),
// })

// interface FormData {
//   email: string
//   password: string
//   rememberMe: boolean
// }

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const auth = useAuth()
//   const theme = useTheme()

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     defaultValues: { email: '', password: '', rememberMe: true },
//     mode: 'onBlur',
//     resolver: yupResolver(schema),
//   })

//   const onSubmit = async (data: FormData) => {
//     try {
//       await auth.login(data)
//       // TODO: Redirect or do something after login
//       console.log('Logged in successfully:', data)
//     } catch (error) {
//       console.error('Login failed:', error)
//     }
//   }

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent
//           sx={{
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image src="/images/logo/logo.png" alt="Tarmiye Logo" width={50} height={50} />
//           </Box>

//           {/* Title */}
//           <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//             Welcome Back to Tarmiye Dashboard
//           </Typography>

//           <Typography
//             sx={{
//               color: 'text.secondary',
//               mb: 1,
//               fontSize: '1rem',
//               textAlign: 'center',
//             }}
//           >
//             Please login to your account
//           </Typography>

//           {/* Form */}
//           <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
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
//                     error={Boolean(errors.password)}
//                     helperText={errors.password?.message}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             edge="end"
//                             onMouseDown={(e) => e.preventDefault()}
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             <Icon fontSize="1.25rem" icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             {/* <FormControlLabel
//               control={<Controller
//                 name="rememberMe"
//                 control={control}
//                 render={({ field }) => <Checkbox {...field} checked={field.value} />}
//               />}
//               label="Remember me"
//               sx={{ mb: 3 }}
//             /> */}

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
//               {isSubmitting ? 'Logging In...' : 'Log In'}
//             </Button>

//             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 }}>Don't have an account?</Typography>
           
//                 <Typography component={LinkStyled} href="singup" >Sign Up here</Typography>
              
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>
//     </AuthWrapper>
//   )
// }

// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <LoginPage />
//     </AuthProvider>
//   </ThemeProvider>
// )

// export default App










// 'use client'

// import React, { useState, useContext, useMemo } from 'react'
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles'
// import CssBaseline from '@mui/material/CssBaseline'
// import Button from '@mui/material/Button'
// import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import * as yup from 'yup'
// import { useForm, Controller } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import Image from 'next/image'
// import theme from '@/styles/theme'
// import Snackbar from '@mui/material/Snackbar'
// import MuiAlert from '@mui/material/Alert'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { COLORS } from '@/styles/constants';
// // ----------------------
// // Context & mock auth functions
// // ----------------------
// const AuthContext = React.createContext(null)
// const useAuth = () => useContext(AuthContext)
// const AuthProvider = ({ children }) => {
//   const login = ({ email, password, rememberMe }) => {
//     console.log('Simulating login:', { email, password, rememberMe })
//     return new Promise((resolve) => setTimeout(resolve, 1000)) // mock API
//   }
//   const auth = useMemo(() => ({ login }), [])
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
// }

// // ----------------------
// // Styled components
// // ----------------------
// const AuthWrapper = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: theme.palette.background.default,
//   padding: theme.spacing(3),
// }))

// const AuthCard = styled(Card)(({ theme }) => ({
//   maxWidth: 420,
//   width: '100%',
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[4],
//   overflow: 'hidden',
// }))

// const LinkStyled = styled('a')(({ theme }) => ({
//   textDecoration: 'none',
//   color: `${theme.palette.primary.main} !important`,
//   fontWeight: 500,
//   cursor: 'pointer',
//   '&:hover': { textDecoration: 'underline' },
// }))

// // ----------------------
// // Icons for show/hide password
// // ----------------------
// const Icon = ({ icon, fontSize = '1.25rem' }) => {
//   if (icon === 'tabler:eye') {
//     return (
//       <svg xmlns="http://www.w3.org/2000/svg" width={fontSize} height={fontSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//         <circle cx="12" cy="12" r="3" />
//       </svg>
//     )
//   }

//   if (icon === 'tabler:eye-off') {
//     return (
//       <svg xmlns="http://www.w3.org/2000/svg" width={fontSize} height={fontSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M10.585 10.587a2 2 0 0 0 2.828 2.83" />
//         <path d="M9.363 5.365A9.453 9.453 0 0 1 12 4c7 0 11 8 11 8a18.02 18.02 0 0 1-2.088 3.538" />
//         <path d="M3.284 3.286L1 12s4 8 11 8a18.02 18.02 0 0 0 4.538-.619" />
//         <line x1="3" y1="3" x2="21" y2="21" />
//       </svg>
//     )
//   }
//   return null
// }

// // ----------------------
// // Alert Component
// // ----------------------
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
// })

// // ----------------------
// // Validation schema
// // ----------------------
// const schema = yup.object().shape({
//   email: yup.string().email('Enter a valid email').required('Email is required'),
//   password: yup.string().required('Password is required'),
// })

// // ----------------------
// // Login Page Component
// // ----------------------
// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [message, setMessage] = useState('')
//   const [messageType, setMessageType] = useState<'success' | 'error'>('success')

//   const auth = useAuth()
//   const muiTheme = useTheme()
//   const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: { email: '', password: '', rememberMe: true },
//     mode: 'onBlur',
//     resolver: yupResolver(schema),
//   })

//   const handleShowMessage = (msg: string, type: 'success' | 'error') => {
//     setMessage(msg)
//     setMessageType(type)
//   }

//   const handleCloseMessage = () => {
//     setMessage('')
//   }

//   const onSubmit = async (data) => {
//     try {
//       await auth.login(data)
//       handleShowMessage('Login successful!', 'success')
//     } catch (error) {
//       handleShowMessage('Login failed. Try again.', 'error')
//     }
//   }

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image src="/images/logo/logo.png" alt="Tarmiye Logo" width={50} height={50} />
//           </Box>

//           {/* Title */}
//           <Typography
//   variant="h6"
//   gutterBottom
//   sx={{
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: isMobile ? '0.9rem' : '1.25rem',   // smaller on mobile
//   }}
// >
//   Welcome Back to Tarmiye Dashboard
// </Typography>
//           <Typography
//   sx={{
//     color: 'text.secondary',
//     mb: 1,
//     fontSize: isMobile ? '0.85rem' : '1rem',   // smaller subtitle
//     textAlign: 'center',
//   }}
// >
//   Please login to your account
// </Typography>


//           {/* Form */}
//           <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
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
//                     error={Boolean(errors.password)}
//                     helperText={errors.password?.message}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             edge="end"
//                             onMouseDown={(e) => e.preventDefault()}
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             <Icon fontSize="1.25rem" icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{
//                 mb: 2,
//                 py: 1.2,
//                 fontWeight: 600,
//                 fontSize: '1rem',
//                 borderRadius: muiTheme.shape.borderRadius,
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Logging In...' : 'Log In'}
//             </Button>

//             <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 , fontSize: isMobile ? '0.8rem' : '1rem',}}>Don't have an account?</Typography>
//               <Typography component={LinkStyled} href="singup" sx={{ fontSize: isMobile ? '0.8rem' : '1rem', }}>
//                 Sign Up here
//               </Typography>
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>

//       {/* Snackbar for messages */}
//       <Snackbar
//         open={!!message}
//         autoHideDuration={3000}
//         onClose={handleCloseMessage}
//         anchorOrigin={{
//           vertical: isMobile ? 'top' : 'top',
//           horizontal: 'center',
//         }}
//       >
//         <Alert
//           onClose={handleCloseMessage}
//           severity={messageType}
//           sx={{
//            backgroundColor: messageType === 'success' ? '#ffffffff' : '#ffffffff', // custom green/red
//            color: messageType === 'success' ? COLORS.success : COLORS.warning,
//             fontWeight: 600,
//           }}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </AuthWrapper>
//   )
// }

// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <LoginPage />
//     </AuthProvider>
//   </ThemeProvider>
// )

// export default App













































































// 'use client'

// import React, { useState, useContext, useMemo } from 'react'
// import { ThemeProvider, styled, useTheme } from '@mui/material/styles'
// import CssBaseline from '@mui/material/CssBaseline'
// import Button from '@mui/material/Button'
// import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import InputAdornment from '@mui/material/InputAdornment'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import * as yup from 'yup'
// import { useForm, Controller } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import Image from 'next/image'
// import theme from '@/styles/theme'
// import Snackbar from '@mui/material/Snackbar'
// import MuiAlert from '@mui/material/Alert'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { COLORS } from '@/styles/constants';
// import { AuthProvider } from '@/providers/AuthProvider';
// import { AuthWrapper, AuthCard, LinkStyled } from '../../../styles/AuthStyles';
// import {  loginSchema } from '@/app/utils/validationSchemas';
// import CommonSnackbar from '@/app/components/common/CustomSnackbar';
// import Icon from '@/app/components/common/Icon';
//  import { useAuth } from '@/app/contexts/AuthContext';  


// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [message, setMessage] = useState('')
//   const [messageType, setMessageType] = useState<'success' | 'error'>('success')

//   const auth = useAuth()
//   const muiTheme = useTheme()
//   const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: { email: '', password: '' },
//     mode: 'onBlur',
//     resolver: yupResolver(loginSchema),
//   })

//   const handleShowMessage = (msg: string, type: 'success' | 'error') => {
//     setMessage(msg)
//     setMessageType(type)
//   }

//   const handleCloseMessage = () => {
//     setMessage('')
//   }
// type LoginFormData = {
//   email: string
//   password: string
// }

// const onSubmit = async (data: LoginFormData) => {
//   try {
//     await auth.login(data)
//     handleShowMessage('Login successful!', 'success')
//   } catch (error) {
//     handleShowMessage('Login failed. Try again.', 'error')
//   }
// }

//   // const onSubmit = async (data) => {
//   //   try {
//   //     await auth.login(data)
//   //     handleShowMessage('Login successful!', 'success')
//   //   } catch (error) {
//   //     handleShowMessage('Login failed. Try again.', 'error')
//   //   }
//   // }

//   return (
//     <AuthWrapper>
//       <AuthCard>
//         <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           {/* Logo */}
//           <Box sx={{ mb: 2 }}>
//             <Image src="/images/logo/logo.png" alt="Tarmiye Logo" width={50} height={50} />
//           </Box>

//           {/* Title */}
//           <Typography
//   variant="h6"
//   gutterBottom
//   sx={{
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: isMobile ? '0.9rem' : '1.25rem',   // smaller on mobile
//   }}
// >
//   Welcome Back to Tarmiye Dashboard
// </Typography>
//           <Typography
//   sx={{
//     color: 'text.secondary',
//     mb: 1,
//     fontSize: isMobile ? '0.85rem' : '1rem',   // smaller subtitle
//     textAlign: 'center',
//   }}
// >
//   Please login to your account
// </Typography>


//           {/* Form */}
//           <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
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
//                     error={Boolean(errors.password)}
//                     helperText={errors.password?.message}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             edge="end"
//                             onMouseDown={(e) => e.preventDefault()}
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             <Icon fontSize="1.25rem" icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Box>

//             <Button
//               fullWidth
//               type="submit"
//               variant="contained"
//               sx={{
//                 mb: 2,
//                 py: 1.2,
//                 fontWeight: 600,
//                 fontSize: '1rem',
//                 borderRadius: muiTheme.shape.borderRadius,
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Logging In...' : 'Log In'}
//             </Button>

//             <Box sx={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
//               <Typography sx={{ color: 'text.secondary', mr: 1 , fontSize: isMobile ? '0.8rem' : '1rem',}}>Do not have an account?</Typography>
//               <Typography component={LinkStyled} href="singup" sx={{ fontSize: isMobile ? '0.8rem' : '1rem', }}>
//                 Sign Up here
//               </Typography>
//             </Box>
//           </form>
//         </CardContent>
//       </AuthCard>

//       {/* Snackbar for messages */}
//       <CommonSnackbar
//   open={!!message}
//   message={message}
//   severity={messageType}  // 'success' | 'error' | etc.
//   onClose={() => setMessage('')}
// />

//     </AuthWrapper>
//   )
// }

// const App = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <AuthProvider>
//       <LoginPage />
//     </AuthProvider>
//   </ThemeProvider>
// )

// export default App












































'use client'

import React, { useState, useContext, useMemo } from 'react'
import { ThemeProvider, styled, useTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import theme from '@/styles/theme'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import useMediaQuery from '@mui/material/useMediaQuery'
import { COLORS } from '@/styles/constants';
import { AuthProvider } from '@/providers/AuthProvider';
import { AuthWrapper, AuthCard, LinkStyled } from '../../../styles/AuthStyles';
import { loginSchema } from '@/app/utils/validationSchemas';
import CommonSnackbar from '@/app/components/common/CustomSnackbar';
import Icon from '@/app/components/common/Icon';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const auth = useAuth()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
  })

  // const handleShowMessage = (msg: string, type: 'success' | 'error') => {
  //   setMessage(msg)
  //   setMessageType(type)
  // }

  const handleCloseMessage = () => {
    setMessage('')
  }
  type LoginFormData = {
    email: string
    password: string
  }

  // const onSubmit = async (data: LoginFormData) => {
  //   try {
  //     await auth.login(data)
  //     handleShowMessage('Login successful!', 'success')
  //   } catch (error: any) {
  //     // Catch the specific error message from the AuthProvider and display it
  //     handleShowMessage(error.message, 'error')
  //   }
  // }
 const handleShowMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
  }
const router = useRouter();
  const onSubmit = async (data: any) => {
    try {
      await auth.login(data)
      handleShowMessage('Login successful!', 'success')
      router.replace('/dashboard');
    } catch (error: any) {
      // Catch the specific error message and display it in the snackbar
      handleShowMessage(error.message, 'error')
      
      // Log the full error to the console for developers, without causing a full-page error overlay.
      console.error("Login failed:", error);
    }
  }



  return (
    <AuthWrapper>
      <AuthCard>
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <Image src="/images/logo/logo.png" alt="Tarmiye Logo" width={50} height={50} />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: isMobile ? '0.9rem' : '1.25rem',
            }}
          >
            Welcome Back to Tarmiye Dashboard
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              mb: 1,
              fontSize: isMobile ? '0.85rem' : '1rem',
              textAlign: 'center',
            }}
          >
            Please login to your account
          </Typography>


          {/* Form */}
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
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
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Box>

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
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon fontSize="1.25rem" icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mb: 2,
                py: 1.2,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: muiTheme.shape.borderRadius,
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ color: 'text.secondary', mr: 1, fontSize: isMobile ? '0.8rem' : '1rem', }}>Do not have an account?</Typography>
              <Typography component={LinkStyled} href="singup" sx={{ fontSize: isMobile ? '0.8rem' : '1rem', }}>
                Sign Up here
              </Typography>
            </Box>
          </form>
        </CardContent>
      </AuthCard>

      {/* Snackbar for messages */}
      <CommonSnackbar
        open={!!message}
        message={message}
        severity={messageType}
        onClose={() => setMessage('')}
      />

    </AuthWrapper>
  )
}

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  </ThemeProvider>
)

export default App

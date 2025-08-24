// // src/app/auth/layout.tsx
// import React from 'react';
// import { Box, Paper, Typography, Container } from '@mui/material';
// import Image from 'next/image';
// import { COLORS } from '@/styles/constants';

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: COLORS.background, // Use your defined background color
//         padding: 2,
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           padding: 4,
//           borderRadius: 3,
//           width: '100%',
//           maxWidth: 450, // Max width for auth forms
//           textAlign: 'center',
//         }}
//       >
//         <Image
//           src='/images/logo/logo.png' // Ensure this path is correct in your public/images/logo folder
//           alt="Tarmiye Logo"
//           width={60}
//           height={60}
//           style={{ marginBottom: '16px' }}
//         />
//         <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
//           Welcome to Tarmiye Dashboard
//         </Typography>
//         {children}
//       </Paper>
//     </Box>
//   );
// }






// src/app/auth/layout.tsx
import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import Image from 'next/image'
import { COLORS } from '@/styles/constants'
import { AuthProvider } from '@/providers/AuthProvider' // Import your AuthProvider

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
          padding: 2,
        }}
      >
       
         
          {children}
        
      </Box>
    </AuthProvider>
  )
}


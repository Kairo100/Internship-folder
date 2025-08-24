// // // src/app/layout.tsx
// // import { Inter } from 'next/font/google';
// // import ThemeRegistry from '@/styles/ThemeRegistry';
// // import { AuthProvider } from '@/providers/AuthProvider'; // Your Auth Provider

// // const inter = Inter({ subsets: ['latin'] });

// // export const metadata = {
// //   title: 'Tarmiye Dashboard',
// //   description: 'Modern Dashboard for Tarmiye App',
// // };

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en" className={inter.className}>
// //       <body>
// //         {/* ThemeRegistry provides Material UI theme and CSS baseline */}
// //         <ThemeRegistry options={{ key: 'mui' }}>
// //           {/* AuthProvider manages global authentication state */}
// //           <AuthProvider>
// //             {children}
// //           </AuthProvider>
// //         </ThemeRegistry>
// //       </body>
// //     </html>
// //   );
// // }
// // app/layout.tsx

// import React from 'react';
// import { AuthProvider } from './hooks/useAuth'; // Adjust path as needed based on your project structure
// // import './globals.css'; // Assuming you have global styles

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <AuthProvider> {/* <--- WRAP YOUR CHILDREN WITH AuthProvider */}
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }















'use client';

import { AuthProvider } from '@/providers/AuthProvider'; // or wherever your provider is
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

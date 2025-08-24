// // src/app/page.tsx
// 'use client'; // This is a Client Component

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/app/contexts/AuthContext'; // Your Auth Hook
// import Spinner from './components/spinner';

// export default function HomePage() {
//   const { isAuthenticated, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (isAuthenticated) {
//         router.replace('/dashboard'); // Redirect to dashboard if authenticated
//       } else {
//         router.replace('/auth/login'); // Redirect to login if not authenticated
//       }
//     }
//   }, [isAuthenticated, loading, router]);

//   // Show spinner while authentication status is being determined
//   if (loading) {
//     return <Spinner />;
//   }

//   // This component will likely not be seen by the user for long,
//   // as the redirect happens quickly.
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <Spinner />
//     </div>
//   );
// }
// src/app/page.tsx
'use client'; // This is a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Spinner from './components/spinner';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // The redirect logic has been removed from here.
  // It is now handled exclusively by the AuthProvider.
  // This prevents the redirect conflict.

  if (loading) {
    return <Spinner />;
  }

  // If not loading, but not authenticated, the AuthProvider will handle the redirect.
  // This page will not be displayed for long.
  // This is a fail-safe; in most cases, the AuthProvider will have already redirected.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Welcome!</h1>
    </div>
  );
}
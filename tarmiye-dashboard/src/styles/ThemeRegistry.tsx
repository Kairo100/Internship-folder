// // src/styles/ThemeRegistry.tsx
// 'use client'; // This component must be a Client Component

// import * as React from 'react';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import theme from '@/styles/theme';


// // Create a cache for Emotion to inject styles
// // This is important for Material UI's styling to work correctly with Next.js
// const createEmotionCache = () => {
//   return createCache({ key: 'css', prepend: true }); // `prepend: true` ensures MUI styles are injected first
// };

// export default function ThemeRegistry(props: { options: any; children: React.ReactNode }) {
//   const { options, children } = props;

//   // Lazily create the emotion cache once
//   const emotionCache = React.useMemo(() => createEmotionCache(), []);

//   return (
//     <CacheProvider value={emotionCache}>
//       <ThemeProvider theme={theme}>
//         {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </CacheProvider>
//   );
// }


//styles/ThemeRegistry
'use client'; // This component must be a Client Component

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import theme from '@/styles/theme';


// Create a cache for Emotion to inject styles
// This is important for Material UI's styling to work correctly with Next.js
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true }); // `prepend: true` ensures MUI styles are injected first
};

export default function ThemeRegistry(props: { options: any; children: React.ReactNode }) {
  const { options, children } = props;

  // Lazily create the emotion cache once
  const emotionCache = React.useMemo(() => createEmotionCache(), []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

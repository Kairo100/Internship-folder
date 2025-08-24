// // src/styles/theme.ts
// 'use client'; // This file needs to be a Client Component for Material UI theme setup

// import { createTheme } from '@mui/material/styles';
// import { Inter } from 'next/font/google'; // Import Inter font
// import { COLORS, FONTS } from './constants';

// // Configure Inter font
// const inter = Inter({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: COLORS.primary,
//     },
//     secondary: {
//       main: COLORS.secondary,
//     },
//     background: {
//       default: COLORS.background,
//       paper: COLORS.paper,
//     },
//     text: {
//       primary: COLORS.textPrimary,
//       secondary: COLORS.textSecondary,
//     },
//     success: {
//       main: COLORS.success,
//     },
//     error: {
//       main: COLORS.error,
//     },
//     warning: {
//       main: COLORS.warning,
//     },
//     info: {
//       main: COLORS.info,
//     },
//   },
//   typography: {
//     fontFamily: FONTS.primary, // Set primary font family
//     h1: {
//       fontFamily: FONTS.heading,
//       fontSize: '2.5rem',
//       fontWeight: 700,
//     },
//     h2: {
//       fontFamily: FONTS.heading,
//       fontSize: '2rem',
//       fontWeight: 600,
//     },
//     // Add other typography variants as needed
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8, // Rounded corners for buttons
//           textTransform: 'none', // Keep original casing
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12, // More rounded corners for Paper components (cards, dialogs)
//           boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Subtle shadow
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 8, // Rounded corners for text fields
//           },
//         },
//       },
//     },
//   },
// });

// export default theme;








// //styles/theme.ts
// 'use client'; // This file needs to be a Client Component for Material UI theme setup

// import { createTheme } from '@mui/material/styles';
// import { Inter } from 'next/font/google'; // Import Inter font
// import { COLORS, FONTS } from './constants';

// // Configure Inter font
// const inter = Inter({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

// // Extend the Palette interface to include customColors
// declare module '@mui/material/styles' {
//   interface Palette {
//     customColors?: { // Make customColors optional to avoid breaking existing code
//       main: string;
//     };
//   }
//   interface PaletteOptions {
//     customColors?: {
//       main: string;
//     };
//   }
// }

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: COLORS.primary,
//     },
//     secondary: {
//       main: COLORS.secondary,
//     },
//     background: {
//       default: COLORS.background,
//       paper: COLORS.paper,
//     },
//     text: {
//       primary: COLORS.textPrimary,
//       secondary: COLORS.textSecondary,
//     },
//     success: {
//       main: COLORS.success,
//     },
//     error: {
//       main: COLORS.error,
//     },
//     warning: {
//       main: COLORS.warning,
//     },
//     info: {
//       main: COLORS.info,
//     },
//     // Define customColors here
//     customColors: {
//       main: COLORS.primary, // Or any other color from COLORS that makes sense for your custom color
//     },
//   },
//   typography: {
//     fontFamily: FONTS.primary, // Set primary font family
//     h1: {
//       fontFamily: FONTS.heading,
//       fontSize: '2.5rem',
//       fontWeight: 700,
//     },
//     h2: {
//       fontFamily: FONTS.heading,
//       fontSize: '2rem',
//       fontWeight: 600,
//     },
//     // Add other typography variants as needed
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8, // Rounded corners for buttons
//           textTransform: 'none', // Keep original casing
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12, // More rounded corners for Paper components (cards, dialogs)
//           boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Subtle shadow
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 8, // Rounded corners for text fields
//           },
//         },
//       },
//     },
//   },
// });

// export default theme;
// // styles/theme.ts
// 'use client'; // This file needs to be a Client Component for Material UI theme setup

// import { createTheme } from '@mui/material/styles';
// import { Inter } from 'next/font/google'; // Import Inter font
// import { COLORS, FONTS } from './constants'; // Import your custom constants

// // Configure Inter font
// const inter = Inter({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

// // Extend the Palette interface to include customColors
// declare module '@mui/material/styles' {
//   interface Palette {
//     customColors?: { // Make customColors optional to avoid breaking existing code
//       bodyBg: string;
//     };
//   }
//   interface PaletteOptions {
//     customColors?: {
//       bodyBg: string;
//     };
//   }
// }

// const theme = createTheme({
//   palette: {
//     mode: 'light', // Set the overall palette mode to light
//     primary: {
//       main: COLORS.primary,
//     },
//     secondary: {
//       main: COLORS.secondary,
//     },
//     background: {
//       default: COLORS.background, // Set default background from constants
//       paper: COLORS.paper,      // Set paper background from constants
//     },
//     text: {
//       primary: COLORS.textPrimary,
//       secondary: COLORS.textSecondary,
//       disabled: COLORS.textDisabled,
//     },
//     success: {
//       main: COLORS.success,
//     },
//     error: {
//       main: COLORS.error,
//     },
//     warning: {
//       main: COLORS.warning,
//     },
//     info: {
//       main: COLORS.info,
//     },
//     // Define customColors here
//     customColors: {
//       bodyBg: COLORS.bodyBg, // Use your custom body background color
//     },
//   },
//   typography: {
//     fontFamily: FONTS.primary, // Set primary font family from constants
//     h1: { // Retained from your first example
//       fontFamily: FONTS.heading,
//       fontSize: '2.5rem',
//       fontWeight: 700,
//     },
//     h2: { // Retained from your first example
//       fontFamily: FONTS.heading,
//       fontSize: '2rem',
//       fontWeight: 600,
//     },
//     h3: { // Added from your second example
//       fontSize: '2.125rem',
//       lineHeight: 1.235,
//       letterSpacing: '0.00735em',
//     },
//     h4: { // Added from your second example
//       fontSize: '1.5rem',
//       lineHeight: 1.235,
//       letterSpacing: '0.00735em',
//     },
//     // Add other typography variants as needed
//   },
//   shape: {
//     borderRadius: 8, // Default border radius from your second example
//   },
//   shadows: [ // Shadows array from your second example
//     'none', // 0
//     '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)', // 1
//     '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)', // 2
//     '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)', // 3
//     '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)', // 4 (Added to fill gap)
//     '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)', // 5 (Added to fill gap)
//     '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)', // 6
//     // You can add more shadows up to 24 if needed
//   ],
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px', // Apply rounded corners to buttons
//           textTransform: 'none', // Keep original casing (from first example)
//         },
//       },
//     },
//     MuiCard: { // Added from your second example
//       styleOverrides: {
//         root: {
//           borderRadius: '16px', // Apply rounded corners to cards
//         },
//       },
//     },
//     MuiPaper: { // Retained from your first example, slightly adjusted for consistency
//       styleOverrides: {
//         root: {
//           borderRadius: 12, // More rounded corners for Paper components (cards, dialogs)
//           boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Subtle shadow
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '8px', // Apply rounded corners to text fields
//           },
//         },
//       },
//     },
//   },
// });

// // export default theme;
// 'use client';

// import React, { useMemo } from 'react';
// import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
// import { Inter } from 'next/font/google';

// // Load Inter font
// const inter = Inter({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

// // Augment Palette to support customColors
// declare module '@mui/material/styles' {
//   interface Palette {
//     customColors?: {
//       bodyBg: string;
//     };
//   }
//   interface PaletteOptions {
//     customColors?: {
//       bodyBg: string;
//     };
//   }
// }

// export default function ThemePage({ children }: { children: React.ReactNode }) {
//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: 'light',
//           primary: {
//             main: '#500dc5ff', // Vibrant purple
//           },
//           secondary: {
//             main: '#8A8D93',
//           },
//           text: {
//             primary: 'rgba(58, 53, 65, 0.87)',
//             secondary: 'rgba(58, 53, 65, 0.68)',
//             disabled: 'rgba(58, 53, 65, 0.38)',
//           },
//           background: {
//             default: '#F4F5FA',
//             paper: '#FFFFFF',
//           },
//           customColors: {
//             bodyBg: '#F4F5FA',
//           },
//         },
//         typography: {
//           fontFamily: inter.style.fontFamily,
//           h3: {
//             fontSize: '2.125rem',
//             lineHeight: 1.235,
//             letterSpacing: '0.00735em',
//           },
//           h4: {
//             fontSize: '1.5rem',
//             lineHeight: 1.235,
//             letterSpacing: '0.00735em',
//           },
//         },
//         shape: {
//           borderRadius: 8,
//         },
//         shadows: [
//           'none',
//           '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
//           '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
//           '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
//           '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
//           '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
//           '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
//         ],
//         components: {
//           MuiButton: {
//             styleOverrides: {
//               root: {
//                 borderRadius: '8px',
//               },
//             },
//           },
//           MuiCard: {
//             styleOverrides: {
//               root: {
//                 borderRadius: '16px',
//               },
//             },
//           },
//           MuiTextField: {
//             styleOverrides: {
//               root: {
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '8px',
//                 },
//               },
//             },
//           },
//         },
//       }),
//     []
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       {children}
//     </ThemeProvider>
//   );
// }





















// import { createTheme } from '@mui/material/styles';
// import { Montserrat } from 'next/font/google';
// import { COLORS, FONTS } from './constants'; // Import your custom constants
// // Load Inter font
// const inter = Montserrat({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

// // Augment Palette to support customColors
// declare module '@mui/material/styles' {
//   interface Palette {
//     customColors?: {
//       bodyBg: string;
//     };
//   }
//   interface PaletteOptions {
//     customColors?: {
//       bodyBg: string;
//     };
//   }
// }

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#500dc5ff', // Vibrant purple
//     },
//     secondary: {
//       main: '#8A8D93',
//     },
//     text: {
//       primary: 'rgba(58, 53, 65, 0.87)',
//       secondary: 'rgba(58, 53, 65, 0.68)',
//       disabled: 'rgba(58, 53, 65, 0.38)',
//     },
//     background: {
//       default: '#F4F5FA',
//       paper: '#FFFFFF',
//     },
//     customColors: {
//       bodyBg: '#F4F5FA',
//     },
//   },
//   typography: {
//     fontFamily: inter.style.fontFamily,
//     h3: {
//       fontSize: '2.125rem',
//       lineHeight: 1.235,
//       letterSpacing: '0.00735em',
//     },
//     h4: {
//       fontSize: '1.5rem',
//       lineHeight: 1.235,
//       letterSpacing: '0.00735em',
//     },
//   },
//   shape: {
//     borderRadius: 8,
//   },
//   shadows: [
//     'none',
//     '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
//     '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
//     '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
//     '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
//     '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
//     '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
//   ],
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '8px',
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: '16px',
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: '8px',
//           },
//         },
//       },
//     },
//   },
// });

// export default theme;





















'use client'

import { createTheme } from '@mui/material/styles'
import { Montserrat } from 'next/font/google'
import { COLORS } from './constants' // Import only colors

// Load Montserrat font
const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

// Augment Palette to support custom colors
declare module '@mui/material/styles' {
  interface Palette {
    customColors?: {
      bodyBg: string
    }
  }
  interface PaletteOptions {
    customColors?: {
      bodyBg: string
    }
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.primary,
    },
    secondary: {
      main: COLORS.secondary,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
      disabled: 'rgba(58, 53, 65, 0.38)', // keep fallback if needed
    },
    background: {
      default: COLORS.background,
      paper: COLORS.paper,
    },
    customColors: {
      bodyBg: COLORS.background,
    },
  },
  typography: {
    fontFamily: montserrat.style.fontFamily, // Keep font setup here
    h3: {
      fontSize: '2.125rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h4: {
      fontSize: '1.5rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
})

export default theme





/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#7E297F',   // Purple
        secondary: '#FAA31D', // Orange
        black: '#000000',
        white: '#FFFFFF',
      },
      // Remove backdropFilter here as it's now native to Tailwind 3.x
    },
     keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-up-slow': 'fadeInUp 1.2s ease-out forwards', // Example of slower version
        'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
      },
  },
  plugins: [
    // Remove require('tailwindcss-filters') here
  ],
 
};



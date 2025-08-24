import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // Primary Metadata
  title: 'Tarmiye VSLA - Empowering Community Savings',
  description: 'Tarmiye VSLA provides a robust platform for managing Village Savings and Loan Associations, fostering financial inclusion and community development.',
  applicationName: 'Tarmiye VSLA',
  keywords: ['VSLA', 'Tarmiye', 'Savings Group', 'Community Development', 'Financial Inclusion', 'Microfinance', 'Somalia', 'Group Savings'],
  authors: [{ name: 'Tarmiye VSLA Team', url: '' }], // Replace with your actual website
  creator: 'Shaqadoon',
  publisher: 'Harhub',

  // Open Graph (for social media sharing like Facebook, LinkedIn)
  openGraph: {
    title: 'Tarmiye VSLA - Empowering Community Savings',
    description: 'Tarmiye VSLA: Your platform for organized village savings and community financial growth.',
    url: '', // Replace with your actual website
    siteName: 'Tarmiye VSLA',
    images: [
      {
        url: '/images/logo3.png', // Path to your Open Graph image (e.g., 1200x630 pixels)
        width: 1200,
        height: 630,
        alt: 'Tarmiye VSLA Logo and Community',
      },
      {
        url: '/images/logo1.png', // Secondary image, perhaps a smaller logo
        width: 400,
        height: 400,
        alt: 'Tarmiye VSLA Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card (for Twitter sharing)
  twitter: {
    card: 'summary_large_image',
    title: 'Tarmiye VSLA - Empowering Community Savings',
    description: 'Manage your Village Savings and Loan Associations effectively with Tarmiye VSLA. #FinancialInclusion #CommunityDevelopment',
    creator: '@TarmiyeVSLA', // Replace with  Twitter handle
    images: ['/images/imageCard.png'], // Path to  Twitter card image
  },

  // Favicons and Apple Touch Icons
  icons: {
    icon: '/images/logo3.png', //  primary favicon
    shortcut: '/shortcut-icon.png', // Optional shortcut icon
  
  },


  // Viewport settings for responsive design
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents users from zooming, often good for web apps
  },

  // SEO: Robots meta tag for search engine indexing
  robots: {
    index: true,
    follow: true,
    nocache: true, // Tells crawlers not to cache the page
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, // Allows Googlebot to index images
      'max-video-preview': -1, // No limit on video preview snippet length
      'max-snippet': -1, // No limit on text snippet length
    },
  },

  // Theme color for mobile browsers (e.g., toolbar color on Android)
  themeColor: '#7E297F', // A common green, often associated with growth/community
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* KEEP THIS <head> TAG for your custom links */}
      <head>
        {/* Google Fonts - Montserrat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Google Material Symbols */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={inter.className}>
        <Header />
        <main >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
    // ✨ Added these three MUI packages to ensure proper compilation ✨
  transpilePackages: ['@mui/x-charts', '@mui/material', '@mui/system'],
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  env: {
    API_URL: process.env.API_URL
  },
  output: "standalone",
}

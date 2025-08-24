// import React from "react";
// import { CircularProgress, Box } from "@mui/material";
// import { COLORS, FONTS } from "@/styles/constants";
// import Image from "next/image";
// const Spinner =()=>{
//     return (
//         <Box
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//         gap={2}
//         >
//        <Image
//        src='/images/logo/logo.png'
//        alt="Tarmiye"
//        width={80}
//        height={80}
//        >

//        </Image>
//        <CircularProgress
//        style={{
//         color:COLORS.primary
//        }}
//        size={40}
//        thickness={4}
//        />
//         </Box>
//     )
// }
// export default Spinner














// src/components/ui/Spinner.tsx
'use client'; // This is a Client Component

import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { COLORS } from "@/styles/constants"; // Import COLORS from your constants
import Image from "next/image";

const Spinner = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      gap={2}
      sx={{
        backgroundColor: COLORS.background, // Use your background color
        width: '100%',
      }}
    >
      <Image
        src='/images/logo/logo.png' // Ensure this path is correct in your public/images/logo folder
        alt="Tarmiye"
        width={80}
        height={80}
        priority // Prioritize loading for a better user experience
      />
      <CircularProgress
        sx={{
          color: COLORS.primary // Use your primary color
        }}
        size={40}
        thickness={4}
      />
    </Box>
  );
};

export default Spinner;

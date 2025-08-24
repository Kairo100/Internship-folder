// pages/teacher/_layout.jsx
// (Note: In Pages Router, you can use _app.js for global layouts,
// or wrap individual pages, or use a custom 'layout' component within a page file.
// A common pattern for nested layouts without App Router is like this,
// or by explicitly wrapping children in page components.)
"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Adjust path as needed
import Navbar from "../components/Navbar";   // Adjust path as needed
import { Toaster } from 'react-hot-toast'; // Import Toaster for global toast messages
import ProtectedRoute from "../components/ProtectedRoute";
export default function TeacherLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = "teacher"; // Explicitly set the role for this layout

  return (
   <html lang="en">
         {/* Ensure the body element doesn't have default margins/padding */}
         <body className="m-0 p-0 font-sans">
           <Toaster /> {/* Place Toaster here so toast messages appear globally */}
   <ProtectedRoute allowedRoles={["teacher"]}> 
           <div className="flex min-h-screen bg-gray-100">
             {/*
               Sidebar Integration:
               Your Sidebar component internally handles its fixed/static positioning.
               On desktop (md+), it becomes 'static' and takes up space.
               On mobile, it's fixed and slides in/out.
             */}
             <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
   
             {/*
               Main Content Wrapper:
               - `flex-1`: Allows this div to grow and take up the remaining horizontal space.
               - `flex flex-col`: Stacks the Navbar and the <main> content vertically.
               - `md:w-full`: On medium screens and up, explicitly makes it full width (minus sidebar).
                             This works well when the sidebar is `md:static`.
               - `overflow-hidden`: Helps prevent horizontal scroll if content briefly exceeds bounds.
             */}
             <div className="flex-1 flex flex-col md:w-full overflow-hidden">
               {/*
                 Navbar:
                 - `sticky top-0 z-30`: Makes the Navbar stick to the top when scrolling.
                 - `md:pl-64`: This is the crucial class! On desktop (md+), it adds
                               left padding to the Navbar, pushing its content to the right.
                               This visually aligns the Navbar's content with the start
                               of your main page content, creating the correct visual offset
                               for the static sidebar.
               */}
               <Navbar role={role} setIsSidebarOpen={setIsSidebarOpen} />
   
               {/* Main Page Content Area */}
               <main className="flex-1 p-6 sm:p-8 bg-gray-100">
                 {children} {/* Your page content (Dashboard, Teachers, etc.) renders here */}
               </main>
             </div>
           </div>
           </ProtectedRoute>
         </body>
       </html>
  );
}
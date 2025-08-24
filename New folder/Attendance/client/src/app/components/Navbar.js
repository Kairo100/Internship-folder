import React from 'react';
import { FaUserCircle, FaBell, FaBars } from 'react-icons/fa'; // Added FaBars

export default function Navbar({ role, setIsSidebarOpen }) { // Added setIsSidebarOpen prop
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
      {/* Hamburger icon for mobile */}
      <button
        className="md:hidden text-gray-600 hover:text-gray-900 mr-4"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars className="text-2xl" />
      </button>

      <div className="text-xl font-semibold text-gray-800 hidden md:block"> {/* Hidden on mobile, shown on desktop */}
        Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!
      </div>
      <div className="text-xl font-semibold text-gray-800 md:hidden"> {/* Shown on mobile only */}
       {role.charAt(0).toUpperCase() + role.slice(1)}!
      </div>

     
    </header>
  );
}
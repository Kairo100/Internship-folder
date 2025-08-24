// components/ProtectedRoute.jsx
"use client"; // This component needs to be a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner directly

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Keep isLoading
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // This runs only on the client side
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // Assuming you store user info like { name, role }

    let authStatus = false;
    let currentRole = null;

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        authStatus = true;
        currentRole = user.role;
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Clear invalid data to prevent infinite loops or issues
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsAuthenticated(authStatus);
    setUserRole(currentRole);
    setIsLoading(false); // Authentication check is complete
  }, []);

  // Display the loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
        <div className="flex flex-col items-center text-green-600">
          <FaSpinner className="animate-spin text-5xl mb-4" />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    router.replace("/login"); // Use replace to prevent back navigation to protected route
    return null; // Don't render children while redirecting
  }

  // If authenticated but role is not allowed, redirect to a different page or show error
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    router.replace("/login"); // Create an /unauthorized page if you don't have one
    return null;
  }

  // If authenticated and role is allowed, render children
  return children;
};

export default ProtectedRoute;
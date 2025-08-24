"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard"; // New component
import api from "@/utils/api";
import { FaUsers, FaGraduationCap, FaChalkboardTeacher, FaCalendarCheck, FaSpinner  } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminDashboardPage() {
  const role = "admin";
  
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    absentToday: 0, // Example stat
  });
  const [loadingStats, setLoadingStats] = useState(true);

// ... (previous code)

  useEffect(() => {
    async function fetchDashboardStats() {
      setLoadingStats(true);
      try {
        // Make a single API call to fetch all dashboard stats
        const response = await api.get("/admin/dashboard");
        // The response.data will directly contain totalStudents, totalClasses, etc.
        setDashboardStats({
          totalStudents: response.data.totalStudents,
          totalClasses: response.data.totalClasses,
          totalTeachers: response.data.totalTeachers,
          absentToday: response.data.absentToday,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoadingStats(false);
      }
    }
    fetchDashboardStats();
  }, []);

// ... (rest of your code)

  return (
    <>
    
      <div >
        
        <main className="flex-1 p-6 sm:p-8 bg-gray-100">
          <Toaster />
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">
              Admin Dashboard Overview
            </h1>

            {loadingStats ? (
              <div className="flex justify-center items-center h-48">
                <FaSpinner className="animate-spin text-green-500 text-4xl" />
                <p className="ml-4 text-gray-600">Loading dashboard data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                  title="Total Students"
                  value={dashboardStats.totalStudents}
                  icon={<FaGraduationCap className="text-blue-500" />}
                  bgColor="bg-blue-100"
                  textColor="text-blue-700"
                />
                <DashboardCard
                  title="Total Classes"
                  value={dashboardStats.totalClasses}
                  icon={<FaUsers className="text-green-500" />}
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                />
                <DashboardCard
                  title="Total Teachers"
                  value={dashboardStats.totalTeachers}
                  icon={<FaChalkboardTeacher className="text-purple-500" />}
                  bgColor="bg-purple-50"
                  textColor="text-purple-700"
                />
                <DashboardCard
                  title="Absent Today (Approx.)"
                  value={dashboardStats.absentToday}
                  icon={<FaCalendarCheck className="text-red-500" />}
                  bgColor="bg-red-50"
                  textColor="text-red-700"
                />
              
              </div>
            )}

           
          </div>
        </main>
      </div>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard"; // Re-use the existing card component
import api from "@/utils/api"; // Your API utility
import { FaGraduationCap, FaChalkboardTeacher, FaCalendarCheck, FaSpinner, FaBookOpen } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function TeacherDashboardPage() {
  const role = "teacher"; // Explicitly set role for this page
  const [dashboardStats, setDashboardStats] = useState({
    myTotalStudents: 0,
    myTotalClasses: 0,
    myAbsentToday: 0,
    upcomingClasses: 0, // New stat for teachers
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchTeacherDashboardStats() {
      setLoadingStats(true);
      try {
        // Assuming a new API endpoint for teacher-specific dashboard stats
        // The backend should use the teacher's authentication to return their data.
        const response = await api.get("/teacher/dashboard");
        setDashboardStats({
          myTotalStudents: response.data.myTotalStudents,
          myTotalClasses: response.data.myTotalClasses,
          myAbsentToday: response.data.myAbsentToday,
          upcomingClasses: response.data.upcomingClasses,
        });
      } catch (err) {
        console.error("Failed to fetch teacher dashboard stats:", err);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoadingStats(false);
      }
    }
    fetchTeacherDashboardStats();
  }, []);

  return (
    <>
      {/* The main layout (Sidebar and Navbar) will be provided by _app.js or a dedicated layout file */}
      <Toaster /> {/* Toasts rendered here for this page's specific messages */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">
          Teacher Dashboard Overview
        </h1>

        {loadingStats ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="animate-spin text-green-500 text-4xl" />
            <p className="ml-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="My Total Students"
              value={dashboardStats.myTotalStudents}
              icon={<FaGraduationCap className="text-blue-500" />}
              bgColor="bg-blue-100"
              textColor="text-blue-700"
            />
            <DashboardCard
              title="My Classes"
              value={dashboardStats.myTotalClasses}
              icon={<FaChalkboardTeacher className="text-green-500" />}
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <DashboardCard
              title="Absent Today (My Classes)"
              value={dashboardStats.myAbsentToday}
              icon={<FaCalendarCheck className="text-red-500" />}
              bgColor="bg-red-50"
              textColor="text-red-700"
            />
            <DashboardCard
              title="Upcoming Classes Today"
              value={dashboardStats.upcomingClasses}
              icon={<FaBookOpen className="text-purple-500" />}
              bgColor="bg-purple-50"
              textColor="text-purple-700"
            />
          </div>
        )}
      </div>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { format } from "date-fns";
import { toast, Toaster } from 'react-hot-toast'; // For notifications

// You'll need to create these components
// components/Sidebar.jsx
// components/Navbar.jsx

// This will be a new component for the table
import AdminAttendanceTable from "../../components/AdminAttendanceTable";

export default function AdminAttendancePage() {
  const role = "admin"; // This would typically come from user context/auth
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [errorClasses, setErrorClasses] = useState(null);

  useEffect(() => {
    async function fetchClasses() {
      setLoadingClasses(true);
      setErrorClasses(null);
      try {
        const res = await api.get("/admin/classes"); // Assuming an admin route to fetch classes
        setClasses(res.data);
        if (res.data.length > 0) {
          setSelectedClassId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setErrorClasses("Failed to load classes. Please try again.");
        toast.error("Failed to load classes.");
      } finally {
        setLoadingClasses(false);
      }
    }
    fetchClasses();
  }, []);

  return (
    <>

      <div className=""> {/* Adjust margin for sidebar width */}
        
        <main className="flex-1 p-6 sm:p-8 bg-gray-100">
          <Toaster /> {/* Toast notifications */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
              Attendance Management
            </h1>
            <p className="text-gray-600 mb-6">
              Select a class to view and mark attendance records.
            </p>

            <div className="mb-6">
              <label htmlFor="classSelect" className="block text-lg font-semibold text-gray-700 mb-2">
                Select Class:
              </label>
              {loadingClasses ? (
                <p className="text-gray-500">Loading classes...</p>
              ) : errorClasses ? (
                <p className="text-red-500">{errorClasses}</p>
              ) : (
                <div className="relative inline-block w-full sm:w-auto">
                  <select
                    id="classSelect"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  >
                    {classes.length === 0 ? (
                      <option value="">No classes available</option>
                    ) : (
                      <>
                        <option value="">-- Select a Class --</option>
                        {classes.map((cls) => (
                          <option key={cls._id} value={cls._id}>
                            {cls.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {selectedClassId ? (
              <AdminAttendanceTable classId={selectedClassId} />
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Heads up!</p>
                <p>Please select a class from the dropdown above to view and mark attendance.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
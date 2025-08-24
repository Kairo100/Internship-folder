"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Toaster } from 'react-hot-toast';

// Assuming these components exist and are correctly imported:
// import Sidebar from "@/components/Sidebar";
// import Navbar from "@/components/Navbar";

import TeacherAttendanceTable from "../../components/TeacherAttendanceTable"; // Adjust path as needed

export default function TeacherAttendancePage() {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [errorClasses, setErrorClasses] = useState(null);

    useEffect(() => {
        async function fetchTeacherClasses() {
            setLoadingClasses(true);
            setErrorClasses(null);
            try {
                const res = await api.get("/teacher/my-classes");
                setClasses(res.data);
                // --- DEBUGGING START ---
                console.log("[TeacherAttendancePage] Fetched teacher's classes:", res.data);
                // --- DEBUGGING END ---
                if (res.data.length > 0) {
                    // Set the first class as default selected if available
                    setSelectedClassId(res.data[0]._id);
                    console.log("[TeacherAttendancePage] Initial selected class ID set to:", res.data[0]._id);
                } else {
                    setSelectedClassId(""); // Ensure no class is selected if none are returned
                    console.log("[TeacherAttendancePage] No classes found for teacher.");
                }
            } catch (err) {
                console.error("Failed to fetch teacher's classes:", err);
                setErrorClasses("Failed to load your classes. Please try again.");
            } finally {
                setLoadingClasses(false);
            }
        }
        fetchTeacherClasses();
    }, []); // Empty dependency array means this runs only once on mount

    return (
        <>
            <Toaster />
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
                    Mark Attendance
                </h1>
                <p className="text-gray-600 mb-6">
                    Select a class to view and mark attendance records for today.
                </p>

                <div className="mb-6">
                    <label htmlFor="classSelect" className="block text-lg font-semibold text-gray-700 mb-2">
                        Select Class:
                    </label>
                    {loadingClasses ? (
                        <p className="text-gray-500">Loading your classes...</p>
                    ) : errorClasses ? (
                        <p className="text-red-500">{errorClasses}</p>
                    ) : (
                        <div className="relative inline-block w-full sm:w-auto">
                            <select
                                id="classSelect"
                                value={selectedClassId}
                                onChange={(e) => {
                                    setSelectedClassId(e.target.value);
                                    // --- DEBUGGING START ---
                                    console.log("[TeacherAttendancePage] Dropdown changed. New selectedClassId:", e.target.value);
                                    // --- DEBUGGING END ---
                                }}
                                className="text-gray-700 block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            >
                                {classes.length === 0 ? (
                                    <option value="">No classes assigned to you</option>
                                ) : (
                                    <>
                                        {/* Added a default prompt option */}
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

                {/* Only render TeacherAttendanceTable if a class is selected */}
                {selectedClassId ? (
                    <TeacherAttendanceTable classId={selectedClassId} classes={classes} />
                ) : (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Heads up!</p>
                        <p>Please select a class from the dropdown above to mark attendance.</p>
                    </div>
                )}
            </div>
        </>
    );
}
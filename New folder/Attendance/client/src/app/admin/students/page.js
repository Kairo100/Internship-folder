"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaBookOpen,
  FaIdBadge, // For roll number
  FaCheckCircle, // For active status
  FaTimesCircle // For dropout status
} from 'react-icons/fa';
import Link from "next/link";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // New state for status filter
  const [classes, setClasses] = useState([]); // To populate the class filter

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (filterClass) {
        params.classId = filterClass;
      }
      if (filterStatus) { // Add status to params
        params.status = filterStatus;
      }

      const res = await api.get("/admin/students", { params });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again.");
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterClass, filterStatus]); // Add filterStatus to dependencies

  const fetchClassesForFilter = useCallback(async () => {
    try {
      const res = await api.get("/admin/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes for filter:", err);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchClassesForFilter();
  }, [fetchStudents, fetchClassesForFilter]);

  const handleDeleteStudent = async (studentId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! The student record will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/students/${studentId}`);
          MySwal.fire(
            'Deleted!',
            'The student has been deleted.',
            'success'
          );
          fetchStudents(); // Refresh the list
        } catch (err) {
          console.error("Failed to delete student:", err);
          MySwal.fire(
            'Error!',
            err.response?.data?.message || "Failed to delete student.",
            'error'
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire(
          'Cancelled',
          'The student deletion was cancelled :)',
          'info'
        );
      }
    });
  };

  return (
    <main className="flex-1 p-6 sm:p-8 bg-gray-100">
      <Toaster />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
          Student Management
        </h1>
        <p className="text-gray-600 mb-6">
          View, search, filter, and manage student records.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-wrap"> {/* flex-wrap for better responsiveness */}
          <div className="relative flex-1 min-w-[200px]"> {/* min-w for better layout */}
            <input
              type="text"
              placeholder="Search students (name, email, roll number)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-auto min-w-[150px]"> {/* min-w for better layout */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="text-gray-700 block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-900">
              <FaFilter className="fill-current h-4 w-4" />
            </div>
          </div>
          {/* New Status Filter */}
          <div className="relative w-full sm:w-auto min-w-[150px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-gray-700 block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="dropout">Dropout</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-900">
              <FaFilter className="fill-current h-4 w-4" />
            </div>
          </div>
          <Link href="/admin/students/add" className="w-full sm:w-auto">
            <button className="w-full px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 flex items-center justify-center">
              <FaPlus className="mr-2" /> Add New Student
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-green-500 text-4xl" />
            <p className="ml-4 text-gray-600">Loading students...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-6" role="alert">
            <p className="font-bold">No Students Found</p>
            <p>No students match your search or filter criteria.</p>
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="overflow-x-auto rounded-lg shadow hidden sm:block">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 whitespace-nowrap text-gray-800">{student.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-sm">{student.rollNumber}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-sm">{student.email || 'N/A'}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-sm">
                        {student.class ? student.class.name : 'N/A'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <Link href={`/admin/students/edit/${student._id}`}>
                          <button className="text-green-600 hover:text-green-800 mr-3">
                            <FaEdit className="inline-block text-lg" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteStudent(student._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="inline-block text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card view for small screens */}
            <div className="sm:hidden grid grid-cols-1 gap-4">
              {students.map((student) => (
                <div key={student._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{student.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FaIdBadge className="mr-2 text-purple-500" />
                    <span className="font-medium">Roll No:</span> {student.rollNumber}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FaEnvelope className="mr-2 text-green-500" />
                    <span className="font-medium">Email:</span> {student.email || 'N/A'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <FaBookOpen className="mr-2 text-green-500" />
                    <span className="font-medium">Class:</span> {student.class ? student.class.name : 'N/A'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    {student.status === 'active' ? (
                      <FaCheckCircle className="mr-2 text-green-600" />
                    ) : (
                      <FaTimesCircle className="mr-2 text-red-600" />
                    )}
                    <span className="font-medium">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 border-t pt-3 mt-3">
                    <Link href={`/admin/students/edit/${student._id}`}>
                      <button className="px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-200 flex items-center text-sm">
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center text-sm"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaUser, FaEnvelope, FaBookOpen } from 'react-icons/fa';
import Link from "next/link";
import Swal from 'sweetalert2'; //  SweetAlert2
import withReactContent from 'sweetalert2-react-content'; // content wrapper

const MySwal = withReactContent(Swal); // Create a SweetAlert2 

export default function AdminTeachersPage() {
  const role = "admin";
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) {
        params.search = searchTerm; // Assuming backend search by teacher name/email
      }
      const res = await api.get("/admin/teachers", { params });
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setError("Failed to load teachers. Please try again.");
      toast.error("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleDeleteTeacher = async (teacherId) => {
    // Replace native confirm with SweetAlert2
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', //  delete
      cancelButtonColor: '#3085d6', //  cancel
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true // Puts "Cancel"  left, "Delete"   right
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/teachers/${teacherId}`);
          // Use SweetAlert2 for success confirmation too
          MySwal.fire(
            'Deleted!',
            'The teacher has been deleted.',
            'success'
          );
          fetchTeachers(); // Refresh the list
        } catch (err) {
          console.error("Failed to delete teacher:", err);
          MySwal.fire(
            'Error!',
            err.response?.data?.message || "Failed to delete teacher.",
            'error'
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire(
          'Cancelled',
          'The teacher deletion was cancelled :)',
          'info'
        );
      }
    });
  };

  return (
    <>
      <Toaster />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
          Teacher Management
        </h1>
        <p className="text-gray-600 mb-6">
          View, search, and manage teacher accounts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Link href="/admin/teachers/add" className="w-full sm:w-auto">
            <button className="w-full px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 flex items-center justify-center">
              <FaPlus className="mr-2" /> Add New Teacher
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-green-500 text-4xl" />
            <p className="ml-4 text-gray-600">Loading teachers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6" role="alert">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-6" role="alert">
            <p className="font-bold">No Teachers Found</p>
            <p>No teachers match your search criteria.</p>
          </div>
        ) : (
          <>
            {/* Desktop/Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assigned Class
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{teacher.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">{teacher.email}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">
                        {teacher.assignedClass ? teacher.assignedClass.name : 'N/A'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                        <Link href={`/admin/teachers/edit/${teacher._id}`}>
                          <button className="text-green-600 hover:text-green-800 mr-3 p-1 rounded-md">
                            <FaEdit className="inline-block text-lg" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-md"
                        >
                          <FaTrash className="inline-block text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden grid grid-cols-1 gap-4">
              {teachers.map((teacher) => (
                <div key={teacher._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <FaUser className="mr-2 text-green-600" /> {teacher.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" /> {teacher.email}
                  </p>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <FaBookOpen className="mr-2 text-gray-500" /> Assigned Class:{" "}
                    <span className="font-medium">
                      {teacher.assignedClass ? teacher.assignedClass.name : 'N/A'}
                    </span>
                  </p>
                  <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
                    <Link href={`/admin/teachers/edit/${teacher._id}`}>
                      <button className="text-green-600 hover:text-green-800 p-2 rounded-md flex items-center text-sm">
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-md flex items-center text-sm"
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
    </>
  );
}
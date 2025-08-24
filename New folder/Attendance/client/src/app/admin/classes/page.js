"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaUser, FaUsers } from 'react-icons/fa'; // Added FaUser and FaUsers
import Link from "next/link";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function AdminClassesPage() {
  const role = "admin";
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      const res = await api.get("/admin/classes", { params });
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setError("Failed to load classes. Please try again.");
      toast.error("Failed to load classes.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleDeleteClass = async (classId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This will also unassign its teacher and students.",
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
          await api.delete(`/admin/classes/${classId}`);
          MySwal.fire(
            'Deleted!',
            'The class has been deleted.',
            'success'
          );
          fetchClasses();
        } catch (err) {
          console.error("Failed to delete class:", err);
          MySwal.fire(
            'Error!',
            err.response?.data?.message || "Failed to delete class.",
            'error'
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire(
          'Cancelled',
          'The class deletion was cancelled :)',
          'info'
        );
      }
    });
  };

  return (
    <>
      <div className="">
        <main className="flex-1 p-6 sm:p-8 bg-gray-100">
          <Toaster />
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
              Class Management
            </h1>
            <p className="text-gray-600 mb-6">
              View, search, and manage academic classes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search classes by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Link href="/admin/classes/add" className="w-full sm:w-auto">
                <button className="w-full px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 flex items-center justify-center">
                  <FaPlus className="mr-2" /> Add New Class
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-green-500 text-4xl" />
                <p className="ml-4 text-gray-600">Loading classes...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6" role="alert">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            ) : classes.length === 0 ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-6" role="alert">
                <p className="font-bold">No Classes Found</p>
                <p>No classes match your search criteria.</p>
              </div>
            ) : (
              <>
                {/* Table for larger screens */}
                <div className="overflow-x-auto rounded-lg shadow hidden sm:block">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Class Name
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Assigned Teacher
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Student Count
                        </th>
                        <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {classes.map((cls) => (
                        <tr key={cls._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                          <td className="py-3 px-4 whitespace-nowrap text-gray-800">{cls.name}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-sm">
                            {cls.teacher ? cls.teacher.name : 'Unassigned'}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-gray-600 text-sm">
                            {cls.studentCount || 0}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            <Link href={`/admin/classes/edit/${cls._id}`}>
                              <button className="text-green-600 hover:text-green-800 mr-3">
                                <FaEdit className="inline-block text-lg" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteClass(cls._id)}
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
                  {classes.map((cls) => (
                    <div key={cls._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{cls.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <FaUser className="mr-2 text-green-500" />
                        <span className="font-medium">Teacher:</span> {cls.teacher ? cls.teacher.name : 'Unassigned'}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FaUsers className="mr-2 text-green-500" />
                        <span className="font-medium">Students:</span> {cls.studentCount || 0}
                      </div>
                      <div className="flex justify-end gap-2 border-t pt-3 mt-3">
                        <Link href={`/admin/classes/edit/${cls._id}`}>
                          <button className="px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-200 flex items-center text-sm">
                            <FaEdit className="mr-1" /> Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteClass(cls._id)}
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
      </div>
    </>
  );
}
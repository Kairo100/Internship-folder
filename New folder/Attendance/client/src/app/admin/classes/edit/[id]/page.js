// src/app/admin/classes/edit/[id]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { toast, Toaster } from 'react-hot-toast';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id; // Get the ID from the URL
  
  const [className, setClassName] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState(''); // Stores teacher ID
  const [availableTeachers, setAvailableTeachers] = useState([]); // List of teachers for dropdown
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch class data and available teachers on component mount
  useEffect(() => {
    async function fetchData() {
      if (!classId) return; // Don't fetch if ID is not available yet

      setLoading(true);
      try {
        // Fetch class details
        const classRes = await api.get(`/admin/classes/${classId}`);
        setClassName(classRes.data.name);
        setAssignedTeacher(classRes.data.teacher?._id || ''); // Set teacher ID if exists

        // Fetch all available teachers for the dropdown
        const teachersRes = await api.get('/admin/teachers'); // Assuming this gets all teachers
        setAvailableTeachers(teachersRes.data);

      } catch (err) {
        console.error("Failed to fetch class or teachers:", err);
        setError(err.response?.data?.message || "Failed to load class data.");
        toast.error("Failed to load class data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const updateData = {
        name: className,
        teacher: assignedTeacher || null, // Send null if no teacher is selected
      };
      await api.put(`/admin/classes/${classId}`, updateData);
      toast.success('Class updated successfully!');
      router.push('/admin/classes'); // Redirect back to classes list
    } catch (err) {
      console.error("Failed to update class:", err);
      setError(err.response?.data?.message || 'Failed to update class.');
      toast.error(err.response?.data?.message || 'Failed to update class.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-green-500 text-4xl" />
        <p className="ml-4 text-gray-600">Loading class details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6" role="alert">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <Link href="/admin/classes" className="text-green-700 hover:underline mt-2 inline-block">
          Go back to Classes
        </Link>
      </div>
    );
  }

  return (
    <>
      <Toaster /> {/* Toaster should ideally be in a layout */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
          Edit Class: {className}
        </h1>
        <p className="text-gray-600 mb-6">
          Update the class name and assign a teacher.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="text-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="assignedTeacher" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Teacher
            </label>
            <select
              id="assignedTeacher"
              value={assignedTeacher}
              onChange={(e) => setAssignedTeacher(e.target.value)}
              className="text-gray-700 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">-- Select Teacher --</option>
              {availableTeachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id} className='text-gray-700'>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Link href="/admin/classes">
              <button
                type="button"
                className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaTimes className="inline-block mr-2" /> Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-5 py-2 inline-flex items-center justify-center border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={submitting}
            >
              {submitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="inline-block mr-2" />}
              {submitting ? 'Updating...' : 'Update Class'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
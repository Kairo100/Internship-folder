"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaSave, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from "next/link";

export default function AddClassPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "", // Optional: assign a teacher immediately
  });
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchTeachers() {
      setLoadingTeachers(true);
      try {
        const res = await api.get("/admin/teachers"); // Assuming this endpoint exists for all teachers
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        toast.error("Failed to load teachers for assignment.");
      } finally {
        setLoadingTeachers(false);
      }
    }
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Class name is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Assuming your backend has an endpoint like /admin/classes for adding
      await api.post("/admin/classes", formData);
      toast.success("Class added successfully!");
      router.push("/admin/classes"); // Redirect back to classes list
    } catch (err) {
      console.error("Failed to add class:", err);
      toast.error(err.response?.data?.message || "Failed to add class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Add New Class</h1>
          <Link href="/admin/classes">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Classes
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              required
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="teacherId" className="block text-lg font-medium text-gray-700 mb-2">
              Assign Teacher (Optional)
            </label>
            {loadingTeachers ? (
              <p className="text-gray-500">Loading teachers...</p>
            ) : teachers.length === 0 ? (
              <p className="text-gray-500">No teachers available. Consider adding teachers first.</p>
            ) : (
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select a Teacher --</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id} className="text-gray-700">
                    {teacher.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center transition duration-300 ease-in-out
                ${isSubmitting
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg"
                }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Adding Class...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Add Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
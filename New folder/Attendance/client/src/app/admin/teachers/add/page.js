"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaSave, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from "next/link";

export default function AddTeacherPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Initial password for the teacher account
    classId: "", // Optional: assign a class to the teacher
  });
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchClasses() {
      setLoadingClasses(true);
      try {
        const res = await api.get("/admin/classes"); // Fetch available classes for assignment
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        toast.error("Failed to load classes for assignment.");
      } finally {
        setLoadingClasses(false);
      }
    }
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Teacher name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    if (!formData.password.trim()) errors.password = "Password is required.";
    // classId is optional, so no validation needed unless you make it mandatory
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
      // Assuming your backend has an endpoint like /admin/teachers for adding
      await api.post("/admin/teachers", formData);
      toast.success("Teacher added successfully!");
      router.push("/admin/teachers"); // Redirect back to teachers list
    } catch (err) {
      console.error("Failed to add teacher:", err);
      toast.error(err.response?.data?.message || "Failed to add teacher. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Add New Teacher</h1>
          <Link href="/admin/teachers">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Teachers
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Teacher Name
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
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              required
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Initial Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              required
            />
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>

          <div>
            <label htmlFor="classId" className="block text-lg font-medium text-gray-700 mb-2">
              Assign Class (Optional)
            </label>
            {loadingClasses ? (
              <p className="text-gray-500">Loading classes...</p>
            ) : classes.length === 0 ? (
              <p className="text-gray-500">No classes available. Consider adding classes first.</p>
            ) : (
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" className="text-gray-700">-- Select a Class --</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
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
                  <FaSpinner className="animate-spin mr-2" /> Adding Teacher...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Add Teacher
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
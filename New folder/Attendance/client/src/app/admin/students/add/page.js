"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaSave, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from "next/link";

export default function AddStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    // password: "", // REMOVED: No password needed
    classId: "",
    status: "active", // Default status
    dropoutReason: "", // NEW: For dropout reason
  });
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    async function fetchClasses() {
      setLoadingClasses(true);
      try {
        const res = await api.get("/admin/classes");
        setClasses(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, classId: res.data[0]._id }));
        } else {
          setFormData(prev => ({ ...prev, classId: "" }));
        }
      } catch (err) {
        console.error("Failed to fetch classes for student assignment:", err);
        toast.error("Failed to load classes. Please try again.");
      } finally {
        setLoadingClasses(false);
      }
    }
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) {
      errors.name = "Student name is required.";
    }
    if (!formData.rollNumber.trim()) {
      errors.rollNumber = "Roll Number is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }
    // No password validation
    if (!formData.classId) {
      errors.classId = "Class assignment is required.";
    }
    if (!formData.status) {
        errors.status = "Status is required.";
    }
    // NEW: Conditional validation for dropoutReason
    if (formData.status === 'dropout' && !formData.dropoutReason.trim()) {
        errors.dropoutReason = "Dropout reason is required if status is 'Dropout'.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the form errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        name: formData.name,
        rollNumber: formData.rollNumber,
        email: formData.email,
        class: formData.classId, // Matches your Student model's 'class' field
        status: formData.status,
        // Only send dropoutReason if status is dropout, otherwise send an empty string or omit
        dropoutReason: formData.status === 'dropout' ? formData.dropoutReason : '',
      };

      await api.post("/admin/students", dataToSend);
      toast.success("Student added successfully!");
      router.push("/admin/students");
    } catch (err) {
      console.error("Error adding student:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add student. An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Add New Student</h1>
          <Link href="/admin/students">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Students
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Student Name
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

          {/* Roll Number */}
          <div>
            <label htmlFor="rollNumber" className="block text-lg font-medium text-gray-700 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.rollNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              required
            />
            {formErrors.rollNumber && <p className="text-red-500 text-sm mt-1">{formErrors.rollNumber}</p>}
          </div>

          {/* Email */}
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

          {/* Assign Class */}
          <div>
            <label htmlFor="classId" className="block text-lg font-medium text-gray-700 mb-2">
              Assign Class
            </label>
            {loadingClasses ? (
              <p className="text-gray-500">Loading classes...</p>
            ) : classes.length === 0 ? (
              <p className="text-red-500">No classes available. Please add a class first to assign students.</p>
            ) : (
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.classId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                required
              >
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            )}
            {formErrors.classId && <p className="text-red-500 text-sm mt-1">{formErrors.classId}</p>}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-lg font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              required
            >
              <option value="active">Active</option>
              <option value="dropout">Dropout</option>
            </select>
            {formErrors.status && <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>}
          </div>

          {/* Dropout Reason (Conditional) */}
          {formData.status === 'dropout' && (
            <div>
              <label htmlFor="dropoutReason" className="block text-lg font-medium text-gray-700 mb-2">
                Reason for Dropout
              </label>
              <textarea
                id="dropoutReason"
                name="dropoutReason"
                value={formData.dropoutReason}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.dropoutReason ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                required
              ></textarea>
              {formErrors.dropoutReason && <p className="text-red-500 text-sm mt-1">{formErrors.dropoutReason}</p>}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || loadingClasses || classes.length === 0}
              className={`w-full px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center transition duration-300 ease-in-out
                ${isSubmitting || loadingClasses || classes.length === 0
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg"
                }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Adding Student...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Add Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
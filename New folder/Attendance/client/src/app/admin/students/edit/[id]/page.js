"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
// If you needed other query parameters like ?name=john, you would also import useSearchParams:
// import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast';
import { FaSave, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Link from "next/link";

// In App Router, dynamic segments like [id] are passed as props to the page component
export default function EditStudentPage({ params }) {
  const router = useRouter();
  const { id } = params; // Get student ID from the URL params (e.g., from /edit/123, id will be '123')
  // If you also had query parameters like /edit/123?foo=bar, you would use:
  // const searchParams = useSearchParams();
  // const foo = searchParams.get('foo');

  const [student, setStudent] = useState(null);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [status, setStatus] = useState('active'); // Default status
  const [dropoutReason, setDropoutReason] = useState(''); // NEW: Add state for dropout reason
  const [classes, setClasses] = useState([]); // To populate the class dropdown
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch student data and classes on component mount
  useEffect(() => {
    if (id) {
      const fetchStudentData = async () => {
        try {
          const studentRes = await api.get(`/admin/students/${id}`);
          const fetchedStudent = studentRes.data;
          setStudent(fetchedStudent);
          setName(fetchedStudent.name);
          setRollNumber(fetchedStudent.rollNumber);
          setEmail(fetchedStudent.email || ''); // Ensure email is empty string if null/undefined
          setSelectedClass(fetchedStudent.class ? fetchedStudent.class._id : '');
          setStatus(fetchedStudent.status);
          setDropoutReason(fetchedStudent.dropoutReason || ''); // NEW: Set dropout reason
        } catch (err) {
          console.error("Failed to fetch student:", err);
          setError("Failed to load student data. Please try again.");
          toast.error("Failed to load student data.");
        }
      };

      const fetchClasses = async () => {
        try {
          const classesRes = await api.get("/admin/classes");
          setClasses(classesRes.data);
        } catch (err) {
          console.error("Failed to fetch classes:", err);
          toast.error("Failed to load classes for dropdown.");
        }
      };

      Promise.all([fetchStudentData(), fetchClasses()]).finally(() => {
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Basic client-side validation
    if (!name.trim() || !rollNumber.trim() || !selectedClass.trim()) {
      setError("Name, Roll Number, and Class are required.");
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    // NEW: Client-side validation for dropoutReason
    if (status === 'dropout' && !dropoutReason.trim()) {
      setError("Dropout reason is required when status is 'dropout'.");
      toast.error("Please provide a dropout reason.");
      setSubmitting(false);
      return;
    }


    try {
      const updatedStudentData = {
        name,
        rollNumber,
        email: email.trim(), // Send as empty string if cleared
        class: selectedClass,
        status,
        dropoutReason: status === 'dropout' ? dropoutReason.trim() : undefined, // NEW: Include dropoutReason conditionally
      };

      await api.put(`/admin/students/${id}`, updatedStudentData);
      toast.success("Student updated successfully!");
      router.push('/admin/students'); // Redirect back to student list
    } catch (err) {
      console.error("Failed to update student:", err);
      const errorMessage = err.response?.data?.message || "Failed to update student.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 p-6 sm:p-8 bg-gray-100 flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-green-500 text-4xl" />
        <p className="ml-4 text-gray-600">Loading student data...</p>
      </main>
    );
  }

  if (error && !student) { // Only show full error page if student data couldn't be loaded at all
    return (
      <main className="flex-1 p-6 sm:p-8 bg-gray-100 flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6" role="alert">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <Link href="/admin/students" className="text-green-700 hover:underline mt-2 block">
            Go back to Student List
          </Link>
        </div>
      </main>
    );
  }

  // If student is null after loading and no error, means ID was invalid or student not found
  if (!student) {
    return (
      <main className="flex-1 p-6 sm:p-8 bg-gray-100 flex justify-center items-center h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-6" role="alert">
          <p className="font-bold">Student Not Found</p>
          <p>The student with ID "{id}" could not be found.</p>
          <Link href="/admin/students" className="text-green-700 hover:underline mt-2 block">
            Go back to Student List
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="flex-1 p-6 sm:p-8 bg-gray-100">
      <Toaster />
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-4">
          Edit Student: {student.name}
        </h1>
        <p className="text-gray-600 mb-6">
          Update the details for this student.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              // Email is optional, so no 'required' attribute
            />
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Class <span className="text-red-500">*</span>
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-gray-700 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">-- Select a Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-gray-700 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="active">Active</option>
              <option value="dropout">Dropout</option>
            </select>
          </div>

          {status === 'dropout' && ( // NEW: Conditionally render dropout reason field
            <div>
              <label htmlFor="dropoutReason" className="block text-sm font-medium text-gray-700 mb-1">
                Dropout Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="dropoutReason"
                value={dropoutReason}
                onChange={(e) => setDropoutReason(e.target.value)}
                rows="3"
                className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required={status === 'dropout'} // Required only when status is dropout
              ></textarea>
            </div>
          )}


          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Link href="/admin/students">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 flex items-center justify-center"
              >
                <FaTimesCircle className="mr-2" /> Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200 flex items-center justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { toast, Toaster } from 'react-hot-toast'; // Import Toaster and toast
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa'; // Icons for input fields and button

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      

      toast.success(`Welcome, ${user.name}!`, { duration: 2000 }); // Success message

      // Give a slight delay for the toast to show before redirecting
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "teacher") {
          router.push("/teacher");
        } else {
          toast.error("Unknown user role. Please contact support.");
        }
      }, 500); // Redirect after 0.5 seconds
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);

      // Display user-friendly error messages
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Server-provided error message
      } else {
        toast.error("Invalid email or password. Please try again."); // Generic error
      }
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Toaster position="top-center" reverseOrder={false} /> {/* Toaster component */}

      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaUser />
              </span>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaLock />
              </span>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaSignInAlt className="mr-2" />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

       
      </div>
    </div>
  );
}
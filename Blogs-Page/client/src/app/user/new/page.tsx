"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
export default function NewUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",   // added password here
    role: "User",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, files } = e.target as HTMLInputElement;

  if (name === "image" && files && files[0]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(files[0]);
  } else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("https://blogs-page-njeb.onrender.com/api/auth/register", form);
      router.push("/user");
    } catch (error) {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-6">Add New User</h1>

      {error && (
        <div className="mb-4 text-red-600 font-medium">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
       

        <div>
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>User</option>
            <option>Admin</option>
            <option>Editor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Create User"}
        </button>
      </form>
    </div>
    </AdminLayout>
  );
}

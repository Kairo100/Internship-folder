"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
const id = params?.id as string;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "", // optional, only update if filled
    profilePic: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://blogs-page-njeb.onrender.com/api/users/${id}`);
        const user = res.data;
        setForm({
          username: user.username || "",
          email: user.email || "",
          password: "",
          profilePic: user.profilePic || "",
          role: user.role || "user",
        });
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [id]);



const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, files } = e.target as HTMLInputElement;

  if (name === "profilePic" && files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profilePic: reader.result as string }));
    };
    reader.readAsDataURL(file);
  } else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");
type Payload = {
  username: string;
  email: string;
  password?: string;
};

const payload: Payload = {
  username: form.username,
  email: form.email,
  password: form.password || "", // or omit entirely
};

  if (!payload.password) delete payload.password;

  try {
    await axios.put(`https://blogs-page-njeb.onrender.com/api/users/${id}`, payload);
    router.push("/user");
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to update user");
  } finally {
    setLoading(false);
  }
};


  if (fetching) return <p className="text-center p-4">Loading user data...</p>;

  return (
    <AdminLayout>
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-semibold mb-6">Edit User</h1>

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
          <label className="block mb-1 font-medium" htmlFor="profilePic">
            Profile Picture URL
          </label>
          <input
            id="profilePic"
            name="profilePic"
            type="file" onChange={handleChange}
          
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {form.profilePic && (
            <img
              src={form.profilePic}
              alt="Profile Preview"
              className="mt-2 h-20 w-20 object-cover rounded-full border"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="password">
            Password (leave blank to keep unchanged)
          </label>
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
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
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Update User"}
        </button>
      </form>
    </div></AdminLayout>
  );
}

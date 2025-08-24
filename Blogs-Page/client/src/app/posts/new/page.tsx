"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    category: "",
  });

  const [users, setUsers] = useState<
    { _id: string; username: string }[]
  >([]);
  const [categories, setCategories] = useState<
    { _id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, catRes] = await Promise.all([
          axios.get("https://blogs-page-njeb.onrender.com/api/users"),
          axios.get("https://blogs-page-njeb.onrender.com/api/categories"),
        ]);
        setUsers(userRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to fetch users or categories", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      e.target.files
    ) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === "string") {
            setForm((prev) => ({ ...prev, image: result }));
          }
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("https://blogs-page-njeb.onrender.com/api/posts", form);
      router.push("/posts");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl w-full mx-auto mt-10 bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 rounded max-h-48 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Author</label>
            <select
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Author</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

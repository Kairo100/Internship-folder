"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";

interface User {
  _id: string;
  username: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function EditPostPage() {
const params = useParams();
const id = params.id as string;
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "", // Will be URL or base64 or uploaded image path
    author: "",
    category: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, userRes, catRes] = await Promise.all([
          axios.get(`https://blogs-page-njeb.onrender.com/api/posts/${id}`),
          axios.get("https://blogs-page-njeb.onrender.com/api/users"),
          axios.get("https://blogs-page-njeb.onrender.com/api/categories"),
        ]);

        const post = postRes.data;
        setForm({
          title: post.title,
          description: post.description,
          image: post.image,
          author: post.author?._id || "",
          category: post.category?._id || "",
        });

        setUsers(userRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`https://blogs-page-njeb.onrender.com/api/posts/${id}`, form);
      router.push("/posts");
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />

          <select
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Author</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Post
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

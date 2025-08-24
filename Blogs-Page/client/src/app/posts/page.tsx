"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

// Define the Post type matching your API data structure
interface Post {
  _id: string;
  title: string;
  date: string;
  author?: {
    username?: string;
  };
  category?: {
    name?: string;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]); // typed state here

  const fetchPosts = async () => {
    try {
      const res = await axios.get<Post[]>("https://blogs-page-njeb.onrender.com/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`https://blogs-page-njeb.onrender.com/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Posts</h1>
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Post
          </Link>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No posts found.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id}>
                    <td className="px-4 py-2">{post.title}</td>
                    <td className="px-4 py-2">{post.author?.username || "Unknown"}</td>
                    <td className="px-4 py-2">{post.category?.name || "-"}</td>
                    <td className="px-4 py-2">{new Date(post.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Link href={`/posts/${post._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                      <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile view */}
          <div className="md:hidden">
            {posts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No posts found.</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="border-b border-gray-200 p-4">
                  <h2 className="font-semibold text-lg">{post.title}</h2>
                  <p className="text-sm text-gray-600"><strong>Author:</strong> {post.author?.username || "Unknown"}</p>
                  <p className="text-sm text-gray-600"><strong>Category:</strong> {post.category?.name || "-"}</p>
                  <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
                  <div className="mt-2 flex space-x-4">
                    <Link
                      href={`/posts/${post._id}/edit`}
                      className="text-blue-600 text-sm underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 text-sm underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

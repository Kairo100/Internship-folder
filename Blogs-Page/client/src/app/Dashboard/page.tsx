"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
export default function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    posts: 0,
    users: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const apiBase = "https://blogs-page-njeb.onrender.com/api";
        const [catsRes, postsRes, usersRes] = await Promise.all([
          axios.get(`${apiBase}/categories`),
          axios.get(`${apiBase}/posts`),
          axios.get(`${apiBase}/users`),
        ]);
        setStats({
          categories: catsRes.data.length,
          posts: postsRes.data.length,
          users: usersRes.data.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    }
    fetchStats();
  }, []);

  return (
  <AdminLayout>
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/categories" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <p className="text-3xl font-bold">{stats.categories}</p>
        </Link>
        <Link href="/posts" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Posts</h2>
          <p className="text-3xl font-bold">{stats.posts}</p>
        </Link>
        <Link href="/user" className="bg-white p-6 rounded shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
        </Link>
      </div>
    </div></AdminLayout>


  );
}

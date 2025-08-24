"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/")
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 bg-white border-r border-gray-200 shadow h-screen w-64 p-6 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between md:justify-center">
          <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-xmark" />
          </button>
        </div>

        <nav className="space-y-4">
          {[
            { href: "/Dashboard", icon: "fa-folder", label: "Dashboard" },
            { href: "/categories", icon: "fa-folder", label: "Categories" },
            { href: "/posts", icon: "fa-edit", label: "Posts" },
            { href: "/user", icon: "fa-users", label: "Users" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition"
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className={`fas ${item.icon} text-blue-500`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 md:pl min-h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-white shadow z-50 flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              className="text-2xl text-gray-700 md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className={`fas ${isSidebarOpen ? "fa-xmark" : "fa-bars"}`} />
            </button>
            <img src="/logo3.png" alt="Logo" className="h-10" />
            <h1 className="text-lg font-semibold hidden md:inline text-gray-800">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link href="/Login">
                  <button className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Signup
                  </button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">Welcome Admin</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

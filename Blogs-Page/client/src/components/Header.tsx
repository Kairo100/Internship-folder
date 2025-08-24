'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Header() {
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
    <div
      className="fixed w-full top-0 bg-white p-4 flex items-center justify-between"
      style={{ zIndex: "1000" }}
    >
      <img src="/logo3.png" alt="Logo" className="h-10" />

      <div>
        {!isLoggedIn ? (
          <>
            <Link href="/Login">
              <button
                className="mr-4 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                type="button"
              >
                Login
              </button>
            </Link>

            <Link href="/signup">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                type="button"
              >
                Signup
              </button>
            </Link>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <span>Welcome!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import {
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaBook,
  FaSignOutAlt,
  FaCog,
  FaChalkboardTeacher,
  FaTimes,
  FaList
} from "react-icons/fa";

export default function Sidebar({ role, isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter(); // Initialize useRouter

  const navItems = {
    admin: [
      { name: "Dashboard", href: "/admin", icon: FaHome },
      { name: "Attendance", href: "/admin/attendance", icon: FaCalendarCheck },
      { name: "Students", href: "/admin/students", icon: FaUsers },
      { name: "Classes", href: "/admin/classes", icon: FaBook },
      { name: "Teachers", href: "/admin/teachers", icon: FaChalkboardTeacher },
      { name: "Reports", href: "/admin/reports", icon: FaList },
    ],
    teacher: [
      { name: "Dashboard", href: "/teacher", icon: FaHome },
      { name: "Mark Attendance", href: "/teacher/attendance", icon: FaCalendarCheck },
    ],
  };

  const currentNavItems = navItems[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    // Optionally, if you store user role/info, clear that too
    // localStorage.removeItem("userRole");

    router.push("/"); // Redirect to the login page
    setIsOpen(false); // Close the sidebar if it was open
  };

  return (
    <>
      {/* Overlay for small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-6 flex flex-col z-50 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="text-3xl font-bold text-green-400">Attendance</div>
          {/* Close button for mobile */}
          <button
            className="md:hidden text-white text-2xl hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {currentNavItems.map((item) => (
              <li key={item.name} className="mb-3">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Close sidebar on nav item click
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200
                    ${pathname === item.href
                      ? "bg-green-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  <item.icon className="mr-4 text-xl" />
                  <span className="text-lg">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto border-t border-gray-700 pt-6">
          <button
            onClick={handleLogout} // Call the logout handler
            className="flex items-center p-3 w-full rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-4 text-xl" />
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
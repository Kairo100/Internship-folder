

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import axios from "axios";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole) setRole(userRole);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("https://focusflow-red6.onrender.com/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className={`fas ${isSidebarOpen ? "" : "fa-bars"}`}></i>
      </button>

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
         <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880h40v331q18 11 29 28.5t11 40.5q0 33-23.5 56.5T480-400q-33 0-56.5-23.5T400-480q0-23 11-41t29-28v-86q-52 14-86 56.5T320-480q0 66 47 113t113 47q66 0 113-47t47-113q0-36-14.5-66.5T586-600l57-57q35 33 56 78.5t21 98.5q0 100-70 170t-170 70q-100 0-170-70t-70-170q0-90 57-156.5T440-717v-81q-119 15-199.5 105T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-69-27-129t-74-104l57-57q57 55 90.5 129.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-folder"></i> Dashboard
          </Link>
          <Link to="/todo" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-tasks"></i> To Do Lists
          </Link>
          <Link to="/journals" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-edit"></i> Journals
          </Link>

          {/* ✅ Show only for admins */}
          {role === "Admin"  && (
            <Link to="/users" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
              <i className="fas fa-users-cog"></i> Users
            </Link>
          )}

          <Link className="sidebar-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </nav>
      </aside>

      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
    </>
  );
}

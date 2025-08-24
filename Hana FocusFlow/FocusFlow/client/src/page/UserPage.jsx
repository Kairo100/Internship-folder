import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UsersPage.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
    const api = "https://focusflow-red6.onrender.com"; // Replace with your backend URL
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${api}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${api}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
   <div className="layout">
    <Sidebar />
    <div className="main-container">
        <Header />

         <div className="admin-layout">
      <div className="users-header">
        <h1>Users</h1>
        <Link to="/users/new" className="add-button">+ Add</Link>
      </div>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              
              <th className="hide-md">Username</th>
              <th className="hide-lg">Email</th>
              <th className="hide-lg">Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  
                  <td className="hide-md">{user.username || "-"}</td>
                  <td className="hide-lg">{user.email || "-"}</td>
                  <td className="hide-lg">{user.role || "User"}</td>
                  <td className="text-right">
                    <Link to={`/users/${user._id}/edit`} className="edit-link">Edit</Link>
                    <button onClick={() => handleDelete(user._id)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
   </div>
  );
}

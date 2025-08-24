import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserForm.css';
import Header from './Header';
import Sidebar from './Sidebar';

function UserCreatePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const api = "https://focusflow-red6.onrender.com"; // Replace with your backend URL
   console.log('Submitting:', user); // Debug
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${api}/register`, user)
      .then(() => navigate('/users'))
      .catch(err => console.error('Create error:', err));
  };

  return (
 <div className="layout">
    <Sidebar />
    <div className="main-container">
        <Header />
           <div className="user-form-container">
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit} className="user-form">
        
        <label>Username:
          <input type="text" name="username" value={user.username} onChange={handleChange} required />
        </label>
        <label>Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </label>
        
        <label>Password:
          <input type="password" name="password" value={user.password} onChange={handleChange} required />
        </label>
        <label>Role:
          <select name="role" value={user.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <button type="submit" className="btn-save">Create User</button>
      </form>
    </div>
    </div>
 </div>
  );
}

export default UserCreatePage;

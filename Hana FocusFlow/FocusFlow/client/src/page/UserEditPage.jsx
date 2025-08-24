import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserForm.css'; // Shared CSS file
import Sidebar from './Sidebar';
import Header from './Header';

function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    profilePic: '',
    role: 'User',
  });
  const api = "https://focusflow-red6.onrender.com"; // Replace with your backend URL
  useEffect(() => {
    axios.get(`${api}/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error('Fetch error:', err));
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${api}/users/${id}`, user)
      .then(() => navigate('/users'))
      .catch(err => console.error('Update error:', err));
  };

  return (
   <div className="layout">
    <Sidebar />
    <div className="main-container">
        <Header/>
         <div className="user-form-container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="user-form">
       
        <label>Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
        </label>
        
        <label>Role:
          <select name="role" value={user.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </label>
        <button type="submit" className="btn-save">Save Changes</button>
      </form>
    </div>
    </div>
   </div>
  );
}

export default UserEditPage;

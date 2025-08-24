import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
 const navigate = useNavigate();


  const api = "https://focusflow-red6.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const res = await axios.get(`${api}/me`, {
         withCredentials:true
        });

        setUser({
          username: res.data.username,
          email: res.data.email ,
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate passwords match if password is entered
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const updateData = { username: user.username };
      if (password.trim()) updateData.password = password;

      await axios.put(`${api}/me`, updateData, {
      withCredentials:true
      });

      setMessage("Profile updated successfully.");
      setPassword("");
      setConfirmPassword("");
        navigate("/dashboard");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="main-container">Loading profile...</div>;
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div>
          <h2 className="title">Your Profile</h2>

        <div className="profile-card">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <label>
              Username:
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                required
              />
            </label>

            <label>
              Email:
              <input type="email" value={user.email} disabled />
            </label>

            <label>
              New Password:
              <input
                type="password"
                value={password}
                placeholder="Leave blank to keep current password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <button type="submit" className="update-btn">
              Update Profile
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

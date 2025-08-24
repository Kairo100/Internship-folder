import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");
    if (!username || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    try {

        const api = "https://focusflow-red6.onrender.com" // Replace with your backend URL
      const res = await axios.post(
        `${api}/register`,
        { username, email, password }
      );

      if (res.data === "User registered successfully") {
        navigate("/signin");
      } else {
        setError(res.data || "Registration failed");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Network error, please try again later");
      }
    }
  };

  return (
    <div className="main-container-sign">

      <div className="form-container">
        <input
          type="text"
          placeholder="Name"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSignUp}>
          Sign Up
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        <br />
        <Link to="/signin">Already have an account? Sign In</Link>
      </div>
    </div>
  );
};

export default SignUpPage;

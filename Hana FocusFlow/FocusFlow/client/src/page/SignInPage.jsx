import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    try {

         const api = "https://focusflow-red6.onrender.com" // Replace with your backend URL
      const res = await axios.post(
        `${api}/login`,
        { email, password },
        { withCredentials: true } 
      );

     if (res.data.token) {
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.role);


  navigate("/dashboard");
}
 else {
        setError(res.data || "Login failed");
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
     <div className="sign">
      
      <div className="form-container">
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
        <button className="submit-btn" onClick={handleSignIn}>
          Sign In
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        <br />
        <Link to="/signup">Don't have an account? Sign Up</Link>
      </div>
    </div>
   </div>
  );
};

export default SignInPage;

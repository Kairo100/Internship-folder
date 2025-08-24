import React, { useEffect, useState } from "react";
import  {jwtDecode }from "jwt-decode";
import { Link } from "react-router-dom";

import "./Header.css";
export default function Header() {
   const [userName, setUserName] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const name = decoded.username || decoded.name || "User";
      setUserName(name);
    } catch (err) {
      console.error("Invalid token:", err);
      setUserName("User");
    }
  } else {
    setUserName("Guest");
  }
}, []);


  return (
    <header className="custom-header">
      <div className="header-left">
        <span className="user-name">    {userName ? `Welcome, ${userName}` : "Loading..."}</span>
      </div>
      <div className="header-right">
      <Link to="/profile">  <i className="fas fa-user-circle profile-icon"></i></Link>
      </div>
    </header>
  );
}

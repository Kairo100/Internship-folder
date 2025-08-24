// src/page/ToDoOverview.jsx
import React from "react";
import "./ToDoOverview.css";
import { Link } from "react-router-dom";

const ToDoOverview = () => {
  return (
    <div className="main-container">
      <h1 className="page-title">To-Do Lists</h1>
      <ul className="list-section">
        <li><Link to="/todo/2025-05-20">May 20, 2025</Link></li>
        <li><Link to="/todo/2025-05-19">May 19, 2025</Link></li>
      </ul>
    </div>
  );
};

export default ToDoOverview;

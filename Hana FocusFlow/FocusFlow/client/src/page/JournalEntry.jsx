// src/page/JournalEntry.jsx
import React from "react";
import "./JournalEntry.css";

const JournalEntry = () => {
  return (
    <div className="main-container">
      <h1 className="page-title">Apr 21 - Gratefulness</h1>
      <p className="journal-content">Today I felt very thankful for...</p>
      <div className="action-buttons">
        <button className="edit-btn">✏️ Edit</button>
        <button className="delete-btn">🗑️ Delete</button>
      </div>
    </div>
  );
};

export default JournalEntry;

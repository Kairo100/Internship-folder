

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const JournalDashboard = () => {
  const [latestJournal, setLatestJournal] = useState(null);
  const api = "https://focusflow-red6.onrender.com"; // Replace with your backend URL

  useEffect(() => {
    axios
      .get(`${api}/journals`, { withCredentials: true })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestJournal(sorted[0] || null);
      })
      .catch((err) => {
        console.error("Failed to fetch journals:", err);
      });
  }, []);

  return (
    <div className="journal-card">
      <div className="journal-header">

          <Link
                        to={`/journal/edit/${latestJournal?._id}`}
                        className="header-text"
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                          fontWeight: "bold",
                          transition: "color 0.3s",
                        }}
                        onMouseOver={(e) => (e.target.style.color = "#511f54")}
                        onMouseOut={(e) => (e.target.style.color = "#fff")}
                      >
                      {latestJournal?.title || "No Journal Entries Yet"}
                      </Link>
     
      </div>

      <div className="journal-content" style={{color:"white"}}>
        {latestJournal?.content ? (
          latestJournal.content
        ) : (
          <div className="journal-placeholder">
            <Link to="/journal/create">
              <i className="fas fa-plus placeholder-icon"></i>
            </Link>
            <p style={{ marginTop: "10px" }}>Add your first journal entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalDashboard;

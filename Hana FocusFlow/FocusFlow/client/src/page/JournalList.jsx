import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./JournalList.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const api = "https://focusflow-red6.onrender.com"; // Your backend URL

  useEffect(() => {
    axios
      .get(`${api}/journals`, { withCredentials: true })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setJournals(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch journal entries:", err);
      });
  }, []);

  return (
  <div className="layout">
    <Sidebar />
    <div className="main-container">
      <Header/>
        <main className="journal-main-container">
     
        <h1 className="journal-page-title">Your Journal Entries</h1>
      

      {journals.length === 0 ? (
        <p className="no-journals-msg">No journal entries found. Start writing!</p>
      ) : (
        <ul className="journal-list-section" aria-label="Journal Entries List">
          {journals.map((entry) => (
            <li key={entry._id} className="journal-list-item">
              <Link to={`/journal/edit/${entry._id}`} className="journal-link" aria-label={`Read journal entry titled ${entry.title}`}>
                <div className="journal-item-header">
                  <h2 className="journal-title">{entry.title}</h2>
                  <time
                    dateTime={new Date(entry.createdAt).toISOString()}
                    className="journal-date"
                  >
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <p className="journal-snippet">
                  {entry.content.length > 120
                    ? entry.content.slice(0, 120) + "…"
                    : entry.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

        {/* Fixed Add Button */}
              <button
               
                className="fixed-add-button"
                aria-label="Add New To-Do"
              >
                <Link to="/journal/create">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  width="30px"
                  height="30px"
                >
                  <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                </svg>
                </Link>
              </button>
    </main>
    </div>
  </div>
  );
};

export default JournalList;


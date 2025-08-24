import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./JournalEdit.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const JournalEdit = () => {
  const { id } = useParams(); // journal ID
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const api = "https://focusflow-red6.onrender.com"; // backend URL

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${api}/journals/${id}`, { withCredentials: true })
      .then((res) => {
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load journal entry.");
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    const updatedJournal = { title: title.trim(), content: content.trim() };

    axios
      .put(`${api}/journals/${id}`, updatedJournal, { withCredentials: true })
      .then(() => {
        navigate("/journals");
      })
      .catch(() => {
        setError("Failed to update the journal. Please try again.");
      });
  };

  const handleDelete = () => {
    
      axios
        .delete(`${api}/journals/${id}`, { withCredentials: true })
        .then(() => {
          navigate("/journals");
        })
        .catch(() => {
          setError("Failed to delete the journal. Please try again.");
        });
    
  };

  if (loading) {
    return (
      <div className="journal-edit-container">
        <p className="loading-text">Loading journal entry...</p>
      </div>
    );
  }

  return (
  <div className="layout">
    <Sidebar />
    <div className="main-container">
      <Header />
        <main className="journal-edit-container">
      <h1 className="page-titl">Edit Journal Entry</h1>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="journal-edit-form" noValidate>
        <label htmlFor="title" className="input-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="text-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title"
          maxLength={100}
          required
        />

        <label htmlFor="content" className="input-label">
          Content
        </label>
        <textarea
          id="content"
          className="textarea-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your journal entry here..."
          rows={10}
          maxLength={5000}
          required
        />

        <button
          type="submit"
          className="save-bt"
          aria-label="Save journal changes"
        >
          Save Changes
        </button>
      </form>

       <button className="delete-btn" onClick={handleDelete} style={{marginTop:"20px"}}>
              Delete 
            </button>
    </main>
    </div>
  </div>
  );
};

export default JournalEdit;

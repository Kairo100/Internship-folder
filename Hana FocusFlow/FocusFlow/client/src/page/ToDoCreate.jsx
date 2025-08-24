import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./ToDoCreate.css";

const ToDoCreate = () => {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([{ task: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const api = "https://focusflow-red6.onrender.com";

  const handleAddTask = () => {
    setTasks([...tasks, { task: "" }]);
  };

  const handleTaskChange = (index, e) => {
    const newTasks = [...tasks];
    newTasks[index].task = e.target.value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const filteredTasks = tasks.filter((t) => t.task.trim() !== "");

    if (!title.trim() || filteredTasks.length === 0) {
      setError("Title and at least one valid task are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${api}/todos`,
        { title, tasks: filteredTasks },
        { withCredentials: true }
      );

      console.log("To-Do Created:", response.data);
      navigate("/todo");
    } catch (err) {
      console.error("Failed to create to-do:", err);
      setError("Failed to create to-do. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div>
    <Sidebar />
     <div className="main-container ">
        <Header />
        
      <div className="main">
        <h1 className="page-title">Create New To-Do List</h1>
      <form className="todo-create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            className="form-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter to-do title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tasks</label>
          {tasks.map((task, index) => (
            <div key={index} className="task-input-wrapper">
              <input
                type="text"
                className="form-input task-input"
                value={task.task}
                onChange={(e) => handleTaskChange(index, e)}
                placeholder={`Task ${index + 1}`}
                required={index === 0}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-add-task"
            onClick={handleAddTask}
            disabled={loading}
          >
            + Add Task
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="save-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save To-Do List"}
        </button>
      </form>
      </div>
    </div>
   </div>
  );
};

export default ToDoCreate;

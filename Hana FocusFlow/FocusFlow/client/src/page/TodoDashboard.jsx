import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const TodoDiv = () => {
  const [latestTodo, setLatestTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const api = "https://focusflow-red6.onrender.com"; // Replace with your backend URL

  useEffect(() => {
    axios
      .get(`${api}/todos`, { withCredentials: true })
      .then((res) => {
        // Sort todos by createdAt descending
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestTodo(sorted[0] || null); // Set latest or null if empty
      })
      .catch((err) => {
        console.error("Failed to fetch to-do list:", err);
      });
  }, []);

  const handleCheckboxToggle = (index) => {
    if (!latestTodo) return;

    const updatedTasks = latestTodo.tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );

    setLoading(true);

    axios
      .put(
        `${api}/todos/${latestTodo._id}`,
        {
          title: latestTodo.title,
          tasks: updatedTasks,
        },
        {
           withCredentials: true 
        }
      )
      .then((res) => {
        setLatestTodo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to update task:", err);
        setLoading(false);
      });
  };

  return (
   
      
        <div className="todo-card">
          <div className="todo-header">
 <div className="header-text">
                  <Link
                to={`/todo/edit/${latestTodo?._id}`}
                className="header-text"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: "bold",
                  transition: "color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.color = "#2D142E")}
                onMouseOut={(e) => (e.target.style.color = "#fff")}
              >
           {latestTodo?.title || "No To-Do List Yet"}
              </Link>
           </div>
          </div>

          <div className="task-section">
            {!latestTodo || !latestTodo.tasks || latestTodo.tasks.length === 0 ? (
              <div
                className="task-item"
                style={{
                  fontStyle: "italic",
                  color: "#888",
                  padding: "10px 0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  height: "100px",
                }}
              >
                <Link to="/todo/create" style={{ fontWeight: "bold", color: "#007bff", textDecoration: "none" }}>
                <i className="fas fa-plus" style={{ color: "#fff", fontSize: "46px" }}></i>
                </Link>
               
              </div>
            ) : (
              latestTodo.tasks.map((task, index) => (
                <div
                  className="task-item"
                  key={index}
                  
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", padding: "5px 0" }}
                >
                

                  <input
    type="checkbox"
    checked={task.completed}
    onChange={() => handleCheckboxToggle(index)}
    style={{
                      border: "2px solid #ccc",
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      accentColor: task.completed ? "#2D142E" : "#ccc",
                    }}
  />
                  <div
                    className="task-text"
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#2D142E" : "white",
                    }}
                  >
                    {task.task}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
  
  
  );
};

export default TodoDiv;

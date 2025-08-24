import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./ToDoList.css"; 
import { Link } from "react-router-dom";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const api = "https://focusflow-red6.onrender.com"; // Replace with your backend URL

  useEffect(() => {
    axios
      .get(`${api}/todos`, { withCredentials: true })
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTodos(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch to-do lists:", err);
      });
  }, []);



 const handleCheckboxToggle = (todoId, taskIndex) => {
  const todoToUpdate = todos.find((t) => t._id === todoId);
  if (!todoToUpdate) return;

  const updatedTasks = todoToUpdate.tasks.map((task, i) =>
    i === taskIndex ? { ...task, completed: !task.completed } : task
  );

  const updatedTodo = { ...todoToUpdate, tasks: updatedTasks };

  axios
    .put(
      `${api}/todos/${todoToUpdate._id}`,
      {
        title: updatedTodo.title,
        tasks: updatedTasks,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      // Update just the changed todo
      setTodos((prev) =>
        prev.map((t) => (t._id === res.data._id ? res.data : t))
      );
    })
    .catch((err) => {
      console.error("Failed to update task:", err);
    });
};

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-container">
        <Header />
        <div className="all-todos-container">
      <h2 className="page-title">My To-Do History</h2>

      {todos.length === 0 ? (
        <p style={{ color: "#ccc", textAlign: "center" }}>No to-do lists available.</p>
      ) : (
        <div className="todo-grid">
          {todos.map((todo, idx) => (
            <div key={todo._id || idx} className="todo-card">
              <div className="todo-header">
               <Link
    to={`/todo/edit/${todo._id}`}
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
    {todo.title}
  </Link>
              </div>

              <div className="task-section">
                {todo.tasks.length === 0 ? (
                  <p style={{ color: "#888", fontStyle: "italic" }}>No tasks added.</p>
                ) : (
                  todo.tasks.map((task, i) => (
                    <div
                      className="task-item"
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "5px 0",
                      }}
                    >
                            <input
  type="checkbox"
  checked={task.completed}
  onChange={() => handleCheckboxToggle(todo._id, i)}
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
          ))}
        </div>
      )}

        {/* Fixed Add Button */}
        <button
          onClick={() => navigate("/todo/create")}
          className="fixed-add-button"
          aria-label="Add New To-Do"
        >
          <Link to="/todo/create">
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
    </div>
    
      </div>
    </div>
  );
};

export default ToDoList;

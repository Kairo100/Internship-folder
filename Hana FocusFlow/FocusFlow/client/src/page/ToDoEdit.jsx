import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ToDoEdit.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ToDoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios
      .get(`https://focusflow-red6.onrender.com/todos/${id}`, { withCredentials: true })
      .then((res) => {
        setTodo(res.data);
        setTitle(res.data.title);
      })
      .catch((err) => console.error("Failed to fetch:", err));
  }, [id]);

  const handleTaskChange = (index, newTask) => {
    const updatedTasks = [...todo.tasks];
    updatedTasks[index].task = newTask;
    setTodo({ ...todo, tasks: updatedTasks });
  };

  const handleTaskToggle = (index) => {
    const updatedTasks = [...todo.tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTodo({ ...todo, tasks: updatedTasks });
  };

  const handleAddTask = () => {
    const updatedTasks = [...(todo.tasks || []), { task: "", completed: false }];
    setTodo({ ...todo, tasks: updatedTasks });
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = todo.tasks.filter((_, i) => i !== index);
    setTodo({ ...todo, tasks: updatedTasks });
  };

  const handleUpdate = () => {
    const updatedTodo = { ...todo, title };
    axios
      .put(`https://focusflow-red6.onrender.com/todos/${id}`, updatedTodo, { withCredentials: true })
      .then(() => navigate("/todo"))
      .catch((err) => console.error("Update failed:", err));
  };

  const handleDelete = () => {
    axios
      .delete(`https://focusflow-red6.onrender.com/todos/${id}`, { withCredentials: true })
      .then(() => navigate("/todo"))
      .catch((err) => console.error("Delete failed:", err));
  };

  if (!todo) return <div>Loading...</div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-container edit">
        <Header />
        <div className="edit-todo-container">
          <h2>Edit To-Do</h2>
          <input
            type="text"
            className="edit-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="To-do title"
          />

          <div className="tasks-list">
            {todo.tasks.length === 0 && <p style={{ color: "#888", fontStyle: "italic" }}>No tasks yet. Add one!</p>}
            {todo.tasks.map((task, index) => (
              <div key={index} className="task-row">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(index)}
                  className="task-checkbox"
                />
                <input
                  type="text"
                  value={task.task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  className={`edit-task-input ${task.completed ? "completed" : ""}`}
                  placeholder="Task description"
                />
                <button className="delete-task-btn" onClick={() => handleDeleteTask(index)} aria-label="Delete task">
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button className="add-task-btn" onClick={handleAddTask}>
            + Add Task
          </button>

          <div className="edit-buttons">
            <button className="update-btn" onClick={handleUpdate}>
              Update
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete To-Do
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoEdit;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import WelcomePage from './componets/WelcomePage';
import LoginPage from './componets/LoginPage';
import SignupPage from './componets/SignupPage';
import HomePage from './componets/HomePage';
import ToDoListPage from './componets/ToDoListPage';
import SingleToDoPage from './componets/SingleToDoPage';
import JournalPage from './componets/JournalPage';
import SingleJournalPage from './componets/SingleJournalPage';
import ProfilePage from './componets/ProfilePage';
 
import Sidebar from './componets/Sidebar';
import Navbar from './componets/Navbar';
 
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
 
        {/* Protected Routes (With Sidebar + Navbar) */}
        <Route
          path="/home"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/todo"
          element={
            <AppLayout>
              <ToDoListPage />
            </AppLayout>
          }
        />
        <Route
          path="/todo/:id"
          element={
            <AppLayout>
              <SingleToDoPage />
            </AppLayout>
          }
        />
        <Route
          path="/journal"
          element={
            <AppLayout>
              <JournalPage />
            </AppLayout>
          }
        />
        <Route
          path="/journal/:id"
          element={
            <AppLayout>
              <SingleJournalPage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};
 
// Reusable Layout Component for all internal routes
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};
 
export default App;
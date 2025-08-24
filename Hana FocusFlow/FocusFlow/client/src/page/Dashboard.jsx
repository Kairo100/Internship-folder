import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import TodoDiv from "./TodoDashboard";
import JournalDashboard from "./JournalDashboard";
const Dashboard = () => {


  return (
    <>
     <div className="layout">
      <Sidebar /> 
     
      <div className="main-container">
        <Header />
         <div className="main-contact">
           <TodoDiv />
          <JournalDashboard />
         </div>
     
   
        </div>
    
      
    </div>
    
    </>
  );
};

export default Dashboard;

import React from "react";
import AllRoute from "../router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <div className="App" id="scrool">
       <HelmetProvider>
      <AllRoute />
      <ToastContainer />
      </HelmetProvider>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage3 from "../HomePage3/HomePage3";
import AboutPage from "../AboutPage/AboutPage";
import CausePagethre from "../CausePagethre/CausePagethre";
import CauseSinglePage from "../CauseSinglePage/CauseSinglePage";
import ServicePage from "../ServicePage/ServicePage";
import ServiceSinglePage from "../ServiceSinglePage/ServiceSinglePage";
import ContactPage from "../ContactPage/ContactPage";
import LoginPage from "../LoginPage/index";
import ForgotPassword from "../ForgotPassword/index";
import Donate from "../DonatePage/Donate";
import VerifyPaystack from "../VerifyPaystackPage/VerifyPaystack";
import PrivacyPolicy from "../../components/footer/PrivacyPolicy";
import { ProjectProvider } from "../../api/ProjectsContext";
import Preloader from "../../components/Navbar/Preloader";
import TermsOfUse from "../../components/footer/Terms";

const AllRoute = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <div className="App">
      <BrowserRouter>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<HomePage3 />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<CausePagethre />} />
            <Route path="projects/:id" element={<CauseSinglePage />} />
            <Route
              path="/projects/category/:category"
              element={<CausePagethre />}
            />

            <Route path="how-it-works" element={<ServicePage />} />
            <Route path="how-it-works/:slug" element={<ServiceSinglePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="donate/:id" element={<Donate />} />
            <Route
              path="/payment/verify-paystack"
              element={<VerifyPaystack />}
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
          </Routes>
        </ProjectProvider>
      </BrowserRouter>
    </div>
  );
};

export default AllRoute;

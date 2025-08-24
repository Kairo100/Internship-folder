import React, { Fragment , useState, useEffect } from 'react';
// import Topbar from '../../components/Topbar/Topbar';
import Navbar from '../../components/Navbar/Navbar'
import Hero3 from '../../components/hero3/hero3';
import AboutSection3 from '../../components/about3/about3';
import FunFact from '../../components/FunFact/FunFact';
import CausesSecionS3 from '../../components/CausesSecionS3/CausesSecionS3';
import CtaSection from '../../components/CtaSection/CtaSection';
import PartnersSection from '../../components/PartnersSection/PartnersSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import FeatureSection from '../../components/FeatureSection/FeatureSection';
import Logo from '../../images/logo2.png'
import { Link, useNavigate } from "react-router-dom";
import Preloader from '../../components/Navbar/Preloader';



const HomePage3 = () => {

 const navigate = useNavigate();
  

    const SubmitHandler = (e) => {
        e.preventDefault()
    }
    return (
        <Fragment>
            {/* <Topbar /> */}
            <Navbar Logo={Logo} hclass="wpo-site-header-s3" />
            <Hero3 />
            <FunFact hclass="wpo-fun-fact-section-s3" />
            <CtaSection />
           
            <CausesSecionS3 hclass={"wpo-causes-section-s3"} />
             {/* View All Button */}
             <div className="d-flex justify-content-center">
                        <button className="theme-btn" onClick={() => navigate("/projects")}>View All Causes</button>
                    </div>
            <AboutSection3 />
            <FeatureSection />
            <ServiceSection hclass={"wpo-service-section s2"} />
           

                
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default HomePage3;
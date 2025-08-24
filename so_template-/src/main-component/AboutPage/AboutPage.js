import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import About from '../../components/about/about';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo2.png'
const AboutPage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s3'} />
            <PageTitle pageTitle={'About Us'} pagesub={'About'} />
            <About />
            
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default AboutPage;

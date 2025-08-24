import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import ServiceSection from '../../components/ServiceSection/ServiceSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo2.png'
const ServicePage = () => {
    return (
        <Fragment>
           <Navbar Logo={Logo} hclass={'wpo-site-header-s3'}  />
            <PageTitle pageTitle={'How is it works?'} pagesub={'How is it works?'} />
            <ServiceSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ServicePage;

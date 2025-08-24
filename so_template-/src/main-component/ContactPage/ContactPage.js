import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import ContactSection from '../../components/ContactSection/ContactSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Logo from "../../images/logo2.png"

const ContactPage = () => {
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s3'} />
            <PageTitle pageTitle={'Contact Us'} pagesub={'Contact'} />
            <ContactSection />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ContactPage;


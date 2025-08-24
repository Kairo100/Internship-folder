import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CausesSecionS3 from '../../components/CausesSecionS3/CausesSecionS3';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Logo from '../../images/logo2.png'
import { useParams } from 'react-router-dom';

const CausePageOn = () => {
     const { category } = useParams();

    const formattedTitle = category 
        ? decodeURIComponent(category) 
        : 'Projects';
    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s3'} />
            
            {/* <PageTitle pageTitle={'Projects'} pagesub={'Projects'} /> */}
             <PageTitle 
                pageTitle={formattedTitle} 
                pagesub={formattedTitle} 
            />
            <CausesSecionS3 hclass={"wpo-causes-section-s3 s2 section-padding"} />
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CausePageOn;


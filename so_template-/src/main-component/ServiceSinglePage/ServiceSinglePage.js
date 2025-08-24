import React, { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Services from '../../api/Services';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import Logo from '../../images/logo2.png';

const ServiceSinglePage = () => {
    const { slug } = useParams();
    const serviceDetails = Services.find(item => item.slug === slug);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media (max-width: 768px) {
                .service-step {
                    flex-direction: column !important;
                }
                .service-step-text, .service-step-image {
                    flex: 1 1 100% !important;
                    padding-right: 0 !important;
                    margin-top: 20px;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s3'} />
            <PageTitle pageTitle={serviceDetails.title} pagesub={'How it works'} />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px' }}>
             

                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>
                    How to {serviceDetails.title}:
                </h2>

                {serviceDetails.steps?.map((step, index) => (
                    <div
                        key={index}
                        className="service-step"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            marginTop: '40px',
                            paddingBottom: '40px',
                            borderBottom: '1px solid #eee',
                            gap: '20px'
                        }}
                    >
                        {/* Left: Text */}
                        <div className="service-step-text" style={{ flex: '1 1 62%', paddingRight: '10px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                                {index + 1}. {step.title}
                            </h3>
                            <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: '1.8' }}>
                                {step.description?.split('\n').map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                            {step.fullGuide && (
                                <div style={{ marginTop: '10px', color: '#555' }}>
                                    <p>{step.fullGuide}</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Optional Image */}
                        {step.icon && (
                           <div
                           className="service-step-image"
                           style={{
                             flex: '1 1 33%',
                            
                             padding: '15px',
                             borderRadius: '12px',
                             textAlign: 'center',
                             alignItems:"center"
                           }}
                         >
                           <i
                             className={step.icon}
                             style={{
                               fontSize: '36px',
                               color: '#2d8f69',
                               width: '150px',
                               height: '150px',
                               display: 'inline-flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               borderRadius: '50%',
                               backgroundColor: '#d4f3e6',
                               margin: 'auto'
                             }}
                           ></i>
                         </div>
                         
                        )}
                    </div>
                ))}
            </div>

            <Footer />
            <Scrollbar />
        </Fragment>
    );
};

export default ServiceSinglePage;

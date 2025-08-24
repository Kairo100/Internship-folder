import React from 'react'
import { Link } from 'react-router-dom'
// import abImg1 from '../../images/about/img-1.jpg'
import abImg1 from '../../images/about/img-1 (2).jpg'
// import abImg2 from '../../images/about/img-2.jpg'
import abImg2 from '../../images/about/img-2 (2).jpg'
import GallerySection from './gallerySection'
import SuccessStorySection from './SuccessStorySection'
import PartnersSection from '../PartnersSection/PartnersSection'

const About = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    

    return (
        <section className="wpo-about-section section-padding">
            <div className="container">
                <div className="wpo-about-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-img">
                                <div className="wpo-about-left">
                                    <img src={abImg2} alt="img"  style={{ height: "250px", width:"400px", borderRadius:"10px" }}  />
                                </div>
                                <div className="wpo-about-right">
                                    <img src={abImg1} alt="img" style={{ height: "250px", width:"300px", borderRadius:"10px" }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-text">
                                <div className="wpo-section-title">
                                    <span>Welcome to Sokaab</span>
                                    <h1 style={{fontWeight:"600"}}>Connecting Somali Communities</h1>
                                </div>
                                <p>Sokaab is the first Somali crowdfunding platform, dedicated to supporting communities and organizations in launching and funding impactful projects. Our goal is to create a thriving ecosystem where generosity fuels positive change.</p>

                                <div className="about-info-wrap">
                                    <div className="about-info-item">
                                        
                                        <div className="about-info-text ">
                                        <div className="about-info-icon">
                                            <div className="icon">
                                             <i className="fi fa-solid fa-bullseye " ></i>
                                            </div>
                                        </div>
                                            <h4>Our Mission</h4>
                                           <div> <p>Inspire change by empowering community and individuals to take initiatives, collaborate among themselves and build trust.</p></div>
                                        </div>
                                    </div>
                                    <div className="about-info-item">
                                        
                                        <div className="about-info-text">
                                        <div className="about-info-icon">
                                            <div className="icon">
                                              <i className="fi fa-solid fa-mountain"></i>
                                            </div>
                                        </div>
                                            <h4>Our Vision</h4>
                                            <p>We value Empowerment, Integrity, Collaboration, Equality, Transparency, and Accountability in all we do.</p>
                                        </div>
                                    </div>
                                </div>

              
                            </div>
                            
                        </div>

<div style={{ marginTop: '50px', padding: '0 20px' }}>
    <div className="row ">

        {/* Section 1 */}
        <div className="col-12 col-sm-6 col-md-6">
            <div style={{
                backgroundColor: '#2C3E50', padding: '30px', marginBottom: '30px', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease-in-out'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>

                <div style={{
                    display: 'flex', flexDirection:"column", alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                    <i className="fas fa-globe-americas" style={{ fontSize: '35px', color: '#00CC99', marginRight: '15px', marginBottom: '20px' }}></i>
                    <h3 style={{ fontSize: '24px', color: '#fff', fontWeight: '600' }}>Our Vision</h3>
                </div>

                <p style={{ fontSize: '16px', color: '#f0f3f6', lineHeight: '1.6' }}>
                    We envision a world where the communities take the lead in creating their own future. SOKAAB is the first Somali-based crowdfunding platform for organisations and communities that aim to support communities and youth initiatives across the Somali regions.
                </p>
            </div>
        </div>

        {/* Section 2 */}
        <div className="col-12 col-sm-6 col-md-6">
            <div style={{
                backgroundColor: '#2C3E50', padding: '30px', marginBottom: '30px', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease-in-out'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>

                <div style={{
                    display: 'flex', flexDirection:"column", alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                    <i className="fas fa-users" style={{ fontSize: '35px', color: '#00CC99', marginRight: '15px', marginBottom: '20px' }}></i>
                    <h3 style={{ fontSize: '24px', color: '#fff', fontWeight: '600' }}>Our Community</h3>
                </div>

                <p style={{ fontSize: '16px', color: '#f0f3f6', lineHeight: '1.6' }}>
                    Through crowdfunding initiatives, the community will be able to channel their collective efforts to realize common projects that matter to Somalis. For too long, decisions on what gets to be funded have been taken by everyone except the communities most affected by this decision.
                </p>
            </div>
        </div>

    

    </div>
    <div className="row  ">

      
        {/* Section 3 */}
        <div className="col-12 col-sm-6 col-md-6">
            <div style={{
                backgroundColor: '#2C3E50', padding: '30px', marginBottom: '30px', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease-in-out'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>

                <div style={{
                    display: 'flex', flexDirection:"column", alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                    <i className="fas fa-hand-holding-heart" style={{ fontSize: '35px', color: '#00CC99', marginRight: '15px', marginBottom: '20px' }}></i>
                    <h3 style={{ fontSize: '24px', color: '#fff', fontWeight: '600' }}>Our Commitment</h3>
                </div>

                <p style={{ fontSize: '16px', color: '#f0f3f6', lineHeight: '1.6' }}>
                    We aspire to empower the community by letting them create positive changes in their communities and to create opportunities for themselves, but this cannot be achieved without you. Working close with our partners, we work on a case-by-case basis on every project to ensure that there is a real need. We make sure that funds are used appropriately to maximize the success in every community and for each communities.
                </p>
            </div>
        </div>

        {/* Section 4 */}
        <div className="col-12 col-sm-6 col-md-6">
            <div style={{
                backgroundColor: '#2C3E50', padding: '30px', marginBottom: '30px', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease-in-out'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>

                <div style={{
                    display: 'flex', flexDirection:"column", alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                    <i className="fas fa-calendar-check" style={{ fontSize: '35px', color: '#00CC99', marginRight: '15px', marginBottom: '20px' }}></i>
                    <h3 style={{ fontSize: '24px', color: '#fff', fontWeight: '600' }}>Our Future</h3>
                </div>

                <p style={{ fontSize: '16px', color: '#f0f3f6', lineHeight: '1.6' }}>
                   Our mission is to ensure that only high-potential projects receive endorsement on our platform through a transparent and accountable appraisal panel. To achieve our goals, we offer dedicated support and training to every community that engages with our platform. In partnership with aligned organizations, we go the extra mile to empower promising initiatives—providing matching funds that amplify their impact.  </p>
            </div>
        </div>

    </div>
</div>

                       </div>     <SuccessStorySection />
                    <PartnersSection />
                    <GallerySection />
                </div>
            </div>
        </section>
    )
}

export default About;

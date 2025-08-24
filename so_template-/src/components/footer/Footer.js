import { Link } from 'react-router-dom';
import Logo from "../../images/logo3.png";
import Services from '../../api/Services';

const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const Footer = (props) => {
    return (
        <footer className="wpo-site-footer">
            <div className="wpo-top-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="widget">
                                <div className="logo">
                                    <Link className="navbar-brand" to="/">
                                        <img src={Logo} alt="Sokaab Logo" style={{width:"342px", height:"100px"}} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="widget">
                                <div className="social">
                                    <ul>
                                    <li><a href='https://www.facebook.com/people/Sokaab/100079496871498/#' target='_blank'> <i class="fi fa-brands fa-square-facebook"></i></a></li>
                                <li><a href='https://x.com/SOKAAB2' target='_blank'><i className="fi fab fa-x-twitter" target="_blank"></i></a></li>
                                <li><a href='https://www.youtube.com/channel/UCaYsgDii78pi54BMpD5Sevg' target='_blank'><i class="fi fa-brands fa-youtube"></i></a></li>
                       
                                     
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="widget-title">
                                    <h3>About Sokaab</h3>
                                </div>
                                <p>Sokaab is a crowdfunding platform empowering communities, donors, and partners to support impactful projects in Somaliland and Somalia. We connect people with the causes that matter most.</p>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Quick Links</h3>
                                </div>
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="about">Who We Are</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                    
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget s2">
                                <div className="widget-title">
                                    <h3>How It Works</h3>
                                </div>
                                <ul>
                                    {Services.map((service, index) => (
                                        <li key={index}>
                                            <Link onClick={ClickHandler} to={`/how-it-works/${service.slug}`}>
                                                {service.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget newsletter-widget">
                                <div className="widget-title">
                                    <h3>Contact Us</h3>
                                </div>
                                <p>Have a question? Get in touch with our team to learn more about how Sokaab works.</p>
                                {/* <ul className="info">
                                  <li><i className="fa-solid fa-envelope"></i> info@sokaab.com</li>
                                   <li><i className="fa-solid fa-phone"></i> + 252 2 515777 </li>
                                   <li><i className="fa-solid fa-location-dot"></i> Hargeisa,Somaliland </li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col col-lg-6 col-md-12 col-12">
                            <ul>
                            <li>
                     &copy; {new Date().getFullYear()} <Link to="/">Sokaab</Link>. All rights reserved.
                                </li>

                            </ul>
                        </div>
                        <div className="col col-lg-6 col-md-12 col-12">
                            <div className="link">
                                <ul>
                                    <li><Link to="/privacy">Privacy Policy</Link></li>
                                    <li><Link to="/terms">Terms Of Use</Link></li>
                                
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer-area footer-wave pt-100 p-r z-1 bg-color text-white  ">
      <div className="container ">
        <div className="row pt-5 ">
          {/* First Section  */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="footer-widget footer-about-widget mb-40 pr-lg-70 wow fadeInDown">
              <div className="widget-content">
                <div className="footer-logo mb-25">
                  <Link legacyBehavior href="/index">
                    <img
                      src="/images/sokaab_logo.png"
                      alt="Company Logo"
                      className="img-fluid"
                      style={{ maxWidth: "200px" }}
                    />
                  </Link>
                </div>
                <p>
                  Our company provides top-notch services to meet your needs.
                  We specialize in innovative solutions for your business.
                </p>
                <div className="social-links pb-5 ">
                  <a href="https://facebook.com" target="_blank" className="social-icon " >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://linkedin.com" target="_blank" className="social-icon">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="col-lg-2 col-md-6 col-sm-12 mt-sm-1 pb-5">
            <div className="footer-widget footer-nav-widget mb-40 wow fadeInDown">
              <h4 className="widget-title" style={{color:"var(--accent-color)"}}>Quick Links</h4>
              <div className="widget-content">
                <ul className="footer-nav ">
                  <li className="link-item">
                  <i className="fas fa-chevron-right"   />
                    <Link href="/" className="text-decoration-none link " style={{color:"white" }}>Home</Link>
                  </li>
                  <hr/>
                  <li className="link-item">
                  <i className="fas fa-chevron-right "   />
                    <Link href="/About" className="text-decoration-none link " style={{color:"white" }}>About</Link>
                  </li>
                  <hr/>
                  <li className="link-item">
                  <i className="fas fa-chevron-right "   />
                    <Link href="/Explore" className="text-decoration-none link " style={{color:"white" }}>Explore</Link>
                  </li>
                  <hr/>
                  <li className="link-item">
                  <i className="fas fa-chevron-right "   />
                    <Link href="/Contact" className="text-decoration-none link " style={{color:"white" }}>Contact</Link>
                  </li>
                  
                 
                
                </ul>
              </div>
            </div>
          </div>

          {/* Third Section*/}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="footer-widget contact-info-widget mb-40 wow fadeInUp">
              <h4 className="widget-title  " style={{color:"var(--accent-color)"}}>Get In Touch</h4>
              <div className="widget-content">
                <ul className="info-list">
                  <li className="link-item pt-3">
                    <i className="fas fa-map-marker-alt" style={{color:"var(--accent-color)"}}></i>
                    Pepsi, Hargeisa Somaliland
                  </li>
                  <li className="link-item pt-3">
                    <i className="fas fa-phone-alt" style={{color:"var(--accent-color)"}}></i>
                    <a href="tel:+123456789" style={{color:"white", textDecoration:"none"}}>+123 (456) 789</a>
                  </li>
                  <li className="link-item pt-3">
                    <i className="fas fa-envelope " style={{color:"var(--accent-color)"}}></i>
                    <a href="mailto:info@company.com" style={{color:"white", textDecoration:"none"}}>info@company.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright-area">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="copyright-text">
                <hr/>
              
                <p>&copy; 2025 Shaqadoon. All Rights Reserved.</p>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

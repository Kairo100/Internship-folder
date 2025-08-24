import React, { Fragment, useState } from 'react';
import terms from '../../api/Terms';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Logo from '../../images/logo2.png';

const TermsOfUse = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Fragment>
      <Navbar Logo={Logo} hclass="wpo-site-header-s3" />
      <PageTitle pageTitle={'Terms Of Use'} pagesub={'Terms Of Use'} />
      <div className="bg-white py-5 px-3 px-md-4" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div className="container-fluid" style={{ maxWidth: '1200px' }}>
       
          <div className="d-block d-lg-none mb-4">
            <div className="dropdown border">
              <button
                className="btn btn-outline dropdown-toggle w-100 text-start"
                type="button"
                onClick={toggleDropdown}
              >
                Table of Contents
              </button>
              <ul className={`dropdown-menu w-100 ${dropdownOpen ? 'show' : ''}`}>
                {terms.sections.map((section, index) => (
                  <li key={index}>
                    <a
                      className="dropdown-item"
                      href={`#${section.heading.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row">
            
            <div className="col-lg-8 mb-5">
              <h1 className="display-3 fw-light mb-3" style={{ fontSize: '3.5rem' }}>
                {terms.title}
              </h1>
              <h2 className="h4 fw-semibold mb-3">{terms.subtitle || 'Our Terms Of Use Notie '}</h2>
              <p className="fw-bold mb-4">Last Updated: {terms.updatedDate}</p>

              {terms.sections.map((section, index) => (
                <div key={index} className="mb-5" id={section.heading.toLowerCase().replace(/\s+/g, '-')}>
                  <h4 className="fw-semibold mb-3">{section.heading}</h4>
                  <p className="text-dark lh-lg"    dangerouslySetInnerHTML={{ __html: section.content }}></p>
                </div>
              ))}
            </div>

          
            <div className="col-lg-4 d-none d-lg-block"  >
              <div className="border rounded p-4 position-sticky " style={{ top: '20px' ,overflowY: 'auto', }} >
                <h5 className="fw-bold mb-3">Table of Contents</h5>
                <ul className="list-unstyled">
                  {terms.sections.map((section, index) => (
                    <li key={index} className="mb-2">
                      <a
                        href={`#${section.heading.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-decoration-underline text-dark"
                        style={{ fontSize: '1rem' }}
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default TermsOfUse;

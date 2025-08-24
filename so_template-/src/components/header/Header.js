// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import MobileMenu from '../MobileMenu/MobileMenu'
// import HeaderProfileForm from '../HeaderProfileForm/HeaderProfileForm';
// import { connect } from "react-redux";
// import { removeFromCart } from "../../store/actions/action";
// import { useProjects } from '../../api/ProjectsContext';

// const Header = (props) => {


// const {causesData } = useProjects();

//     const ClickHandler = () => {
//         window.scrollTo(10, 0);
//     }

//     return (
//         <header id="header">
//             <div className={"wpo-site-header " + props.hclass}>
//                 <nav className="navigation navbar navbar-expand-lg navbar-light">
//                     <div className="container-fluid w-100">
//                         <div className="row align-items-center justify-space-between">
                            
//                             <div className="col-lg-3 col-md-5 col-6">
//                                 <div className="navbar-header">
//                                     <Link onClick={ClickHandler} className="navbar-brand" to="/"><img src={props.Logo}
//                                         alt="logo" style={{width:"242px", height:"60px"}}/></Link>
//                                 </div>
//                             </div>
//                             <div className="col-lg-6 col-md-1 col-1">
//                                 <div id="navbar" className="collapse navbar-collapse navigation-holder">
//                                     <ul className="nav navbar-nav mb-2 mb-lg-0">
//                                         <li className="menu-item-has-children">
//                                             <Link onClick={ClickHandler} to="/">Home</Link>
                                           
//                                         </li>
                                       

//                                   <li className="menu-item-has-children" >
//                                             <Link onClick={ClickHandler} to="/projects">Explore</Link>
//                                             <ul className="sub-menu" style={{ maxHeight: "300px", overflowY: "auto", position: "absolute", background: "#fff", zIndex: 1000, width: "400px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", borderRadius: "5px" }}>
//                                                 {[
//                                                     "Agriculture",
//                                                     "Community Building",
//                                                      "Education",
//                                                     "Food",
//                                                      "Health",
//                                                      "Human Rights",
//                                                          "ICT",
//                                                     "Media & Journalism",
//                                                       "Water",
//                                                    "Health and Environmental Security"
//                                                 ].map((category, index)=> (
//                                                     <li key={index}>
//                                                         <Link onClick={ClickHandler} to={`/projects/category/${encodeURIComponent(category)}`}>
//                                                             {category}
//                                                         </Link>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </li>
                                      
//                                         <li className="menu-item-has-children">
//                                             <Link onClick={ClickHandler} to="">Pages</Link>
//                                             <ul className="sub-menu">
//                                                 <li><Link onClick={ClickHandler} to="/about">About</Link></li>
//                                                 <li><Link onClick={ClickHandler} to="/contact">Contact</Link></li>
//                                                 <li><Link onClick={ClickHandler} to="/how-it-works">How it works</Link></li>
//                                                 <li><Link onClick={ClickHandler} to="/privacy">Privacy Policy</Link></li> 
//                                                 <li><Link onClick={ClickHandler} to="/terms">Terms Of Use</Link></li> 
                                                
                                               
                                             
//                                             </ul>
//                                         </li>
                                    
                                     
                                     
//                                     </ul>
//                                 </div>
//                             </div>
//                             <div className="col-lg-3 col-md-3 col-2">
//                                 <div className="header-right">
                                
//                                     <HeaderProfileForm />
//                                    <MobileMenu />
//                                 </div>
//                             </div>
//                             <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block ">
                                
//                              </div>
//                         </div>
//                     </div>
//                 </nav>
//             </div>
//         </header>
//     )
// }

// const mapStateToProps = (state) => {
//     return {
//         carts: state.cartList.cart,
//     };
// };

// export default connect(mapStateToProps, { removeFromCart })(Header);


import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import HeaderProfileForm from '../HeaderProfileForm/HeaderProfileForm';
import { connect } from "react-redux";
import { removeFromCart } from "../../store/actions/action";
import { useProjects } from '../../api/ProjectsContext';
import GoogleTranslate from "../../api/GoogleTranslate";

const Header = (props) => {


    const { causesData } = useProjects();

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

     // Function to handle language change from our custom dropdown
    const handleLanguageChange = (lang) => {
        // Check if the changeLanguage function is available on the window object
        if (window.changeLanguage) {
            window.changeLanguage(lang);
        } else {
            // Fallback or a message in case the script hasn't loaded yet
            console.error("Google Translate script not yet loaded.");
        }
    };


 

    return (
        <header id="header">
            <div className={"wpo-site-header " + props.hclass}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid w-100">

                        <div className="row align-items-center justify-content-between w-100">

                           
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5"> 
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" to="/"><img src={props.Logo}
                                        alt="logo" style={{ width: "242px", height: "60px" }} /></Link>
                                </div>
                            </div>

                           
                            <div className="col-lg-6 d-none d-lg-block"> 
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/" style={{fontWeight:"550"}}>Home</Link>
                                        </li>
                                        <li className="menu-item-has-children" >
                                            <Link onClick={ClickHandler} to="/projects" style={{fontWeight:"550"}}>Explore</Link>
                                            <ul className="sub-menu" style={{ maxHeight: "300px", overflowY: "auto", position: "absolute", background: "#fff", zIndex: 1000, width: "400px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", borderRadius: "5px" }}>
                                                {[
                                                    "Agriculture", "Community Building", "Education", "Food", "Health",
                                                    "Human Rights", "ICT", "Media & Journalism", "Water", "Health and Environmental Security"
                                                ].map((category, index) => (
                                                    <li key={index}>
                                                        <Link onClick={ClickHandler} to={`/projects/category/${encodeURIComponent(category)}`}>
                                                            {category}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="" style={{fontWeight:"550"}}>Pages</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/about" >About</Link></li>
                                                <li><Link onClick={ClickHandler} to="/contact">Contact</Link></li>
                                                <li><Link onClick={ClickHandler} to="/how-it-works">How it works</Link></li>
                                                <li><Link onClick={ClickHandler} to="/privacy">Privacy Policy</Link></li>
                                                <li><Link onClick={ClickHandler} to="/terms">Terms Of Use</Link></li>
                                            </ul>
                                        </li>


                                    </ul>
                                </div>
                            </div>

                             {/* <div className="col-lg-3 col-md-8 col-sm-8 col-7"> 
                                <div className="header-right d-flex align-items-center justify-content-end"> 
                            
                                    <div className="ms-3 d-none d-lg-block"> 
                                        <GoogleTranslate />
                                        <HeaderProfileForm />
                                    </div>
                                     <div className="ms-3 "> 
                                      <MobileMenu />
                                    </div>
                                </div>
                            </div> */}

                             <div className="col-lg-3 col-md-8 col-sm-8 col-7"> 
                                <div className="header-right d-flex align-items-center justify-content-end"> 
                                    <div className="ms-3 d-none d-lg-block">
  {/* Google Translate hidden element */}
  <GoogleTranslate />



  <ul className="header-right-nav language-dropdown">
  <li className="menu-item-has-children ">
    {/* <Link onClick={ClickHandler} to="#" className="lang-toggle">
    
      <i className="fi fa-solid fa-globe"></i> Lang
    </Link> */}
    <Link
  onClick={ClickHandler}
  to="#"
  className="lang-toggle"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    border:'1px solid black',
    
    fontSize: "14px",
    color: "#333",
    textDecoration: "none",
    transition: "background-color 0.2s ease, color 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#e0e0e0";
    e.currentTarget.style.color = "#000";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#f5f5f5";
    e.currentTarget.style.color = "#333";
  }}
>
  <i
    className="fi fa-solid fa-globe"
    style={{ fontSize: "16px", color: "#555" }}
  ></i>
  Lang
</Link>

    <ul className="sub-menu lang-menu">
      <li>
        <Link onClick={() => handleLanguageChange("en")}>
          {/* <i className="fi fa-solid fa-flag-usa" style={{ marginRight: "8px" }}></i> */}
          English
        </Link>
      </li>
      <li>
        <Link onClick={() => handleLanguageChange("so")}>
          {/* <i className="fi fa-solid fa-flag" style={{ marginRight: "8px", color: "#00a859" }}></i> */}
          Soomaali
        </Link>
      </li>
    </ul>
  </li>
</ul>


</div>

                                    <div className="ms-3 d-none d-lg-block"> 
                                        
                                        <HeaderProfileForm />
                                    </div>
                                    <div className="ms-3 "> 
                                        <MobileMenu />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

const mapStateToProps = (state) => {
    return {
        carts: state.cartList.cart,
    };
};

export default connect(mapStateToProps, { removeFromCart })(Header);
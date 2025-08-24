'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState , useEffect} from "react";
import Header2 from "./Header2";

const active = {
  color: "#00CC99",
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isFixed, setIsFixed]= useState(false);
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  useEffect(()=>{
     const handleScroll =()=>{
      if(window.scrollY>0){
        setIsFixed(true);
      }
      else{
        setIsFixed(false);
      }
     } ;
     window.addEventListener('scroll', handleScroll)

     return ()=>{
      window.removeEventListener('scroll', handleScroll)
     }
  }, []);

    
  

  return (
    <>
    <Header2 />
    <div className={`header bg-color py-3 position-fixed w-100  ${
      isFixed ? 'top-0' :''
    }`}
    style ={{
      zIndex:"1",
    }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="logo">
            <img 
              src="/images/sokaab_logo.png" 
              alt="Logo" 
              className="img-fluid"
              style={{ maxWidth: "150px" }}
            />
          </div>

          {/* Desktop Navbar */}
          <nav className="navbar navbar-expand-lg d-none d-lg-block">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link 
                  href="/" 
                  className="nav-link" 
                  style={pathname === "/" ? active : { color: "white" }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/About" 
                  className="nav-link" 
                  style={pathname === "/About" ? active : { color: "white" }}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/Explore" 
                  className="nav-link" 
                  style={pathname === "/Explore" ? active : { color: "white" }}
                >
                  Explore
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  href="/Contact" 
                  className="nav-link" 
                  style={pathname === "/Contact" ? active : { color: "white" }}
                >
                  Contact
                </Link>
              </li>
              
            </ul>
          </nav>

          {/* Mobile Navbar */}
          <nav className="navbar  d-block d-lg-none">
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={handleMenuToggle} 
              aria-expanded={isMenuOpen ? "true" : "false"} 
              aria-label="Toggle navigation"
            >
              <span className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} ` } style={{ color: "white", zIndex: 1000,   }}></span>
            </button>
            
              <div className={` mobile-menu  collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} >
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link 
                      href="/" 
                      className="nav-link" 
                      style={pathname === "/" ? active : { color: "white" }}
                    >
                      Home
                    </Link>
                  </li>
                  <hr/>
                  <li className="nav-item">
                    <Link 
                      href="/About" 
                      className="nav-link" 
                      style={pathname === "/About" ? active : { color: "white" }}
                    >
                      About
                    </Link>
                  </li>
                  <hr/>
                  <li className="nav-item">
                    <Link 
                      href="/Explore" 
                      className="nav-link" 
                      style={pathname === "/Explore" ? active : { color: "white" }}
                    >
                      Explore
                    </Link>
                  </li>
                  <hr/>
                  <li className="nav-item">
                    <Link 
                      href="/Contact" 
                      className="nav-link" 
                      style={pathname === "/Contact" ? active : { color: "white" }}
                    >
                      Contact
                    </Link>
                  </li>
                  
                  <hr/>
                </ul>
              </div>
            
          </nav>
        </div>
      </div>
    </div>
    </>
  );
}



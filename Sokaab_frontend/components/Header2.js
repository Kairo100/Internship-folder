export default function Header2(){
    return(
    <>
    <div className="container">
        
    <div className="top-header d-lg-flex text-center justify-content-lg-between d-block  ">
      <div className="location p-2">
     
                    {/* <i className="fas fa-phone-alt" style={{color:"var(--accent-color)"}}></i> */}
                    <a href="tel:+123456789" style={{color:"var(--font-color)", textDecoration:"none" , fontWeight:"bold"}}>(+123 (456) 789)</a>
                  
                
                    {/* <i className="fas fa-envelope " style={{color:"var(--accent-color)" , paddingLeft:"20px"}}></i> */}
                    <a href="mailto:info@company.com" style={{color:"var(--font-color)", textDecoration:"none", paddingLeft:"20px", fontWeight:"bold" }}>(info@company.com)</a>
                  
      </div>
      <div className="social-links p-2 justify-content-center ">
                  <a href="https://facebook.com" target="_blank" className="" style={{color:"var(--accent-color)"}} >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" className="" style={{color:"var(--accent-color)"}}>
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" className="" style={{color:"var(--accent-color)"}}>
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://linkedin.com" target="_blank" className="" style={{color:"var(--accent-color)"}}>
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
    </div>
    </div>
    </>
    );
}
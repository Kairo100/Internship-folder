import React , { useState } from "react";


const OrganizationModal = ({ isOpen, onClose, organization ,loading}) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const iconStyle = (iconName) => ({
    textDecoration: "none",
    fontSize: "20px",
    color: hoveredIcon === iconName ? "#fff" : "#00CC99",
    backgroundColor: hoveredIcon === iconName ? "#00CC99" : "transparent",
    border: "1px solid #00CC99",
    borderRadius: "50%",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.3s ease",
    cursor: "pointer"
  });
  
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeStyle} onClick={onClose}>&times;</button>

{loading ?(<>
  <div className="loader-container"><div className="loader"></div></div>
  
          <style>{`
            .loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
 height:400px;
}

.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #00CC99;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

  
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style></>
        ):
        (
<>
<div style={orgHeader}>
          {/* <img src={organization?.org.organisation_logo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt={organization?.org?.organisation_name} style={orgImage} /> */}
         <div> 
          <h2 style={orgName}>{organization?.org?.organisation_name}</h2>
         </div>
        </div>
       <div style={orgAbout}>
       <h4>About</h4>
        <p style={orgAbout}>
          
          {organization?.org.organisation_bio}</p>
       </div>

        <div style={infoSection}>
          <div style={infoRow}>
            <i className="fas fa-envelope mr-2 p-2 font-color"></i>
            <a href={`mailto:${organization?.org?.email_address}`} style={linkStyle}>{organization?.org?.email_address}</a>
          </div>
          <div style={infoRow}>
            <i className="fas fa-phone mr-2 p-2 font-color"></i>
            <a href={`tel:${organization?.org?.phone_number}`} style={linkStyle}>{organization?.org?.phone_number}</a>
          </div>
          <div style={infoRow}>
            <i className="fas fa-globe mr-2 p-2 font-color"></i>
            <a href={organization?.website_address} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {organization?.org?.website_address}
            </a>
          </div>
        </div>

        <div style={socialRow}>
  <a
    href={organization?.org?.facebook_page}
    target="_blank"
    rel="noopener noreferrer"
    style={iconStyle("facebook")}
    onMouseEnter={() => setHoveredIcon("facebook")}
    onMouseLeave={() => setHoveredIcon(null)}
  >
    <i className="fab fa-facebook-f mr-1"></i>
  </a>
  <a
    href={organization?.org?.twitter_page}
    target="_blank"
    rel="noopener noreferrer"
    style={iconStyle("twitter")}
    onMouseEnter={() => setHoveredIcon("twitter")}
    onMouseLeave={() => setHoveredIcon(null)}
  >
    <i className="fab fa-twitter mr-1"></i>
  </a>
  <a
  href={organization?.org?.linkedIn_page}
  target="_blank"
  rel="noopener noreferrer"
  style={iconStyle("linkedin")}
  onMouseEnter={() => setHoveredIcon("linkedin")}
  onMouseLeave={() => setHoveredIcon(null)}
>
  <i className="fab fa-linkedin mr-1"></i>
</a>

<a
  href={organization?.pinterest_page}
  target="_blank"
  rel="noopener noreferrer"
  style={iconStyle("pinterest")}
  onMouseEnter={() => setHoveredIcon("pinterest")}
  onMouseLeave={() => setHoveredIcon(null)}
>
  <i className="fab fa-pinterest mr-1"></i>
</a>

</div></>
        )}
      

      </div>
    </div>
  );
};

// --- Styles ---
const overlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 10000,
   
  };
  
  const modalStyle = {
    backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px",
    width: "92%", maxWidth: "520px", boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
    fontFamily: "Segoe UI, sans-serif", position: "relative", textAlign: "center", overflowY:"auto",height:"600px"
  };
  
  const closeStyle = {
    position: "absolute", top: "16px", right: "20px",
    fontSize: "28px", border: "none", background: "none", cursor: "pointer",
    color: "#777",
  };
  
  const orgHeader = {
    display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "20px",gap:"20px", textAlign:"left"
  };
  
  const orgImage = {
    width: "90px", height: "90px", borderRadius: "14px",
    objectFit: "cover", marginBottom: "14px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  };
  
  const orgName = {
    fontSize: "22px", fontWeight: 600, margin: 0, color: "#222",
  };
  
  const orgTitle = {
    fontSize: "14px", color: "#666", marginTop: "6px",
  };
  
  const orgAbout = {
    fontSize: "15px", color: "#444", margin: "18px 0 24px",
    lineHeight: "1.6",textAlign:"left",
  };
  
  const infoSection = {
    textAlign: "left", marginBottom: "24px", padding: "0 12px",
  };
  
  const infoRow = {
    display: "flex", alignItems: "center", marginBottom: "12px",
    fontSize: "14px", color: "#2C3E50",
  };
  
  const linkStyle = {
    textDecoration: "none", color: "#2C3E50", marginLeft: "8px",
    overflowWrap: "anywhere",
  };
  
  const socialRow = {
    display: "flex", justifyContent: "left", padding: "0 10px", marginTop: "20px",gap:"10px"
  };
  

  

export default OrganizationModal;

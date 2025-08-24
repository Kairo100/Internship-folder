// import React, { useState } from 'react';

// const ShareModal = ({ isOpen, onClose, shareUrl }) => {
//   const [copied, setCopied] = useState(false);

//   if (!isOpen) return null;

//   const copyLink = () => {
//     navigator.clipboard.writeText(shareUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const encodedUrl = encodeURIComponent(shareUrl);

//   const shareOptions = [
//     {
//       name: 'Facebook',
//       icon: 'fab fa-facebook-f',
//       color: '#1877F2',
//       url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
//     },
//     {
//       name: 'WhatsApp',
//       icon: 'fab fa-whatsapp',
//       color: '#25D366',
//       url: `https://api.whatsapp.com/send?text=${encodedUrl}`,
//     },
//     {
//       name: 'Messenger',
//       icon: 'fab fa-facebook-messenger',
//       color: '#0084FF',
//       url: `https://www.facebook.com/dialog/send?link=${encodedUrl}`,
//     },
//     {
//       name: 'Email',
//       icon: 'fas fa-envelope',
//       color: '#7d7d7d',
//       url: `mailto:?subject=Support%20this%20cause&body=${encodedUrl}`,
//     },
//     {
//       name: 'LinkedIn',
//       icon: 'fab fa-linkedin-in',
//       color: '#0A66C2',
//       url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
//     },
//     {
//       name: 'Twitter',
//       icon: 'fab fa-twitter',
//       color: '#1DA1F2',
//       url: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
//     },
//     {
//       name: 'Telegram',
//       icon: 'fab fa-telegram-plane',
//       color: '#0088cc',
//       url: `https://t.me/share/url?url=${encodedUrl}`,
//     },
//     {
//       name: 'Reddit',
//       icon: 'fab fa-reddit-alien',
//       color: '#FF5700',
//       url: `https://www.reddit.com/submit?url=${encodedUrl}`,
//     },
//     {
//       name: 'Instagram',
//       icon: 'fab fa-instagram',
//       color: '#E1306C',
//       url: `https://www.instagram.com/`, 
//     },
//     {
//       name: 'TikTok',
//       icon: 'fab fa-tiktok',
//       color: '#000000',
//       url: `https://www.tiktok.com/`, 
//     },
//     {
//       name: 'Pinterest',
//       icon: 'fab fa-pinterest-p',
//       color: '#E60023',
//       url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}`,
//     },
//     {
//       name: 'Snapchat',
//       icon: 'fab fa-snapchat-ghost',
//       color: '#FFFC00',
//       url: `https://www.snapchat.com/`,
//     },
//   ];
  
//   return (
//     <div style={overlayStyle}>
//       <div style={modalStyle}>
//         <button style={closeStyle} onClick={onClose}>&times;</button>

//         <h2 style={headerStyle}>Quick share</h2>

//         <div style={linkSection}>
//           <input type="text" readOnly value={shareUrl} style={linkInput} />
//           <button onClick={copyLink} style={copyButton}>
//             <i className={copied ? "fas fa-check" : "fas fa-copy"} style={copyIconStyle}></i>
//             <span style={copyTextStyle}>{copied ? "Copied" : "Copy"}</span>
//           </button>
//         </div>

//         <div style={sectionTitle}>Reach more donors by sharing</div>

//         <div style={gridContainer}>
//           {shareOptions.map((item, index) => (
//             <a
//               key={index}
//               href={item.url}
//               target="_blank"
//               rel="noreferrer"
//               style={{ ...shareButton, backgroundColor: "#f6f6f6" }}
//             >
//               <i className={`${item.icon}`} style={{ ...iconStyle, color: item.color }}></i>
//               <span style={labelStyle}>{item.name}</span>
//             </a>
//           ))}
//         </div>

        
//       </div>
//     </div>
//   );
// };

// // Styles
// const overlayStyle = {
//   position: "fixed",
//   top: 0, left: 0,
//   width: "100vw", height: "100vh",
//   backgroundColor: "rgba(0, 0, 0, 0.4)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   borderRadius: "20px",
//   padding: "28px",
//   width: "90%",
//   maxWidth: "480px",
//   maxHeight: "80vh",
//   overflowY: "auto",
//   fontFamily: "'Segoe UI', sans-serif",
//   boxShadow: "0 12px 50px rgba(0, 0, 0, 0.2)",
//   position: "relative",
// };

// const closeStyle = {
//   position: "absolute",
//   top: "14px",
//   right: "18px",
//   background: "none",
//   border: "none",
//   fontSize: "24px",
//   cursor: "pointer",
//   color: "#555",
// };

// const headerStyle = {
//   fontSize: "22px",
//   fontWeight: "600",
//   marginBottom: "20px",
// };

// const linkSection = {
//   display: "flex",
//   alignItems: "center",
//   border: "1px solid #ccc",
//   borderRadius: "10px",
//   overflow: "hidden",
//   marginBottom: "24px",
// };

// const linkInput = {
//   flex: 1,
//   padding: "10px 12px",
//   fontSize: "14px",
//   border: "none",
//   outline: "none",
// };

// const copyButton = {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     padding: "10px 16px",
//     fontSize: "14px",
//     fontWeight: "600",
//     backgroundColor: "#f8f8f8",
//     border: "none",
//     borderLeft: "1px solid #ccc",
//     cursor: "pointer",
//     transition: "background-color 0.2s ease, color 0.2s ease",
//     color: "#444",
//     height: "100%",
// };

// const sectionTitle = {
//   fontSize: "16px",
//   fontWeight: "600",
//   marginBottom: "6px",
// };

// const description = {
//   fontSize: "13.5px",
//   color: "#555",
//   marginBottom: "16px",
// };

// const gridContainer = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr",
//   gap: "12px",
// };

// const shareButton = {
//   display: "flex",
//   alignItems: "center",
//   padding: "10px 12px",
//   borderRadius: "12px",
//   textDecoration: "none",
//   color: "#222",
//   fontWeight: 500,
//   transition: "background 0.2s ease",
// };

// const iconStyle = {
//   fontSize: "18px",
//   marginRight: "12px",
//   width: "24px",
//   textAlign: "center",
// };

// const labelStyle = {
//   fontSize: "15px",
// };

//   const copyIconStyle = {
//     fontSize: "15px",
//     color: "#777",
//   };
  
//   const copyTextStyle = {
//     fontSize: "14px",
//     color: "#333",
//   };
  

// export default ShareModal;



import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure you import Link if you're using it

const ShareModal = ({ isOpen, onClose, shareUrl, projectImage, projectTitle, projectDescription, donateUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Title:${projectTitle }`|| '');
  const encodedDescription = encodeURIComponent( `Description:${projectDescription}` || '');
  const encodedImage = encodeURIComponent(projectImage || ''); // For Pinterest and potentially other platforms

  const shareOptions = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      color: '#1877F2',
      // Added quote for better Facebook sharing of title/description
       url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle} - ${encodedDescription}`,
       },
    {
      name: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: '#25D366',
      // Added text for WhatsApp with title, description, and URL
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`,
    },
    
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      color: '#7d7d7d',
      // Subject and body include project details
      url: `mailto:?subject=Support%20${encodedTitle}&body=${encodedDescription}%0A%0ARead%20more%20and%20donate%20here:%20${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin-in',
      color: '#0A66C2',
      // Added title and summary for LinkedIn
       url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
          },
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      color: '#1DA1F2',
      // Added text for Twitter with title and description
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}%20${encodedDescription}`,
    },
    {
      name: 'Telegram',
      icon: 'fab fa-telegram-plane',
      color: '#0088cc',
      // Added text for Telegram
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}%0A${encodedDescription}`,
    },
   
   
   
   
  ];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeStyle} onClick={onClose}>&times;</button>

        <h2 style={headerStyle}>Quick share</h2>

        {/* Project Image, Title, Description Preview */}
        {projectImage && (
          <div style={projectImageContainerStyle}>
            <img src={projectImage} alt={projectTitle} style={projectImageStyle} />
          </div>
        )}

        {projectTitle && <h3 style={projectTitleStyle}>{projectTitle}</h3>}
        {projectDescription && <p style={projectDescriptionStyle}>{projectDescription}</p>}
        {/* End Preview */}

        <div style={linkSection}>
          <input type="text" readOnly value={shareUrl} style={linkInput} />
          <button onClick={copyLink} style={copyButton}>
            <i className={copied ? "fas fa-check" : "fas fa-copy"} style={copyIconStyle}></i>
            <span style={copyTextStyle}>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        <div style={sectionTitle}>Reach more donors by sharing</div>

        <div style={gridContainer}>
          {shareOptions.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener" // Added noopener for security
              style={{ ...shareButton, backgroundColor: "#f6f6f6" }}
            >
              <i className={`${item.icon}`} style={{ ...iconStyle, color: item.color }}></i>
              <span style={labelStyle}>{item.name}</span>
            </a>
          ))}
        </div>

      
      

      </div>
    </div>
  );
};

// --- Existing Styles (from your original code) ---
// Note: I've added only the *new* styles for the project preview and donate button.
// All your existing styles for overlay, modal, close button, link section, grid, etc., remain unchanged.

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw", height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  padding: "28px",
  width: "90%",
  maxWidth: "480px",
  maxHeight: "80vh",
  overflowY: "auto",
  fontFamily: "'Segoe UI', sans-serif",
  boxShadow: "0 12px 50px rgba(0, 0, 0, 0.2)",
  position: "relative",
};

const closeStyle = {
  position: "absolute",
  top: "14px",
  right: "18px",
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#555",
};

const headerStyle = {
  fontSize: "22px",
  fontWeight: "600",
  marginBottom: "20px",
  // Added for centering, if desired for the header
  textAlign: "center",
};

const linkSection = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: "10px",
  overflow: "hidden",
  marginBottom: "24px",
};

const linkInput = {
  flex: 1,
  padding: "10px 12px",
  fontSize: "14px",
  border: "none",
  outline: "none",
};

const copyButton = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#f8f8f8",
    border: "none",
    borderLeft: "1px solid #ccc",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",
    color: "#444",
    height: "100%",
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "6px",
  // Added for centering, if desired
  textAlign: "center",
};

// Your original `description` style, which isn't directly used for the project description in the modal but is kept for reference
const description = {
  fontSize: "13.5px",
  color: "#555",
  marginBottom: "16px",
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  // Added for spacing below the grid
  marginBottom: "20px",
};

const shareButton = {
  display: "flex",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#222",
  fontWeight: 500,
  transition: "background 0.2s ease",
  // Align items within the button to center (GoFundMe style)
  justifyContent: "center",
  flexDirection: "column", // Stack icon and text vertically
  gap: "5px", // Space between icon and text
};

const iconStyle = {
  fontSize: "18px",
  marginRight: "12px", // This will now apply to the icon when stacked vertically
  width: "24px",
  textAlign: "center",
  // For stacked layout, might adjust marginRight to 0 and rely on gap
  // For your current style, it works with `marginRight` if icons are still meant to be on the left.
  // If you want pure vertical stack, `marginRight: 0` and let `gap` handle spacing.
};

const labelStyle = {
  fontSize: "15px",
};

const copyIconStyle = {
  fontSize: "15px",
  color: "#777",
};

const copyTextStyle = {
  fontSize: "14px",
  color: "#333",
};

// --- NEW STYLES for Project Preview and Donate Button ---

const projectImageContainerStyle = {
  marginBottom: "15px",
  height:"200px",
 
  display: "flex",
  justifyContent: "center", // Center the image horizontally
};

const projectImageStyle = {
  width: "100%",
 // maxWidth: "200px", // Keep image from being too large
  height: "auto",
  borderRadius: "10px",
  objectFit: "cover", // Ensures image covers the area without distortion
};

const projectTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: "10px",
  color: "#333",
};

const projectDescriptionStyle = {
  fontSize: "14px",
  color: "#666",
  textAlign: "center",
  marginBottom: "20px",
  lineHeight: "1.5",
};

const donateButtonContainerStyle = {
  marginTop: "20px",
  textAlign: "center", // Center the donate button
};

const donateButtonStyle = {
  display: "inline-block", // Allows setting width/padding and centers with textAlign on parent
  backgroundColor: "#00b14f", // GoFundMe's green color
  color: "#fff",
  padding: "12px 25px",
  borderRadius: "50px", // Pill shape
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
  boxShadow: "0 4px 10px rgba(0, 177, 79, 0.3)", // Subtle shadow
  border: "none",
  cursor: "pointer",
};

export default ShareModal;
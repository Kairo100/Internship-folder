import React, { useState, useEffect } from "react";

const CommunityModal = ({ isOpen, onClose, communityData }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [toast, setToast] = useState(null); 

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000); 
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!isOpen) return null;

  const handleSend = () => {
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      setToast({ type: "error", text: "⚠️ Please fill in all fields." });
      return;
    }

    console.log(`Message to ${selectedMember.name}:`, formData);
    setToast({ type: "success", text: `✅ Message sent to ${selectedMember.name}!` });
    setFormData({ name: "", email: "", phone: "", message: "" });
    setSelectedMember(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeStyle} onClick={onClose}>&times;</button>
        <h2 style={headerStyle}>{communityData.name} Community</h2>

        <div style={gridStyle}>
  {(!communityData || communityData.length === 0) ? (
    <div style={{ textAlign: "center", color: "#777", fontSize: "16px", padding: "20px" }}>
      🛈 No community available right now.
    </div>
  ) : (
    communityData.map((member, index) => (
      <div
        key={index}
        style={memberCard}
        onClick={() => setSelectedMember(member)}
      >
    <img
  src={member.image ? member.image : `https://cdn-icons-png.flaticon.com/512/149/149071.png`}
  alt={member.committee_name || "Community Member"}
  style={avatarStyle}
/>


        <div>
          <div style={nameStyle}>{member.committee_name}</div>
          <div style={nameStyle}>{member.committee_mobile_number}</div>
          <div style={nameStyle}>{member.position_held}</div>
          <div style={roleStyle}>{member.role}</div>
        </div>
      </div>
    ))
  )}
</div>

        {selectedMember && (
          <div style={popupOverlay}>
            <div style={popupBox}>
              <h3 style={popupTitle}>
                Send Message to <span style={{ color: "#4CAF50" }}>{selectedMember.committee_name}</span>
              </h3>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
              />
              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                style={textareaStyle}
              />

              <div style={popupBtns}>
                <button style={sendBtn} onClick={handleSend}>🚀 Send Message</button>
                <button style={cancelBtn} onClick={() => setSelectedMember(null)}>Cancel</button>
              </div>

              {toast && (
                <div style={{
                  ...toastStyle,
                  backgroundColor: toast.type === "success" ? "#d4edda" : "#f8d7da",
                  color: toast.type === "success" ? "#155724" : "#721c24",
                  border: toast.type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
                }}>
                  {toast.text}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const overlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)", display: "flex",
  justifyContent: "center", alignItems: "center", zIndex: 9999,
};

const modalStyle = {
  backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
  width: "90%", maxWidth: "620px", boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
  fontFamily: "Segoe UI, sans-serif", position: "relative",
};

const closeStyle = {
  position: "absolute", top: "12px", right: "16px",
  fontSize: "24px", border: "none", background: "none", cursor: "pointer",
};

const headerStyle = {
  fontSize: "22px", fontWeight: 600, marginBottom: "20px", textAlign: "center",
};

const gridStyle = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "16px",
};

const memberCard = {
  backgroundColor: "#f8f8f8", borderRadius: "12px", padding: "14px",
  display: "flex", flexDirection: "column", alignItems: "center",
  cursor: "pointer", transition: "0.3s",
};

const avatarStyle = {
  width: "70px", height: "70px", borderRadius: "50%", marginBottom: "10px", objectFit: "cover",
};

const nameStyle = {
  fontWeight: 600, fontSize: "15px",
};

const roleStyle = {
  fontSize: "13px", color: "#777",
};

const popupOverlay = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
  justifyContent: "center", alignItems: "center", zIndex: 99999,
};

const popupBox = {
  backgroundColor: "#fff", borderRadius: "12px", padding: "24px",
  width: "90%", maxWidth: "420px", boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  position: "relative",
};

const popupTitle = {
  fontSize: "18px", fontWeight: 600, marginBottom: "16px", textAlign: "center",
};

const inputStyle = {
  width: "100%", padding: "10px", marginBottom: "10px",
  borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px",
};

const textareaStyle = {
  width: "100%", height: "100px", padding: "10px", fontSize: "14px",
  borderRadius: "8px", border: "1px solid #ccc", marginBottom: "12px", resize: "none",
};

const popupBtns = {
  display: "flex", justifyContent: "space-between",
};

const sendBtn = {
  backgroundColor: "#4CAF50", color: "#fff", padding: "10px 18px",
  border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
};

const cancelBtn = {
  backgroundColor: "#ccc", padding: "10px 18px",
  border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
};

const toastStyle = {
  marginTop: "20px", padding: "10px 16px", borderRadius: "8px",
  fontSize: "14px", textAlign: "center", transition: "all 0.3s ease",
};

export default CommunityModal;


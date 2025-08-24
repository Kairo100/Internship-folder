import React from "react";

const DonationStatusModal = ({ show, status, onHide, project }) => {
  if (!show) return null;

  const isSuccess = status?.type === "success";
  const errorMessage = status?.message;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onHide();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          width: "90%",
          maxWidth: "450px",
          padding: "40px 30px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          transform: "scale(1)",
          animation: "modalSlideIn 0.3s ease-out",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onHide}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#999",
            padding: "5px",
          }}
        >
          ×
        </button>

        {/* Status Icon */}
        <div
          style={{
            fontSize: "64px",
            color: isSuccess ? "#00CC99" : "#e74c3c",
            marginBottom: "20px",
          }}
        >
          {isSuccess ? (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#00CC99",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "40px",
              }}
            >
              ✓
            </div>
          ) : (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#e74c3c",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "40px",
              }}
            >
              ✕
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            color: "#333",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          {isSuccess ? "Donation Successful!" : "Donation Failed"}
        </h3>

        {/* Message */}
        <p
          style={{
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        >
          {isSuccess ? (
            <>
              Thank you for supporting <strong>{project?.title}</strong>. Your
              generous donation has been processed successfully and will help
              make a real difference.
            </>
          ) : (
            errorMessage ||
            "There was an issue processing your donation. Please check your payment details and try again, or contact support if the problem persists."
          )}
        </p>

        {/* Action Buttons */}
        <div style={{ marginTop: "30px" }}>
          {isSuccess ? (
            <>
              <button
                onClick={onHide}
                style={{
                  padding: "12px 30px",
                  border: "none",
                  backgroundColor: "#00CC99",
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              >
                Continue Browsing
              </button>
              <button
                onClick={() => {
                  // Share functionality could be added here
                  if (navigator.share) {
                    navigator.share({
                      title: `I just donated to ${project?.title}`,
                      text: `Check out this amazing project and consider donating too!`,
                      url: window.location.href,
                    });
                  }
                }}
                style={{
                  padding: "12px 20px",
                  border: "2px solid #00CC99",
                  backgroundColor: "transparent",
                  color: "#00CC99",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Share
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onHide}
                style={{
                  padding: "12px 30px",
                  border: "none",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  onHide();
                  // Could trigger retry logic here
                }}
                style={{
                  padding: "12px 20px",
                  border: "2px solid #e74c3c",
                  backgroundColor: "transparent",
                  color: "#e74c3c",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DonationStatusModal;

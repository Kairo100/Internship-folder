import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaTest = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  console.log("Site Key:", siteKey);
  console.log("Site Key Type:", typeof siteKey);
  console.log("Site Key Length:", siteKey ? siteKey.length : "undefined");

  const handleRecaptchaChange = (token) => {
    console.log("reCAPTCHA Token:", token);
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    console.log("reCAPTCHA expired");
    setRecaptchaToken(null);
  };

  const handleRecaptchaError = (error) => {
    console.log("reCAPTCHA error:", error);
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>reCAPTCHA Test Component</h3>
      <p>
        <strong>Site Key:</strong> {siteKey || "UNDEFINED"}
      </p>
      <p>
        <strong>Token Status:</strong>{" "}
        {recaptchaToken ? "Verified" : "Not Verified"}
      </p>

      <div style={{ marginTop: "20px" }}>
        <ReCAPTCHA
          sitekey={siteKey || "test-key"}
          onChange={handleRecaptchaChange}
          onExpired={handleRecaptchaExpired}
          onError={handleRecaptchaError}
        />
      </div>

      {recaptchaToken && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#d4edda",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Success!</strong> reCAPTCHA is working correctly.
          </p>
          <p>
            <strong>Token:</strong> {recaptchaToken.substring(0, 50)}...
          </p>
        </div>
      )}
    </div>
  );
};

export default RecaptchaTest;

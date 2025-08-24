import React, { useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";

const ContactForm = () => {
  const [validator] = useState(
    new SimpleReactValidator({ className: "errorMessage" })
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [subject, setSubject] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const changeHandler = (e) => {
    if (validator.allValid()) {
      validator.hideMessages();
    } else {
      validator.showMessages();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      const data = {
        name,
        email_address: email,
        contact_reason: reason,
        subject,
        message,
      };

      try {
        await axios.post("https://api.caprover.sokaab.com/api/contacts", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setSuccessMessage("Your message has been sent successfully!");
        validator.hideMessages();

        // Clear form
        setName("");
        setEmail("");
        setMessage("");
        setReason("");
        setSubject("");
      } catch (error) {
        console.error(
          "Error sending contact form:",
          error.response?.data || error.message
        );
        setSuccessMessage("Failed to send message. Please try again later.");
      }
    } else {
      validator.showMessages();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="contact-validation-active">
        <div className="row">
          <div className="col col-lg-6 col-12">
            <div className="form-field">
              <input
                value={name}
                type="text"
                name="name"
                onBlur={changeHandler}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
              {validator.message("name", name, "required|alpha_space")}
            </div>
          </div>
          <div className="col col-lg-6 col-12">
            <div className="form-field">
              <input
                value={email}
                type="email"
                name="email"
                onBlur={changeHandler}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
              />
              {validator.message("email", email, "required|email")}
            </div>
          </div>
          <div className="col col-lg-6 col-12">
            <div className="form-field">
              <input
                value={subject}
                type="text"
                name="subject"
                onBlur={changeHandler}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Your Subject Of Contact"
              />
              {validator.message("subject", subject, "required")}
            </div>
          </div>
          <div className="col col-lg-6 col-12">
            <div className="form-field">
              <input
                value={reason}
                type="text"
                name="reason"
                onBlur={changeHandler}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason Of Contact"
              />
              {validator.message("reason", reason, "required")}
            </div>
          </div>
          <div className="col col-lg-12 col-12">
            <textarea
              value={message}
              name="message"
              onBlur={changeHandler}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
            />
            {validator.message("message", message, "required")}
          </div>
        </div>
        <div className="submit-area">
          <button type="submit" className="theme-btn">
            Submit Now
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}
          >
            {successMessage}
          </div>
        )}
      </form>
    </>
  );
};

export default ContactForm;

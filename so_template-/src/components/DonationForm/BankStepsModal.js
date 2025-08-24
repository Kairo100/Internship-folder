import React, { useState } from "react";
import "./BankStepsModal.css";

const BankStepsModal = ({ show, onHide, selectedBank, amount }) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!show) return null;

  const imageMap = {
    "Dahabshiil Bank": "dh.png",
    "Dara Salaam Bank": "ds.png",
    "Salaam Bank": "sb.png",
    "Salaam Somali Bank": "ssb.png",
  };

  const getBankImage = () => {
    return imageMap[selectedBank?.display] || "dh.png";
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep1 = () => (
    <>
      <h5 className="step-header">Step 1:</h5>
      <h4 className="step-content">
        <span className="required-star">* </span>
        Dial this number by specifying Account:{" "}
        <span className="highlight">
          {selectedBank?.display === "Dahabshiil Bank"
            ? selectedBank?.maskedAccount
            : selectedBank?.accNo}
        </span>{" "}
        and amount: <span className="highlight">${amount}</span> Dollar
      </h4>
      <div className="step-image-container">
        <img
          src={require(`../../images/${getBankImage()}`)}
          alt="Bank"
          className="step-image"
        />
      </div>
      <div className="step-buttons">
        <button className="step-btn next-btn" onClick={nextStep}>
          Next
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h5 className="step-header">Step 2:</h5>
      <h4 className="step-content">
        <span className="required-star">* </span>
        Enter a description
      </h4>
      <div className="step-image-container">
        <img
          src={require("../../images/step2.png")}
          alt="Step 2"
          className="step-image"
        />
      </div>
      <div className="step-buttons">
        <button className="step-btn back-btn" onClick={prevStep}>
          Back
        </button>
        <button className="step-btn next-btn" onClick={nextStep}>
          Next
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h5 className="step-header">Step 3:</h5>
      <h4 className="step-content">
        <span className="required-star">* </span>
        Make sure you are sending to the correct account and enter your{" "}
        <span className="bold">PIN</span>
      </h4>
      <div className="step-image-container">
        <img
          src={require("../../images/step3.png")}
          alt="Step 3"
          className="step-image"
        />
      </div>
      <div className="step-buttons">
        <button className="step-btn back-btn" onClick={prevStep}>
          Back
        </button>
        <button className="step-btn done-btn" onClick={onHide}>
          Done
        </button>
      </div>
    </>
  );

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div className="bank-steps-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>How to Donate with {selectedBank?.display}</h3>
          <button className="close-btn" onClick={onHide}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default BankStepsModal;

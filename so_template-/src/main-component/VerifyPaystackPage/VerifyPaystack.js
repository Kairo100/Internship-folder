import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useApi from "../../hooks/useApi";
import { verifyPaystackPayment } from "../../api/payment";

const VerifyPaystack = () => {
  // ** States

  // ** Hooks
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const hasCalledApi = useRef(false);

  const {
    isLoading: verifyPaystackPaymentLoadingApi,
    error: verifyPaystackPaymentErrorApi,
    data: verifyPaystackPaymentApiData,
    apiCall: verifyPaystackPaymentApi,
    clearStates: verifyPaystackPaymentClearStates,
  } = useApi();

  useEffect(() => {
    const callApi = async () => {
      if (reference && !hasCalledApi.current) {
        hasCalledApi.current = true;
        await verifyPaystackPaymentApi(verifyPaystackPayment(reference));
      }
    };
    callApi();
  }, [reference, verifyPaystackPaymentApi]);

  // Api Success handling
  useEffect(() => {
    if (verifyPaystackPaymentApiData) {
    }
    const timer = setTimeout(() => {
      if (verifyPaystackPaymentApiData) {
        navigate(`/projects/${verifyPaystackPaymentApiData.project_id}`);
        // verifyPaystackPaymentClearStates();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [verifyPaystackPaymentApiData, navigate]);

  // Api Error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (verifyPaystackPaymentErrorApi) {
        console.log(
          "verifyPaystackPaymentErrorApi",
          verifyPaystackPaymentErrorApi.response.data.message
        );
        // set time out for ou 2 sesconds
        // setTimeout(() => {
        //   navigate(`/projects/${verifyPaystackPaymentErrorApi.project_id}`);
        //   verifyPaystackPaymentClearStates();
        // }, 2000);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [verifyPaystackPaymentErrorApi]);

  return (
    <div className="verification-container">
      {/* Status Card */}
      <div className="verification-card">
        {/* Icon Section */}
        <div className="icon-section">
          <div className="icon-wrapper">
            {/* <i className="icofont-pay"></i> */}
            <i
              className="fas fa-hand-holding-heart"
              style={{
                fontSize: "3.5rem",
                color: "#00CC99",
                // marginRight: "15px",
                // marginBottom: "20px",
              }}
            ></i>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <h1>Verifying Payment</h1>
          <p>Please wait while we validate your contribution with Paystack</p>

          {/* Status Messages */}
          {verifyPaystackPaymentErrorApi && (
            <div
              className={`status-message error ${
                verifyPaystackPaymentErrorApi === "Network Error"
                  ? "network"
                  : ""
              }`}
            >
              <i className="icofont-close-circled"></i>
              <span>
                {verifyPaystackPaymentErrorApi === "Network Error"
                  ? "Network Error: Please check your connection"
                  : verifyPaystackPaymentErrorApi.response.data.message}
              </span>
            </div>
          )}

          {verifyPaystackPaymentApiData && (
            <div className="status-message success">
              <i className="icofont-check-circled"></i>
              <span>{verifyPaystackPaymentApiData.message}</span>
            </div>
          )}

          {/* Loading Animation */}
          {verifyPaystackPaymentLoadingApi && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <div className="loading-text">Processing your payment...</div>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .verification-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
        }

        .verification-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 100%;
          max-width: 600px;
          text-align: center;
          position: relative;
          animation: fadeIn 0.5s ease-out;
        }

        .icon-section {
          background: linear-gradient(135deg, #00B488 0%, #00B488 100%);
          padding: 3rem 0;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .icon-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
        }

        .icon-wrapper {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .icon-wrapper:hover {
          transform: scale(1.05);
        }

        .icon-wrapper i {
          font-size: 60px;
          color: #00B488;
          animation: pulse 2s infinite;
        }

        .content-section {
          padding: 2rem;
        }

        .content-section h1 {
          color: #2d3748;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .content-section p {
          color: #718096;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .status-message {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-radius: 12px;
          margin: 1rem 0;
          font-weight: 500;
          gap: 0.5rem;
          animation: slideIn 0.3s ease-out;
        }

        .status-message i {
          font-size: 1.5rem;
        }

        .status-message.success {
          background-color: #c6f6d5;
          color: #2f855a;
        }

        .status-message.error {
          background-color: #fed7d7;
          color: #c53030;
        }

        .status-message.error.network {
          background-color: #feebc8;
          color: #c05621;
        }

        .loading-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #FDC513;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #718096;
          font-size: 1rem;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 640px) {
          .verification-container {
            padding: 1rem;
          }

          .verification-card {
            border-radius: 15px;
          }

          .icon-wrapper {
            width: 100px;
            height: 100px;
          }

          .icon-wrapper i {
            font-size: 50px;
          }

          .content-section h1 {
            font-size: 2rem;
          }

          .content-section p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyPaystack;

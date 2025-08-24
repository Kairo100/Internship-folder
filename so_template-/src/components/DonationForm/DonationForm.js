import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import { paymentMobileMoney, paymentPaystack } from "../../api/payment";
import { banks, paymentMethods } from "../../constants/banks";
import defaultImg from "../../images/default donate.jpg";
import BankStepsModal from "./BankStepsModal";
import "./DonationForm.css";

const DonationForm = ({ project, onDonationComplete }) => {
  // API hooks
  const {
    isLoading: mobileMoneyLoading,
    error: mobileMoneyError,
    data: mobileMoneyData,
    apiCall: callMobileMoneyApi,
    clearStates: clearMobileMoneyStates,
  } = useApi();

  const {
    isLoading: paystackLoading,
    error: paystackError,
    data: paystackData,
    apiCall: callPaystackApi,
    clearStates: clearPaystackStates,
  } = useApi();

  // State
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [redirectCount, setRedirectCount] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showBankStepsModal, setShowBankStepsModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "252",
    firstName: "",
    lastName: "",
    email: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Quick amount buttons
  const quickAmounts = [5, 10, 50, 100, 500, 1000];

  // Helper function to extract error messages
  const getErrorMessage = (error) => {
    if (!error) return null;

    // API returns format: {"statusCode":400,"message":"This is not a valid zaad mobile number"}
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.response?.data && typeof error.response.data === "string") {
      try {
        const parsed = JSON.parse(error.response.data);
        if (parsed.message) {
          return parsed.message;
        }
      } catch (e) {
        // Not JSON, just return the string
        return error.response.data;
      }
    }

    if (error?.message) {
      return error.message;
    }

    return "An error occurred. Please try again.";
  };

  // Initialize supported banks
  useEffect(() => {
    if (project?.Project_accounts) {
      const currentAccounts = project.Project_accounts;
      const updatedBanks = banks.map((bank) => {
        // More flexible matching function
        const matchingAccount = currentAccounts.find((target) => {
          const bankIdLower = target.bankId.toLowerCase().trim();
          const bankNameLower = bank.name.toLowerCase().trim();
          const bankDisplayLower = bank.display.toLowerCase().trim();

          return (
            bankIdLower === bankNameLower || bankIdLower === bankDisplayLower
          );
        });

        return {
          ...bank,
          disable: !matchingAccount,
          accNo: matchingAccount ? matchingAccount.AccNo : null,
        };
      });
      setSupportedBanks(updatedBanks);
    } else {
      // If no Project_accounts, enable all banks for testing
      setSupportedBanks(
        banks.map((bank) => ({
          ...bank,
          disable: false,
          accNo: `test-${bank.name}`,
        }))
      );
    }
  }, [project]);

  // Debug logging
  useEffect(() => {
    if (project?.Project_accounts) {
      console.log("Project accounts:", project.Project_accounts);
      console.log("All banks:", banks);
      console.log("Supported banks:", supportedBanks);

      // Debug matching
      project.Project_accounts.forEach((acc) => {
        const matchingBank = banks.find(
          (bank) => bank.name.toLowerCase() === acc.bankId.toLowerCase()
        );
        console.log(
          `Account ${acc.bankId} -> Bank: ${
            matchingBank ? matchingBank.display : "NOT FOUND"
          }`
        );
      });
    }
  }, [project, supportedBanks]);

  // Validation functions
  const validateAmount = (value) => {
    if (!value || value <= 0)
      return "Amount is required and must be greater than 0";
    if (value > 10000) return "Amount must be less than $10,000";
    return null;
  };

  const validateName = (value) => {
    if (!value || value.length < 2) return "Name must be at least 2 characters";
    if (value.length > 50) return "Name must be less than 50 characters";
    return null;
  };

  const validatePhone = (value) => {
    if (!value) return "Phone number is required";
    if (value.length !== 12) return "Phone must be exactly 12 digits";

    // General Somalia number format for all mobile money services
    if (!/^252\d{9}$/.test(value)) {
      return "Phone must start with 252 and be exactly 12 digits";
    }

    return null;
  };

  // More lenient phone validation for real-time checking
  const isPhoneValid = (value) => {
    if (!value) return false;

    // General Somalia number format for all mobile money services (12 digits)
    return value.length === 12 && /^252\d{9}$/.test(value);
  };

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Email must be valid";
    return null;
  };

  // Handle amount selection
  const handleQuickAmount = (value) => {
    setAmount(value);
    setErrors({ ...errors, amount: null });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setErrors({ ...errors, amount: null });
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);

    // Auto-select Paystack when card is chosen (like website2)
    if (method === "card") {
      const paystackBank = supportedBanks.find(
        (bank) => bank.method === "card"
      );
      if (paystackBank && !paystackBank.disable) {
        setSelectedBank(paystackBank);
      } else {
        setSelectedBank(null);
      }
    } else {
      setSelectedBank(null);
    }
  };

  // Handle bank selection
  const handleBankSelection = (bank) => {
    if (!bank.disable) {
      setSelectedBank(bank);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  // Handle phone input with formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("252")) {
      value = "252";
    }
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 12) {
      handleInputChange("phone", numericValue);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    const amountError = validateAmount(amount);
    if (amountError) newErrors.amount = amountError;

    if (paymentMethod === "mobile_money") {
      const nameError = validateName(formData.name);
      if (nameError) newErrors.name = nameError;

      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (paymentMethod === "card") {
      const firstNameError = validateName(formData.firstName);
      if (firstNameError) newErrors.firstName = firstNameError;

      const lastNameError = validateName(formData.lastName);
      if (lastNameError) newErrors.lastName = lastNameError;

      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handlers
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (paymentMethod === "mobile_money") {
        if (!selectedBank) return;
        await callMobileMoneyApi(
          paymentMobileMoney({
            name: formData.name,
            phone: formData.phone,
            amount: String(amount),
            project_id: Number(project.project_id || project.id),
            accNo: selectedBank.accNo,
            service: selectedBank.service,
            bank: selectedBank.name,
          })
        );
      } else if (paymentMethod === "card") {
        // For card payments, use the auto-selected Paystack bank
        const paystackBank = supportedBanks.find(
          (bank) => bank.method === "card"
        );
        if (!paystackBank) return;

        const paystackData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          amount: String(amount),
          project_id: Number(project.project_id || project.id),
          accNo: paystackBank.accNo,
          service: "paystack", // Must be exactly "paystack"
          bank: "Paystack", // Must be exactly "Paystack"
        };

        console.log("🔍 PAYSTACK REQUEST DATA:", paystackData);
        console.log("🔍 PAYSTACK BANK:", paystackBank);

        await callPaystackApi(paymentPaystack(paystackData));
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  // Handle successful payment responses
  useEffect(() => {
    if (paystackData) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        window.location.href = paystackData.url;
        clearPaystackStates();
      }, 5000);

      const countdownTimer = setInterval(() => {
        setRedirectCount((prev) => prev - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }

    if (mobileMoneyData) {
      if (onDonationComplete) onDonationComplete({ type: "success" });
      setTimeout(() => {
        clearMobileMoneyStates();
      }, 3000);
    }
  }, [paystackData, mobileMoneyData]);

  // Auto-clear errors
  useEffect(() => {
    if (mobileMoneyError || paystackError) {
      // Enhanced error logging for debugging
      if (paystackError) {
        console.error("🔥 PAYSTACK ERROR DETAILS:");
        console.error("Full error:", paystackError);
        console.error("Response status:", paystackError?.response?.status);
        console.error("Response data:", paystackError?.response?.data);
        console.error("Error message:", paystackError?.message);
      }

      if (onDonationComplete) {
        const errorMessage =
          getErrorMessage(mobileMoneyError) || getErrorMessage(paystackError);
        onDonationComplete({ type: "error", message: errorMessage });
      }
      const timer = setTimeout(() => {
        clearMobileMoneyStates();
        clearPaystackStates();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mobileMoneyError, paystackError]);

  // Get filtered banks for selected payment method
  const getFilteredBanks = () => {
    return supportedBanks.filter((bank) => bank.method === paymentMethod);
  };

  const isFormValid = () => {
    // Basic requirements
    if (!amount || !paymentMethod) {
      return false;
    }

    // For card payments, check if Paystack is available (auto-selected)
    if (paymentMethod === "card") {
      const paystackBank = supportedBanks.find(
        (bank) => bank.method === "card"
      );
      if (!paystackBank || paystackBank.disable) {
        return false;
      }
    } else {
      // For other payment methods, require manual bank selection
      if (!selectedBank) {
        return false;
      }
    }

    // Payment method specific requirements
    if (paymentMethod === "mobile_money") {
      if (!formData.name || !formData.phone) {
        return false;
      }

      // Run live validation for mobile money fields
      const nameError = validateName(formData.name);
      const phoneValid = isPhoneValid(formData.phone);

      if (nameError || !phoneValid) {
        return false;
      }
    }

    if (paymentMethod === "card") {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        return false;
      }

      // Run live validation for card fields
      const firstNameError = validateName(formData.firstName);
      const lastNameError = validateName(formData.lastName);
      const emailError = validateEmail(formData.email);

      if (firstNameError || lastNameError || emailError) {
        return false;
      }
    }

    // Validate amount
    const amountError = validateAmount(amount);
    if (amountError) {
      return false;
    }

    return true;
  };

  return (
    <div className="donation-form">
      {/* Project Summary */}
      <div className="project-summary">
        <img
          src={project.images?.url_1 || defaultImg}
          alt={project.title}
          className="project-image"
        />
        <div className="project-info">
          <h4>Supporting: {project.title}</h4>
          <p>Your donation will make a real difference!</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {mobileMoneyData && (
        <div className="notification success">
          <strong>Payment Successful!</strong> Thank you for your donation.
        </div>
      )}

      {isRedirecting && paystackData && (
        <div className="countdown-notice">
          <h4>Redirecting to payment page...</h4>
          <p>You will be redirected in {redirectCount} seconds</p>
          <div className="loading-spinner"></div>
        </div>
      )}

      {(mobileMoneyError || paystackError) && (
        <div className="notification error">
          <strong>Payment Failed:</strong>{" "}
          {getErrorMessage(mobileMoneyError) || getErrorMessage(paystackError)}
        </div>
      )}

      {/* Amount Selection */}
      <div className="form-group">
        <label className="form-label">Enter Donation Amount</label>
        <div className="amount-buttons row">
          {quickAmounts.map((quickAmount) => (
            <div key={quickAmount} className="col-md-4 col-6 mb-2">
              <button
                type="button"
                className={`btn w-100 ${
                  amount == quickAmount ? "selected" : ""
                }`}
                onClick={() => handleQuickAmount(quickAmount)}
              >
                ${quickAmount}
              </button>
            </div>
          ))}
        </div>

        <div
          className={`input-container mt-3 ${
            errors.amount ? "amount-error" : ""
          }`}
        >
          <span className="currency-symbol">$</span>
          <input
            type="number"
            className="amount-input"
            placeholder="Enter custom amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        {errors.amount && <div className="error-message">{errors.amount}</div>}
      </div>

      {/* Payment Method Selection */}
      <div className="form-group">
        <label className="form-label">Select Payment Method</label>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-option ${
              paymentMethod === method.id ? "selected" : ""
            }`}
            onClick={() => handlePaymentMethodChange(method.id)}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => {}}
            />
            <label>
              <div>
                <strong>{method.name}</strong>
                <br />
                <small>{method.description}</small>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Bank/Service Selection - Hidden for card payments (auto-selected) */}
      {paymentMethod && paymentMethod !== "card" && (
        <div className="form-group">
          <label className="form-label">
            Choose{" "}
            {paymentMethod === "mobile_money" ? "Mobile Service" : "Bank"}
          </label>
          <div className="row">
            {getFilteredBanks().map((bank) => (
              <div key={bank.id} className="col-md-6 col-12 mb-2">
                <div
                  className={`bank-option ${
                    selectedBank?.id === bank.id ? "selected" : ""
                  } ${bank.disable ? "disabled" : ""}`}
                  onClick={() => handleBankSelection(bank)}
                  title={
                    bank.disable
                      ? "This payment method is not available for this project"
                      : bank.display || bank.name
                  }
                >
                  <img
                    src={bank.img}
                    alt={bank.display || bank.name}
                    style={{ maxHeight: "40px", width: "auto" }}
                  />
                </div>
              </div>
            ))}
          </div>
          {getFilteredBanks().some((bank) => bank.disable) && (
            <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
              <em>Grayed out options are not available for this project</em>
            </p>
          )}
        </div>
      )}

      {/* Bank Steps Guide */}
      {selectedBank && paymentMethod === "bank" && (
        <div className="form-group">
          <div className="bank-steps-guide">
            <h6>Need help with your donation?</h6>
            <p>
              Click the button below to see step-by-step instructions for
              donating with {selectedBank.display}.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setShowBankStepsModal(true)}
            >
              📱 Show Donation Steps
            </button>
          </div>
        </div>
      )}

      {/* Payment Details Forms */}
      {selectedBank && paymentMethod === "mobile_money" && (
        <div className="form-group">
          <label className="form-label">Your Information</label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}

          <input
            type="text"
            className="form-control"
            placeholder={
              selectedBank?.name === "e-dahab"
                ? "E-Dahab Phone (25265X, 25266X, 25262X, or 25264X)"
                : "Phone Number (252XXXXXXXXX)"
            }
            value={formData.phone}
            onChange={handlePhoneChange}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
          {/* {selectedBank?.name === "e-dahab" && (
            <small className="text-muted">
              E-Dahab phone numbers should start with 25265, 25266, 25262, or
              25264
            </small>
          )} */}
        </div>
      )}

      {paymentMethod === "card" && (
        <div className="form-group">
          <div
            className="paystack-notice mb-3"
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <p
              className="mb-2"
              style={{ color: "#504747", fontSize: "0.95rem" }}
            >
              <strong>Note:</strong> All transactions will be processed securely
              through our partner,{" "}
              <a
                href="https://paystack.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Paystack
              </a>
              , a payment gateway provider owned by{" "}
              <a
                href="https://stripe.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Stripe
              </a>
              .
            </p>
            <p
              className="mb-0"
              style={{ color: "#504747", fontSize: "0.9rem" }}
            >
              Your statement will show{" "}
              <strong>"Shaqodoon International - Kenya"</strong>. Paystack
              applies a transaction fee of{" "}
              <span style={{ color: "red" }}>3.8%</span> to each payment.
            </p>
          </div>

          <label className="form-label">Card Holder Information</label>

          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <div className="error-message">{errors.firstName}</div>
              )}
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <div className="error-message">{errors.lastName}</div>
              )}
            </div>
          </div>

          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        className="btn-primary"
        disabled={!isFormValid() || mobileMoneyLoading || paystackLoading}
        onClick={handleSubmit}
      >
        {mobileMoneyLoading || paystackLoading ? (
          <>
            <span className="loading-spinner"></span>
            Processing...
          </>
        ) : (
          `Donate $${amount || "0"}`
        )}
      </button>

      {/* Bank Steps Modal */}
      <BankStepsModal
        show={showBankStepsModal}
        onHide={() => setShowBankStepsModal(false)}
        selectedBank={selectedBank}
        amount={amount}
      />
    </div>
  );
};

export default DonationForm;

import axios from "axios";

const API_BASE_URL = "https://api.caprover.sokaab.com/api";
// const API_BASE_URL = "http://localhost:3000/api";
const endPoint = "/public/payment";

export const checkAccount = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${endPoint}/checkAccount`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const paymentMobileMoney = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${endPoint}/donate`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkEdahabInvoice = async (project_id, invoice_id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${endPoint}/check-edahab-invoice/${project_id}/${invoice_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const paymentPaystack = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${endPoint}/paystack`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyPaystackPayment = async (reference) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${endPoint}/verifyPaystack/${reference}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

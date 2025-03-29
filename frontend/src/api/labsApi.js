import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { getAccessToken, getHeaders } from "../utils/utils";

export const getTestOrders = async () => {
  const url = `${API_URL}/api/test_orders/`;
  return axios.get(url, getHeaders());
};

export const getTestResults = async (test_order_id) => {
  const url = `${API_URL}/api/test_results/?test_order_id=${test_order_id}`;
  return axios.get(url, getHeaders());
};

export const saveTestResults = async (payload) => {
  const url = `${API_URL}/api/test_results/save_results/`;
  return axios.post(url, payload, getHeaders());
};

export const finalizeTestOrder = async (payload) => {
  const url = `${API_URL}/api/test_orders/submit_reports/`;
  return axios.post(url, payload, getHeaders());
};

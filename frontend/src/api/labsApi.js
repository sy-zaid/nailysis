import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { getAccessToken, getHeaders } from "../utils/utils";

/**
 * Fetches all test orders from the API.
 * @returns {Promise} Axios GET request promise.
 */
export const getTestOrders = async () => {
  const url = `${API_URL}/api/test_orders/`;
  return axios.get(url, getHeaders());
};

/**
 * Deletes a specific test order.
 * @param {number} test_order_id - The ID of the test order to delete.
 * @returns {Promise} Axios DELETE request promise.
 */
export const deleteTestOrder = async (test_order_id) => {
  const url = `${API_URL}/api/test_orders/${test_order_id}/`;
  return axios.delete(url, getHeaders());
};

/**
 * Fetches test results for a specific test order.
 * @param {number} test_order_id - The ID of the test order.
 * @returns {Promise} Axios GET request promise.
 */
export const getTestResults = async (test_order_id) => {
  const url = `${API_URL}/api/test_results/?test_order_id=${test_order_id}`;
  return axios.get(url, getHeaders());
};

/**
 * Fetches test results by test ID.
 * @param {number} test_id - The ID of the test.
 * @returns {Promise} Axios GET request promise.
 */
export const getTestResultsById = async (test_id) => {
  const url = `${API_URL}/api/test_results/?test_id=${test_id}`;
  return axios.get(url, getHeaders());
};

/**
 * Saves or updates test results.
 * @param {Object} payload - The data to be saved (test order ID, test type ID, technician ID, test entries, comments).
 * @returns {Promise} Axios POST request promise.
 */
export const saveTestResults = async (payload) => {
  const url = `${API_URL}/api/test_results/save_results/`;
  return axios.post(url, payload, getHeaders());
};

/**
 * Submits test results for a test order.
 * @param {Object} payload - The test order submission data.
 * @returns {Promise} Axios POST request promise.
 */
export const submitTestResults = async (payload) => {
  const url = `${API_URL}/api/test_orders/submit_results/`;
  return axios.post(url, payload, getHeaders());
};

/**
 * Finalizes a test order, marking it as completed.
 * @param {number} id - The ID of the test order to finalize.
 * @returns {Promise} Axios POST request promise.
 */
export const finalizeTestOrder = async (id) => {
  const url = `${API_URL}/api/test_orders/${id}/finalize_test_order/`;
  return axios.post(url, {}, getHeaders());
};

/**
 * Saves an admin comment on a test result.
 * @param {number} reportId - The ID of the test report.
 * @param {Object} payload - The comment data.
 * @returns {Promise} Axios POST request promise.
 */
export const saveAdminComment = async (reportId, payload) => {
  const url = `${API_URL}/api/test_results/${reportId}/add_comment/`;
  return axios.post(url, payload, getHeaders());
};

/**
 * Marks a test result as finalized.
 * @param {number} reportId - The ID of the test result.
 * @returns {Promise} Axios POST request promise.
 */
export const markResultFinalized = async (reportId) => {
  const url = `${API_URL}/api/test_results/${reportId}/mark_finalized/`;
  return axios.post(url, {}, getHeaders());
};

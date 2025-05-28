import axios from "axios";
import { getAccessToken, getHeaders } from "../utils/utils";
const API_URL = import.meta.env.VITE_API_URL;
const token = getAccessToken()
/**
 * Fetches all test orders from the API.
 * @returns {Promise} Axios GET request promise.
 */
export const getNailysisResultsFromId = async (reportId) => {
  const url = `${API_URL}/api/nails/${reportId}/get-report/`;
  return axios.get(url, getHeaders());
};

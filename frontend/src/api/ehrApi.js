import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { getAccessToken } from "../utils/utils";

// Headers with Authorization
const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  };
};

// GET all EHR records or filter by patient ID
export const getEHR = async (patientId = null) => {
  try {
    const url = patientId
      ? `${API_URL}/api/ehr_records/?patient=${patientId}`
      : `${API_URL}/api/ehr_records/`;
    const response = await axios.get(url, getHeaders());
    return response;
  } catch (error) {
    console.error("Error fetching EHR records:", error);
    throw error;
  }
};

// GET a single EHR record by ID
export const getEHRById = async (ehrId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/ehr_records/${ehrId}/`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching EHR record ${ehrId}:`, error);
    throw error;
  }
};

// POST (Create a new EHR record)
export const createEHR = async (ehrData) => {
  try {
    return await axios.post(
      `${API_URL}/api/ehr_records/create_record/`,
      ehrData,
      getHeaders()
    );
  } catch (error) {
    console.error(`Error creating EHR record:`, error);
    throw error;
  }
};

// PUT (Update an existing EHR record)
export const updateEHR = async (ehrId, ehrData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/ehr_records/${ehrId}/`,
      ehrData,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating EHR record ${ehrId}:`, error);
    throw error;
  }
};

// DELETE (Remove an EHR record)
export const deleteEHR = async (ehrId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/ehr_records/${ehrId}/`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting EHR record ${ehrId}:`, error);
    throw error;
  }
};

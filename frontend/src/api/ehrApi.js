import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import { getAccessToken,getHeaders} from "../utils/utils";



/**
 * Fetches EHR records from the API.
 * - If a `patientId` is provided, it returns records specific to that patient.
 * - If no `patientId` is provided, it returns all EHR records.
 *
 * @param {number|null} [patientId=null] - The ID of the patient to filter EHR records by. If null, fetches all records.
 * @returns {Promise<Object>} API response containing the EHR records.
 * @throws {Error} Logs and throws an error if the request fails.
 */
export const getEHR = async (patientId = null) => {
  try {
    const url = patientId
      ? `${API_URL}/api/ehr_records/?patient=${patientId}`
      : `${API_URL}/api/ehr_records/`;
    return await axios.get(url, getHeaders());
  } catch (error) {
    console.error("Error fetching EHR records:", error);
    throw error;
  }
};

/**
 * Fetches a single EHR record by its unique ID.
 *
 * @param {number} ehrId - The unique ID of the EHR record to retrieve.
 * @returns {Promise<Object>} The EHR record data.
 * @throws {Error} Logs and throws an error if the request fails.
 */
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

/**
 * Creates a new EHR record.
 *
 * @param {Object} ehrData - The data for the new EHR record.
 * @returns {Promise<Object>} The created EHR record.
 * @throws {Error} Logs and throws an error if the request fails.
 */
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

/**
 * Updates an existing EHR record by ID.
 *
 * @param {number} ehrId - The unique ID of the EHR record to update.
 * @param {Object} ehrData - The updated data for the EHR record.
 * @returns {Promise<Object>} The updated EHR record data.
 * @throws {Error} Logs and throws an error if the request fails.
 */
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

/**
 * Deletes an existing EHR record by ID.
 *
 * @param {number} ehrId - The unique ID of the EHR record to delete.
 * @returns {Promise<Object>} API response confirming deletion.
 * @throws {Error} Logs and throws an error if the request fails.
 */
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

export const addEHRToMedicalHistory = async (ehrId) => {
  console.log("EHRID TO ADDING MH",ehrId)
  try {
    const response = await axios.post(
      `${API_URL}/api/ehr_records/${ehrId}/add_ehr_to_medical_history/`,
      {},
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMedicalHistory = async (patientId = null) => {
  try {
    const url = patientId
      ? `${API_URL}/medical_history/?patient=${patientId}`
      : `${API_URL}/medical_history/`;
    return await axios.get(url, getHeaders());
  } catch (error) {
    console.log("Error fetching Medical History: ",error);
    throw error;
  }
};

// REMOVE TRY CATCH BLOCKS FROM HERE BUT USE ON THE PAGE!!!
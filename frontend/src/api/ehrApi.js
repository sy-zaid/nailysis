// import api from "./axiosInstance";
import axios from "axios";
const token = localStorage.getItem("access");

export const getEHR = (ehrId) => api.get(`/api/ehr_records/${ehrId}/`);
export const updateEHR = (ehrId, data) =>
  api.patch(`/api/ehr_records/${ehrId}/`, data);
export const deleteEHR = (ehrId) => api.delete(`/api/ehr_records/${ehrId}/`);

export const createEHR = (data) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/ehr_records/create_record/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure JSON format
      },
    }
  );
};

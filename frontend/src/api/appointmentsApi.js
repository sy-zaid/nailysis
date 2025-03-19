// import api from "./axiosInstance";
import axios from "axios";
import { getHeaders } from "../utils/utils";
const API_URL = import.meta.env.VITE_API_URL;

export const getLabTechnicianAppointments = async () => {
  const url = `${API_URL}/api/lab_technician_appointments/`;
  return axios.get(url, getHeaders());
};

export const getAvailableLabTests = async () => {
  const url = `${API_URL}/api/test_types/`;
  return axios.get(url, getHeaders());
};

export const bookAppointment = (appointmentData) => {
  const url = `${API_URL}/api/doctor_appointments/book_appointment/`;
  return axios.post(url, appointmentData, getHeaders());
};

export const cancelAppointment = (appointmentId) =>
  api.delete(`/api/appointments/${appointmentId}/`);

export const deleteAppointment = async (appointmentId) => {
  const url = `${API_URL}/api/doctor_appointments/${appointmentId}/`;
  return axios.delete(url, getHeaders());
};

export const getDoctorSpecializations = async () => {
  const url = `${API_URL}/api/doctors/`;
  return axios.get(url, getHeaders());
};

export const getTechnicianSpecializations = async () => {
  const url = `${API_URL}/api/lab_technicians`;
  return axios.get(url, getHeaders());
};

export const getDoctorFromSpecialization = (specialization) => {
  const url = `${API_URL}/api/doctors/?specialization=${specialization}`;
  return axios.get(url, getHeaders());
};
export const getTechnicianFromSpecialization = (specialization) => {
  const url = `${API_URL}/api/lab_technicians/?specialization=${specialization}`;
  return axios.get(url, getHeaders());
};

export const getDocFeeByType = (appointmentType) => {
  const url = `${API_URL}/api/doctor_fees/get_fees`;
  return axios.get(url, getHeaders());
};
export const getTechFeeByType = (appointmentType) => {
  const url = `${API_URL}/api/lab_technician_fees/get_fees`;
  return axios.get(url, getHeaders());
};

export const rescheduleDoctorAppointment = async (
  appointmentId,
  appointmentData
) => {
  const url = `${API_URL}/api/doctor_appointments/${appointmentId}/`;
  return axios.put(url, appointmentData, getHeaders());
};

export const saveCompleteDoctorAppointment = async (appointmentId, ehrData) => {
  const url = `${API_URL}/api/doctor_appointments/${appointmentId}/save_and_complete/`;
  return axios.post(url, ehrData, getHeaders());
};

export const getAvailableSlots = async (doctorId, labTechnicianId, date) => {
  let url;

  if (doctorId) {
    url = `${API_URL}/api/time_slots/?doctor_id=${doctorId}&date=${date}`;
  } else if (labTechnicianId) {
    url = `${API_URL}/api/time_slots/?lab_technician_id=${labTechnicianId}&date=${date}`;
  } else {
    throw new Error("Either doctorId or labTechnicianId must be provided.");
  }

  const response = await axios.get(url, getHeaders());
  return Array.isArray(response.data) ? response.data : [];
};

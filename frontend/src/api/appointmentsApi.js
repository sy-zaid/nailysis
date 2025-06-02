// import api from "./axiosInstance";
import axios from "axios";
import { getHeaders } from "../utils/utils";
const API_URL = import.meta.env.VITE_API_URL;

export const getLabTechnicianAppointments = async () => {
  const url = `${API_URL}/api/lab_technician_appointments/`;
  return axios.get(url, getHeaders());
};
export const getRecommendedTests = async (email_or_id, userRole) => {
  if (userRole === "lab_admin") {
    const url = `${API_URL}/api/ehr_records/recommended_tests/?email=${email_or_id}`;
    return axios.get(url, getHeaders());
  } else if (userRole === "patient") {
    const url = `${API_URL}/api/ehr_records/recommended_tests/?patient=${email_or_id}`;
    return axios.get(url, getHeaders());
  }
};
export const getDoctorAppointments = async () => {
  const url = `${API_URL}/api/doctor_appointments/`;
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
  return axios.get(url, {
    responseType: "json",
    ...getHeaders(),
  });
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

export const rescheduleDoctorAppointment = async (
  appointmentId,
  appointmentData
) => {
  const url = `${API_URL}/api/doctor_appointments/${appointmentId}/`;
  return axios.put(url, appointmentData, getHeaders());
};

export const saveCompleteDoctorAppointment = async (appointmentId, ehrData) => {
  const url = `${API_URL}/api/doctor_appointments/${appointmentId}/complete_appointment_with_ehr/`;
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

export const rescheduleTechnicianAppointment = async (
  appointmentId,
  appointmentData
) => {
  const url = `${API_URL}/api/lab_technician_appointments/${appointmentId}/reschedule_technician_appointment/`;
  return axios.put(url, appointmentData, getHeaders());
};

export const bookTechnicianAppointment = async (payload) => {
  const url = `${API_URL}/api/lab_technician_appointments/book_appointment/`;
  return axios.post(url, payload, getHeaders());
};

export const cancelTechnicianAppointment = async (appointmentId) => {
  const url = `${API_URL}/api/lab_technician_appointments/${appointmentId}/cancel_appointment/`;
  return axios.post(url, getHeaders());
};

export const completeTechnicianAppointment = async (appointmentId) => {
  const url = `${API_URL}/api/lab_technician_appointments/${appointmentId}/complete_appointment/`;
  return axios.post(url, {}, getHeaders());
};

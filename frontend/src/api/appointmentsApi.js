// import api from "./axiosInstance";
import axios from "axios";
import { getHeaders } from "../utils/utils";
const API_URL = import.meta.env.VITE_API_URL;

export const getAppointments = () => api.get("/api/appointments/");
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

export const getDoctorSpecializations = () => {
  const url = `${API_URL}/api/doctors/`;
  return axios.get(url, getHeaders());
};

export const getDoctorFromSpecialization = (specialization) => {
  const url = `${API_URL}/api/doctors/?specialization=${specialization}`;
  return axios.get(url, getHeaders());
};

export const getFeeFromAppointmentType = (appointmentType) => {
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

export const saveAndCompleteDoctorAppointment = async (
  appointmentId,
  ehrData
) => {
  const url = `${API_URL}/api/doctor_appointments/${appointmentId}/save_and_complete/`;
  return axios.post(url, ehrData, getHeaders());
};

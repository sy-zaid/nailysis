import api from "./axiosInstance";

export const getAppointments = () => api.get("/api/appointments/");
export const createAppointment = (appointmentData) => api.post("/api/appointments/", appointmentData);
export const cancelAppointment = (appointmentId) => api.delete(`/api/appointments/${appointmentId}/`);

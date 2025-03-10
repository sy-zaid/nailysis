import React, { useState, useEffect } from "react";
import styles from "./popup-doctor-appointment-book.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import {
  getAccessToken,
  handleInputChange,
  visitPurposes,
} from "../../../utils/utils.js";

import {
  getDoctorFromSpecialization,
  getDoctorSpecializations,
  rescheduleDoctorAppointment,
} from "../../../api/appointmentsApi.js";

const PopupRescheduleAppointment = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const token = getAccessToken();
  const { data: curUser, isLoading, isError, error } = useCurrentUserData(); // Fetch patient data
  const [patient, setPatient] = useState([]); // Initialize patient state
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: appointmentDetails.doctor.user.id || "",
    specialization: "",
    patientName: appointmentDetails.patient.user.patient_name || "",
    age: appointmentDetails.patient.user.age || "",
    phone: appointmentDetails.patient.user.phone || "",
    email: appointmentDetails.patient.user.email || "",
    appointmentDate: appointmentDetails.appointmentDate || "",
    startTime: appointmentDetails.startTime || "",
    appointmentType: appointmentDetails.appointmentType || "",
  });

  const [doctors, setDoctors] = useState([]);

  const onInputChange = handleInputChange(setFormData);

  useEffect(() => {
    if (curUser && curUser.length > 0) {
      setPatient([curUser[0].user, curUser[0]]); // Set patient data if available
    } else {
      console.log("No patient data available");
    }
  }, [curUser]);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await getDoctorSpecializations();
        setSpecializations(response.data);
      } catch (error) {
        console.error("Failed to fetch specializations", error);
        throw error;
      }
    };

    fetchSpecializations();
  }, [token]);

  // Fetch doctors based on selected specialization
  useEffect(() => {
    const fetchDoctors = async () => {
      if (formData.specialization) {
        try {
          const response = await getDoctorFromSpecialization(
            formData.specialization
          );
          const formattedDoctors = response.data.map((doc) => ({
            id: doc.user?.user_id,
            name: `${doc.user?.first_name} ${doc.user?.last_name}`,
          }));
          setDoctors(formattedDoctors);
        } catch (error) {
          console.error("Failed to fetch doctors", error);
          throw error;
        }
      }
    };

    fetchDoctors();
  }, [formData.specialization, token]);

  const handleRescheduleAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      doctor_id: formData.doctorId,
      appointment_date: formData.appointmentDate,
      start_time: formData.startTime,
      appointment_type: formData.appointmentType,
      specialization: formData.specialization,
      status: "Rescheduled",
    };
    // console.log("SENDING THIS TO RESCHEDULE:", appointmentData);
    try {
      const response = await rescheduleDoctorAppointment(
        appointmentDetails.appointment_id,
        appointmentData
      );
      alert("Appointment Rescheduled Successfully");
    } catch (error) {
      alert("Failed to reschedule appointment");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Reschedule Your Appointment</h2>
        </div>

        <h5 className={styles.subhead}>
          Select a new time for your appointment
        </h5>
        <hr />

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Patient Information (Read-Only) */}
          <div className={styles.formSection}>
            <h3>Patient Information</h3>
            <div className={styles.formGroup}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={
                    patient[0]?.first_name + " " + patient[0]?.last_name || ""
                  }
                  disabled
                />
              </div>
              <div>
                <label>Age</label>
                <input
                  type="text"
                  name="age"
                  value={patient[1]?.age || ""}
                  disabled
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={patient[0]?.phone || ""}
                  disabled
                />
              </div>
              <div>
                <label>Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={patient[0]?.email || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Reschedule Appointment Details */}
          {/* Appointment Details */}
          <div className={styles.formGroup}>
            <label>Specialization</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={onInputChange}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={onInputChange}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Date & Time</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={onInputChange}
            />
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={onInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Visit Purpose</label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={onInputChange}
            >
              {visitPurposes.map((purpose, index) => (
                <option key={index} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.confirmButton}
              type="submit"
              onClick={handleRescheduleAppointment}
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupRescheduleAppointment;

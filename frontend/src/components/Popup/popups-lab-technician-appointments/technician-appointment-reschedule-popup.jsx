import React, { useState, useEffect } from "react";
import styles from "./technician-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../../useCurrentUserData.jsx";

const visitPurposes = [
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel (BMP)",
  "Hemoglobin A1c (HbA1c)",
  "Testosterone Test",
  "PCR Test",
  "BRCA Gene Test"
];

const PopupRescheduleLabAppointment = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const { data: curUser, isLoading, isError, error } = usePatientData(); // Fetch patient data
  const [patient, setPatient] = useState([]); // Initialize patient state
  const [specializations, setSpecializations] = useState([]);
  useEffect(() => {
    if (curUser && curUser.length > 0) {
      setPatient([curUser[0].user, curUser[0]]); // Set patient data if available
    } else {
      console.log("No patient data available");
    }
  }, [curUser]);

  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    patientName: appointmentDetails.patient.user.patient_name || "",
    age: appointmentDetails.patient.user.age || "",
    phone: appointmentDetails.patient.user.phone || "",
    email: appointmentDetails.patient.user.email || "",
    appointmentDate: appointmentDetails.appointmentDate || "",
    appointmentTime: appointmentDetails.appointmentTime || "",
    appointmentType: appointmentDetails.appointmentType || "",
  });

  const [labTechnicians, setLabTechnicians] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (e) => {
    const [date, time] = e.target.value.split("T");
    setFormData((prev) => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: time || "",
    }));
  };

  // Fetch lab technicians based on selected specialization
  useEffect(() => {
    const fetchLabTechnicians = async () => {
      if (formData.specialization) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/lab_technicians/?specialization=${formData.specialization}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Response", response.data)
          const formattedLabTechnicians = response.data.map((doc) => ({
            id: doc.user.user_id,
            name: `${doc.user.first_name} ${doc.user.last_name}`,
          }));
          console.log("fetch lab technician", formattedLabTechnicians)
          setLabTechnicians(formattedLabTechnicians);
        } catch (error) {
          console.error("Failed to fetch lab technicians", error);
        }
      }
    };

    fetchLabTechnicians();
  }, [formData.specialization, token]);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/lab_technicians/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpecializations(response.data);
      } catch (error) {
        console.error("Failed to fetch specializations", error);
      }
    };

    fetchSpecializations();
  }, [token]);

  const handleRescheduleAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      user_id: formData.user_id,
      appointment_date: formData.appointmentDate,
      start_time: formData.appointmentTime,
      appointment_type: formData.appointmentType,
      specialization: formData.specialization,
    };

    try {
      console.log("Sending this to update", appointmentData)
      const response = await axios.put(
        `http://127.0.0.1:8000/api/lab_technician_appointments/${appointmentDetails.appointment_id}/`,
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment Rescheduled Successfully");
      navigate("");
    } catch (error) {
      alert("Failed to reschedule appointment");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
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
              onChange={handleInputChange}
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
            <label>Lab Technician</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
            >
              <option value="">Select Lab Technician</option>
              {labTechnicians.map((labTechnician) => (
                <option key={labTechnician.id} value={labTechnician.id}>
                  {labTechnician.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="appointmentDateTime"
              value={
                formData.appointmentDate && formData.appointmentTime
                  ? `${formData.appointmentDate}T${formData.appointmentTime}`
                  : ""
              }
              onChange={handleDateTimeChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Visit Purpose</label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleInputChange}
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

export default PopupRescheduleLabAppointment;

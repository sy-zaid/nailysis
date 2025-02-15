import React, { useState, useEffect } from "react";
import styles from "./popup-book-appointment.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../useCurrentUserData.jsx";

const PopupDeleteAppointment = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const { data: curUser, isLoading, isError, error } = usePatientData(); // Fetch patient data
  const [patient, setPatient] = useState([]); // Initialize patient state

  useEffect(() => {
    if (curUser && curUser.length > 0) {
      setPatient([curUser[0].user, curUser[0]]); // Set patient data if available
    } else {
      console.log("No patient data available");
    }
  }, [curUser]);

  const handleDeleteAppointment = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/${
          appointmentDetails.appointment_id
        }/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment Deleted Successfully");
      navigate("");
    } catch (error) {
      alert("Failed to delete appointment");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Delete Appointment</h2>
        </div>

        <h5 className={styles.subhead}>
          Are you sure you want to delete this appointment?
        </h5>
        <hr />

        {/* Display minimal patient and appointment details */}
        <div className={styles.formSection}>
          <h3>Appointment Details</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Patient Name</label>
              <input
                type="text"
                value={`${appointmentDetails.patient.user.first_name} ${appointmentDetails.patient.user.last_name}`}
                disabled
              />
            </div>
            <div>
              <label>Doctor</label>
              <input
                type="text"
                value={`${appointmentDetails.doctor.user.first_name} ${appointmentDetails.doctor.user.last_name}`}
                disabled
              />
            </div>
            <div>
              <label>Appointment Date</label>
              <input
                type="text"
                value={`${appointmentDetails.appointment_date || ""} | ${appointmentDetails.appointment_time || ""}`}
                disabled
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleDeleteAppointment}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupDeleteAppointment;

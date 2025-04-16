import React, { useState, useEffect } from "react";
import styles from "./doctor-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import { getAccessToken } from "../../../utils/utils.js";
import { deleteAppointment } from "../../../api/appointmentsApi.js";
import { toast } from "react-toastify";

const DeleteAppointmentPopup = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  
  const handleDeleteAppointment = async () => {
    try {
      const response = await deleteAppointment(
        appointmentDetails.appointment_id
      );
      if (response.status === 204) {
        toast.success("Appointment Deleted Successfully!", {
          className: "custom-toast",
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(
          error.response.data.error || "Failed to Delete Appointment",
          { className: "custom-toast" }
        );
      } else {
        toast.error("Network Error", {
          className: "custom-toast",
        });
      }
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
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
                value={`${appointmentDetails.appointment_date || ""} | ${
                  appointmentDetails.start_time || ""
                }`}
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

export default DeleteAppointmentPopup;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "../Popup";
import styles from "../popups-doctor-appointments/popup-doctor-appointment-book.module.css";
const PopupEHRDelete = ({ onClose, recordDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  
  const token = localStorage.getItem("access");
  console.log("record Details:", recordDetails);

  const handleDeleteEHR = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/ehr_records/${recordDetails.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Delete Record</h2>
        </div>

        <h5 className={styles.subhead}>
          Are you sure you want to delete this appointment?
        </h5>
        <hr />

        {/* Display minimal patient and appointment details */}
        <div className={styles.formSection}>
          <h3>Electronic Health Record Details</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Patient Name</label>
              <input
                type="text"
                value={`${recordDetails?.patientName}`}
                disabled
              />
            </div>
            <div>
              <label>Doctor</label>
              <input
                type="text"
                value={`${recordDetails.consultedBy}`}
                disabled
              />
            </div>
            <div>
              <label>Last Updated</label>
              <input
                type="text"
                value={`${recordDetails.lastUpdated}`}
                disabled
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleDeleteEHR}>
            Confirm Delete
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupEHRDelete;

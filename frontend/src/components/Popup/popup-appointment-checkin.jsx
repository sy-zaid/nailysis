import React, { useState, useEffect } from "react";
import styles from "./popup-appointment-book.module.css"; // Adjust the CSS module accordingly
import Popup from "./Popup.jsx"; // Assuming Popup component is reused
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUserData from "../../useCurrentUserData.jsx";

const PopupStartAppointment = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  console.log("APP DETAILS:-------------", appointmentDetails);
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  const [patient, setPatient] = useState([]);
  const [timer, setTimer] = useState(0); // Timer for appointment start
  const [ehrData, setEhrData] = useState({
    medical_conditions: [],
    current_medications: [],
    immunization_records: [],
    nail_image_analysis: "",
    test_results: "",
    diagnoses: "",
    comments: "",
    family_history: "",
    category: "",
  });

  // Start the timer as soon as the popup shows
  useEffect(() => {
    if (curUser && curUser.length > 0) {
      setPatient([curUser[0].user, curUser[0]]);
    }

    // Timer logic
    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000); // Update timer every second

    return () => clearInterval(interval); // Clean up timer on unmount
  }, [curUser]);

  // Handle input change for EHR fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For fields that should be arrays, split by comma and trim spaces
    if (
      name === "medical_conditions" ||
      name === "current_medications" ||
      name === "immunization_records"
    ) {
      setEhrData((prevData) => ({
        ...prevData,
        [name]: value.split(",").map((item) => item.trim()), // Split by comma and remove extra spaces
      }));
    } else {
      setEhrData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle EHR record creation
  const handleStartAppointment = async () => {
    try {
      console.log("SENDING THIS TO START APPOINTMENT", ehrData);
      // Assuming you have an API endpoint to create an EHR record
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/${appointmentDetails.appointment_id}/save_and_complete/`,
        ehrData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment Started and EHR Created Successfully");
      navigate("/appointments"); // Navigate to the appointments page after success
    } catch (error) {
      alert("Failed to start the appointment");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Start Appointment</h2>
        </div>

        <h5 className={styles.subhead}>Patient Details & EHR Record</h5>
        <hr />

        {/* Display patient details */}
        <div className={styles.formSection}>
          <h3>Patient Details</h3>
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
                  appointmentDetails.appointment_start_time || ""
                }`}
                disabled
              />
            </div>
          </div>
        </div>

        {/* EHR record input fields */}
        <div className={styles.formSection}>
          <h3>EHR Record Details</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Medical Conditions</label>
              <input
                type="text"
                name="medical_conditions"
                value={ehrData.medical_conditions}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Current Medications</label>
              <input
                type="text"
                name="current_medications"
                value={ehrData.current_medications}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Immunization Records</label>
              <input
                type="text"
                name="immunization_records"
                value={ehrData.immunization_records}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Nail Image Analysis</label>
              <input
                type="text"
                name="nail_image_analysis"
                value={ehrData.nail_image_analysis}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Test Results</label>
              <input
                type="text"
                name="test_results"
                value={ehrData.test_results}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Diagnoses</label>
              <input
                type="text"
                name="diagnoses"
                value={ehrData.diagnoses}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Comments</label>
              <input
                type="text"
                name="comments"
                value={ehrData.comments}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Family History</label>
              <input
                type="text"
                name="family_history"
                value={ehrData.family_history}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>category</label>
              <input
                type="text"
                name="category"
                value={ehrData.category}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className={styles.timer}>
          <p>Timer: {timer} seconds</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleStartAppointment}
          >
            Save & Complete Appointment
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupStartAppointment;

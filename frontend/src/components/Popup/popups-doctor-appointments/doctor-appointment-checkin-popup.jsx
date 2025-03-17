import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./doctor-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import useCurrentUserData from "../../../useCurrentUserData.jsx";

import {
  medicalConditionsOptions,
  categoryOptions,
  handleInputChange,
  handleSelectChange,
} from "../../../utils/utils.js";
import { saveAndCompleteDoctorAppointment } from "../../../api/appointmentsApi.js";

const CheckinDoctorAppointmentPopup= ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const { data: curUser } = useCurrentUserData();
  const [timer, setTimer] = useState(0);
  const [ehrData, setEhrData] = useState({
    medical_conditions: [],
    current_medications: [],
    immunization_records: [],
    nail_image_analysis: "",
    test_results: "",
    diagnoses: [],
    comments: "",
    family_history: "",
    category: "General",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onSelectChange = handleSelectChange(setEhrData);

  const onInputChange = handleInputChange(setEhrData);

  const handleStartAppointment = async () => {
    try {
      const formData = new FormData();
      Object.entries(ehrData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Keep JSON format for arrays
        } else {
          formData.append(key, value);
        }
      });
      await saveAndCompleteDoctorAppointment(
        appointmentDetails.appointment_id,
        formData
      );
      alert("Appointment Started and EHR Created Successfully");
    } catch (error) {
      alert("Failed to start the appointment");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div className={styles.formContainer}>
        <h2>Start Appointment</h2>
        <h5 className={styles.subhead}>
          Patient Details & electronic_health_record Record
        </h5>
        <hr />

        {/* Medical Conditions */}
        <div className={styles.formGroup}>
          <label>Medical Conditions</label>
          <Select
            isMulti
            options={medicalConditionsOptions}
            onChange={(selected) =>
              onSelectChange("medical_conditions", selected)
            }
          />
        </div>

        {/* Current Medications */}
        <div className={styles.formGroup}>
          <label>Current Medications</label>
          <Select
            isMulti
            options={[
              { value: "Metformin", label: "Metformin" },
              { value: "Aspirin", label: "Aspirin" },
              { value: "Lisinopril", label: "Lisinopril" },
              { value: "Atorvastatin", label: "Atorvastatin" },
            ]}
            placeholder="Select or add medications"
            onChange={(selected) =>
              onSelectChange("current_medications", selected)
            }
          />
        </div>

        {/* Diagnoses */}
        <div className={styles.formGroup}>
          <label>Diagnoses</label>
          <Select
            isMulti
            options={[
              { value: "Anemia", label: "Anemia" },
              { value: "Diabetes", label: "Diabetes" },
              { value: "Hypertension", label: "Hypertension" },
              { value: "Fungal Infection", label: "Fungal Infection" },
            ]}
            placeholder="Select diagnoses"
            onChange={(selected) => onSelectChange("diagnoses", selected)}
          />
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label>Category</label>
          <Select
            options={categoryOptions}
            defaultValue={categoryOptions[3]}
            onChange={(selected) =>
              setEhrData({ ...ehrData, category: selected.value })
            }
          />
        </div>

        {/* Comments */}
        <div className={styles.formGroup}>
          <label>Comments</label>
          <textarea
            name="comments"
            placeholder="Add any additional comments"
            value={ehrData.comments}
            onChange={onInputChange}
          />
        </div>

        {/* Family History */}
        <div className={styles.formGroup}>
          <label>Family History</label>
          <textarea
            name="family_history"
            placeholder="Enter relevant family medical history"
            value={ehrData.family_history}
            onChange={onInputChange}
          />
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

export default CheckinDoctorAppointmentPopup;

import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./popup-appointment-book.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUserData from "../../useCurrentUserData.jsx";

const medicalConditionsOptions = [
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Heart Disease", label: "Heart Disease" },
  { value: "Asthma", label: "Asthma" },
];

const categoryOptions = [
  { value: "Chronic", label: "Chronic" },
  { value: "Emergency", label: "Emergency" },
  { value: "Preventive", label: "Preventive" },
  { value: "General", label: "General" },
];

const PopupStartAppointment = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
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

  const handleSelectChange = (name, selectedOptions) => {
    setEhrData((prevData) => ({
      ...prevData,
      [name]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEhrData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEhrData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStartAppointment = async () => {
    try {
      const formData = new FormData();
      Object.entries(ehrData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/${appointmentDetails.appointment_id}/save_and_complete/`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      alert("Appointment Started and EHR Created Successfully");
      navigate("/appointments");
    } catch (error) {
      alert("Failed to start the appointment");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <h2>Start Appointment</h2>
        <h5 className={styles.subhead}>Patient Details & EHR Record</h5>
        <hr />
        <div className={styles.formGroup}>
          <label>Medical Conditions</label>
          <Select isMulti options={medicalConditionsOptions} onChange={(selected) => handleSelectChange("medical_conditions", selected)} />
        </div>
        <div className={styles.formGroup}>
          <label>Category</label>
          <Select options={categoryOptions} defaultValue={categoryOptions[3]} onChange={(selected) => setEhrData({ ...ehrData, category: selected.value })} />
        </div>
        {/* <div className={styles.formGroup}>
          <label>Nail Image Analysis</label>
          <input type="file" name="nail_image_analysis" accept="image/*" onChange={handleFileChange} />
        </div> */}
        {/* <div className={styles.formGroup}>
          <label>Test Results</label>
          <input type="file" name="test_results" accept="application/pdf, image/*" onChange={handleFileChange} />
        </div> */}
        <div className={styles.formGroup}>
          <label>Comments</label>
          <textarea name="comments" value={ehrData.comments} onChange={handleInputChange}></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Family History</label>
          <textarea name="family_history" value={ehrData.family_history} onChange={handleInputChange}></textarea>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.confirmButton} onClick={handleStartAppointment}>Save & Complete Appointment</button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupStartAppointment;

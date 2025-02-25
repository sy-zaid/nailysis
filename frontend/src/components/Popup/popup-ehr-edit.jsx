import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./popup-appointment-book.module.css";
import Popup from "./Popup.jsx";
import axios from "axios";
/**
 * Predefined medical condition options for react-select.
 * Used to standardize selectable conditions.
 */
const medical_conditionsOptions = [
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Heart Disease", label: "Heart Disease" },
  { value: "Asthma", label: "Asthma" },
]; 
 
/**
 * Predefined category options for react-select.
 */
const categoryOptions = [
  { value: "Chronic", label: "Chronic" },
  { value: "Emergency", label: "Emergency" },
  { value: "Preventive", label: "Preventive" },
  { value: "General", label: "General" },
];

/**
 * Predefined diagnosis options for react-select.
 */
const diagnosesOptions = [
  { value: "Anemia", label: "Anemia" },
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Fungal Infection", label: "Fungal Infection" },
];

/**
 * Popup for editing Electronic Health Record (EHR).
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the popup.
 * @param {Object} props.recordDetails - Object containing EHR data.
 * @returns {JSX.Element} The popup UI for editing an EHR.
*/

const PopupEHREdit = ({ onClose, recordDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [ehrData, setEhrData] = useState({
    medical_conditions: [],
    medications: [],
    diagnoses: [],
    category: "",
    comments: "",
    family_history: "",
  });
  const token = localStorage.getItem("access");
  console.log("record details:", recordDetails);
  /**
   * Effect hook to update ehrData when recordDetails change.
   */
  useEffect(() => {
    if (recordDetails) {
      setEhrData({
        medical_conditions: mapSelectedOptions(
          recordDetails.medical_conditions,
          medical_conditionsOptions
        ),
        medications: mapSelectedOptions(recordDetails.medications, []), // Define medication options if available
        diagnoses: mapSelectedOptions(
          recordDetails.diagnostics,
          diagnosesOptions
        ),
        category:
          categoryOptions.find((opt) => opt.value === recordDetails.category) ||
          null,
        comments: recordDetails.comments || "",
        family_history: recordDetails.family_history || "",
      });
    }
  }, [recordDetails]);

  /**
   * Maps a comma-separated string from the backend to a react-select-compatible array.
   *
   * @param {string} data - Comma-separated string of selected values.
   * @param {Array} optionsList - The list of predefined options.
   * @returns {Array} Mapped array of selected options for react-select.
   */
  const mapSelectedOptions = (data, optionsList) => {
    if (!data || data === "No records") return [];
    return data.split(", ").map(
      (item) =>
        optionsList.find((opt) => opt.value === item) || {
          value: item,
          label: item,
        }
    );
  };

  const handleSaveEdit = async () => {
    try {
      const formattedData = {
        medical_conditions: ehrData.medical_conditions.map((item) => item.value), // Convert to array of strings
        current_medications: ehrData.medications.map((item) => item.value),
        diagnoses: ehrData.diagnoses.map((item) => item.value),
        category: ehrData.category ? ehrData.category.value : "", // Convert category to string
        comments: ehrData.comments,
        family_history: ehrData.family_history,
      };

      console.log("JSON Data:", formattedData); // Debugging output

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/ehr_records/${
          recordDetails.id
        }/`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("EHR Updated Successfully");
    } catch (error) {
      alert("Failed to Update EHR");
      console.error(error);
    }
  };

  /**
   * Handles updates to multi-select dropdown fields.
   *
   * @param {string} name - The state key to update.
   * @param {Array} selectedOptions - The selected options from react-select.
   */
  const handleSelectChange = (name, selectedOptions) => {
    setEhrData((prevData) => ({
      ...prevData,
      [name]: selectedOptions || [],
    }));
  };

  /**
   * Handles text input field changes.
   *
   * @param {Object} e - The event object from input change.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEhrData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <h2>Edit EHR</h2>
        <h5 className={styles.subhead}>
          Patient Details & Electronic Health Record
        </h5>
        <hr />

        {/* Medical Conditions */}
        <div className={styles.formGroup}>
          <label>Medical Conditions</label>
          <Select
            isMulti
            options={medical_conditionsOptions}
            value={ehrData.medical_conditions}
            onChange={(selected) =>
              handleSelectChange("medical_conditions", selected)
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
            value={ehrData.medications}
            placeholder="Select or add medications"
            onChange={(selected) => handleSelectChange("medications", selected)}
          />
        </div>

        {/* Diagnoses */}
        <div className={styles.formGroup}>
          <label>Diagnoses</label>
          <Select
            isMulti
            options={diagnosesOptions}
            value={ehrData.diagnoses}
            placeholder="Select diagnoses"
            onChange={(selected) => handleSelectChange("diagnoses", selected)}
          />
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label>Category</label>
          <Select
            options={categoryOptions}
            value={ehrData.category}
            onChange={(selected) =>
              setEhrData({ ...ehrData, category: selected })
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
            onChange={handleInputChange}
          />
        </div>

        {/* Family History */}
        <div className={styles.formGroup}>
          <label>Family History</label>
          <textarea
            name="family_history"
            placeholder="Enter relevant family medical history"
            value={ehrData.family_history}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleSaveEdit}>
            Save and Confirm
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupEHREdit;

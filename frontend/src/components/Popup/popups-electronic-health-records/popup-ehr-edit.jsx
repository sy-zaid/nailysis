import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "../popups-doctor-appointments/doctor-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import axios from "axios";
import { toast } from "react-toastify";

import {
  medicalConditionsOptions,
  categoryOptions,
  diagnosesOptions,
  immunizationRecordsOptions,
  calculateAge,
} from "../../../utils/utils.js";

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
    immunization_records: [],
    category: "",
    comments: "",
    family_history: "",
  });
  const token = localStorage.getItem("access");
  // console.log("recordDetails", recordDetails);
  /**
   * Effect hook to update ehrData when recordDetails change.
   */
  useEffect(() => {
    if (recordDetails) {
      setEhrData({
        medical_conditions: mapSelectedOptions(
          recordDetails.medical_conditions,
          medicalConditionsOptions
        ),
        medications: mapSelectedOptions(recordDetails.medications, []),
        diagnoses: mapSelectedOptions(
          recordDetails.diagnoses,
          diagnosesOptions
        ),
        immunization_records: mapSelectedOptions(
          recordDetails.immunization,
          immunizationRecordsOptions
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
        medical_conditions: ehrData.medical_conditions.map(
          (item) => item.value
        ),
        current_medications: ehrData.medications.map((item) => item.value),
        diagnoses: ehrData.diagnoses.map((item) => item.value),
        immunization_records: ehrData.immunization_records.map(
          (item) => item.value
        ),
        category: ehrData.category ? ehrData.category.value : "",
        comments: ehrData.comments,
        family_history: ehrData.family_history,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/ehr_records/${recordDetails.id}/`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("EHR updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error || "Failed to update EHR");
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
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div
        className={styles.formContainer}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          paddingRight: "8px",
        }}
      >
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2>Edit Electronic Health Record</h2>
          </div>
          <div className={styles.subhead}>
            <h5>Update patient's electronic health record details</h5>
          </div>
          <hr />
        </div>

        {/* Patient Information Section */}
        <div className={styles.formSection}>
          <h3>
            <i
              className="fa-solid fa-circle fa-2xs"
              style={{ color: "#007bff", marginRight: "10px" }}
            ></i>
            Patient Details
          </h3>
          <div className={styles.newFormGroup}>
            <div>
              <label>Patient ID</label>
              <p className={styles.subHeading}>
                {recordDetails?.patient_id || "N/A"}
              </p>
            </div>
            <div>
              <label>Patient Name</label>
              <p className={styles.subHeading}>
                {recordDetails?.patient_name || ""}
              </p>
            </div>
            <div>
              <label>Last Updated</label>
              <p className={styles.subHeading}>
                {recordDetails?.last_updated || "N/A"}
              </p>
            </div>
            <div>
              <label>Consulted By</label>
              <p className={styles.subHeading}>
                {recordDetails?.consulted_by || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <hr />

        {/* EHR Information Section */}
        <div className={styles.formSection}>
          <h3>
            <i
              className="fa-solid fa-circle fa-2xs"
              style={{ color: "#007bff", marginRight: "10px" }}
            ></i>
            Health Record Details
          </h3>

          {/* Medical Conditions */}
          <div className={styles.formGroup}>
            <label>Medical Conditions</label>
            <Select
              isMulti
              options={medicalConditionsOptions}
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
              onChange={(selected) =>
                handleSelectChange("medications", selected)
              }
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

          {/* Immunization Records */}
          <div className={styles.formGroup}>
            <label>Immunization Records</label>
            <Select
              isMulti
              options={immunizationRecordsOptions}
              value={ehrData.immunization_records}
              placeholder="Select immunization records"
              onChange={(selected) =>
                handleSelectChange("immunization_records", selected)
              }
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

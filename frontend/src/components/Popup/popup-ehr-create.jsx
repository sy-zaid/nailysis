import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./popup-appointment-book.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createEHR, getEHR, getEHRById } from "../../api/ehrApi.js";
import { useAllPatients } from "../../api/usersApi.js";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import {
  getAccessToken,
  handleSelectChange,
  handleInputChange,
  formatEhrRecords,
} from "../../utils/utils.js";
import {
  medicalConditionsOptions,
  categoryOptions,
  diagnosesOptions,
} from "../../utils/utils.js";
import { useEhrUpdatesWS } from "../../sockets/ehrSocket.js";

const PopupEHRCreate = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const token = getAccessToken();

  // Fetch Patients List
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [ehrData, setEhrData] = useState({
    patient_id: "",
    medical_conditions: [],
    current_medications: [],
    immunization_records: [],
    nail_image_analysis: "",
    test_results: "",
    diagnoses: [],
    comments: "",
    family_history: "",
    category: "General",
    visit_date: "2025-02-21",
  });
  const [isPatientConfirmed, setIsPatientConfirmed] = useState(false);
  const [records, setRecords] = useState([]);
  const { data: patientsData, isLoading, error } = useAllPatients();

  // Set up WebSocket connection when component mounts
  const socket = useEhrUpdatesWS(setRecords);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching patients</p>;
  }
  useEffect(() => {
    try {
      const formattedPatients =
        patientsData?.map((patient) => ({
          value: patient.user.user_id,
          label: `${patient.user.first_name} ${patient.user.last_name}`,
          details: patient,
        })) || [];

      setPatients(formattedPatients);
      console.log("Formatted Patients:", formattedPatients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [patientsData]);

  const handlePatientChange = async (selected) => {
    setSelectedPatient(selected);
    setIsPatientConfirmed(false); // Reset confirmation when changing patient

    if (selected) {
      try {
        const response = await getEHR(selected.value);
        // Formatting the response data to display on table
        setRecords(formatEhrRecords(response));

        // Use setEhrData correctly to update state
        setEhrData((prev) => ({
          ...prev,
          patient_id: selected.value, // Ensure patient_id is set properly
        }));

        setIsPatientConfirmed(true);
      } catch (error) {
        console.error("Error changing patient:", error);
      }
    }
  };

  const handleCreateEHR = async () => {
    try {
      // Prepare request payload
      const payload = { ...ehrData };

      // Ensure arrays are sent as JSON strings (since backend expects them)
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          payload[key] = JSON.stringify(value);
        }
      });

      // Send API request
      const response = await createEHR(payload);

      if (response.status === 201) {
        alert("EHR created successfully");

        // Send WebSocket update with structured message
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "ehr_update",
              action: "create",
              id: response.data.id, // Backend sends this
              message: "New EHR Record Created!",
              ehr_data: response.data.ehr_data, // Backend sends full EHR data
            })
          );
        }
      }
    } catch (error) {
      alert("Failed to create new EHR");
      console.error(error);
    }
  };

  // Function to update value from input field into ehrData (e.g. onChange={onInputChange})
  const onInputChange = handleInputChange(setEhrData);
  // Function to update value from select field into ehrData (e.g. onChange={(selected) => onSelectChange("diagnoses", selected)})
  const onSelectChange = handleSelectChange(setEhrData);

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <h2>Start Appointment</h2>
        <h5 className={styles.subhead}>Patient Details & EHR Record</h5>
        <hr />

        {/* Patient Selection */}
        <div className={styles.formGroup}>
          <label>Select Patient</label>
          <Select
            options={patients}
            isSearchable
            onChange={handlePatientChange}
            placeholder="Search & select patient"
          />
          <button disabled={!selectedPatient}>
            Confirm Patient to Add New Record
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>

                <th>Record ID</th>
                <th>Patient Name</th>
                <th>Consulted By</th>
                <th>Category</th>
                <th>Medical Conditions</th>
                <th>Medications</th>
                <th>Family History</th>
                <th>Immunization</th>
                <th>Test Reports</th>
                <th>Nail Image Analysis</th>
                <th>Consultation Notes</th>
                <th>Diagnostics</th>
                <th>Last Updated</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {records?.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>

                  <td>{record.id}</td>
                  <td>{record.patient_name}</td>
                  <td>{record.consulted_by}</td>
                  <td>{record.category}</td>
                  <td>{record.medical_conditions}</td>
                  <td>{record.medications}</td>
                  <td>{record.family_history}</td>
                  <td>{record.immunization}</td>
                  <td>{record.test_reports}</td>
                  <td>{record.nail_image_analysis}</td>
                  <td>{record.notes}</td>
                  <td>{record.diagnostics}</td>
                  <td>{record.last_updated}</td>

                  {/* <td>
                    <button onClick={() => toggleMenu(record.id)}>⋮</button>
                    {menuOpen === record.id && (
                      <div className={styles.menu}>
                        <ul>
                          <li onClick={() => handleActionClick("Edit", record)}>
                            Edit
                          </li>
                          <li
                            onClick={() => {
                              handleActionClick("Delete", record);
                            }}
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show details only after confirming patient */}
        {isPatientConfirmed && ehrData && (
          <>
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
                value={ehrData.comments || ""}
                onChange={onInputChange}
              />
            </div>

            {/* Family History */}
            <div className={styles.formGroup}>
              <label>Family History</label>
              <textarea
                name="family_history"
                placeholder="Enter relevant family medical history"
                value={ehrData.family_history || ""}
                onChange={onInputChange}
              />
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleCreateEHR}
              >
                Save & Complete Appointment
              </button>
            </div>
          </>
        )}
      </div>
    </Popup>
  );
};

export default PopupEHRCreate;

import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./popup-appointment-book.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUserData from "../../useCurrentUserData.jsx";

const categoryOptions = [
  { value: "Chronic", label: "Chronic" },
  { value: "Emergency", label: "Emergency" },
  { value: "Preventive", label: "Preventive" },
  { value: "General", label: "General" },
];

const PopupEHRCreate = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Fetch Patients List
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [ehrData, setEhrData] = useState(null);
  const [isPatientConfirmed, setIsPatientConfirmed] = useState(false);
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/patients/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const formattedPatients = response.data.map((patient) => ({
          value: patient.user.user_id,
          label: `${patient.user.first_name} ${patient.user.last_name}`,
          details: patient,
        }));
        setPatients(formattedPatients);
        console.log("Formatted Patients:", formattedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientChange = async (selected) => {
    setSelectedPatient(selected);
    setIsPatientConfirmed(false); // Reset confirmation when changing patient

    if (selected) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ehr_records/?patient=${
            selected.value
          }`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const transformedRecords = response.data.map((record) => ({
          id: record.id,
          patient_name: `${record.patient?.user?.first_name || "Null"} ${
            record.patient?.user?.last_name || "Null"
          }`,
          category: record.category || "N/A",
          notes: record.comments || "No comments",
          last_updated: record.last_updated
            ? new Date(record.last_updated).toLocaleDateString() +
              " | " +
              new Date(record.last_updated).toLocaleTimeString()
            : "N/A",
          consulted_by: record.consulted_by || "Unknown",
          medical_conditions: Array.isArray(record.medical_conditions)
            ? record.medical_conditions.join(", ")
            : "No records",
          medications: Array.isArray(record.current_medications)
            ? record.current_medications.join(", ")
            : "No records",
          immunization:
            Array.isArray(record.immunization_records) &&
            record.immunization_records.length > 1
              ? record.immunization_records.join(", ")
              : "No records",
          family_history: record.family_history || "No records",
          test_reports: Array.isArray(record.test_reports)
            ? record.test_reports.join(", ")
            : "No records",
          nail_image_analysis: Array.isArray(record.nail_image_analysis)
            ? record.nail_image_analysis.join(", ")
            : "No records",
          diagnostics: Array.isArray(record.diagnostics)
            ? record.diagnostics.join(", ")
            : "No records",
        }));

        setRecords(transformedRecords);
        setIsPatientConfirmed(true);
      } catch (error) {
        console.error("Error fetching EHR data:", error);
      }
    }
  };

  const confirmPatientSelection = async () => {
    // if (!selectedPatient) {
    //   return;
    // }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ehr_records/?patient=${
          selectedPatient.value
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const transformedRecords = response.data.map((record) => ({
        id: record.id,
        patient_name: `${record.patient?.user?.first_name || "Null"} ${
          record.patient?.user?.last_name || "Null"
        }`,
        category: record.category || "N/A",
        notes: record.comments || "No comments",
        last_updated: record.last_updated
          ? new Date(record.last_updated).toLocaleDateString() +
            " | " +
            new Date(record.last_updated).toLocaleTimeString()
          : "N/A",
        consulted_by: record.consulted_by || "Unknown",
        medical_conditions: Array.isArray(record.medical_conditions)
          ? record.medical_conditions.join(", ")
          : "No records",
        medications: Array.isArray(record.current_medications)
          ? record.current_medications.join(", ")
          : "No records",
        immunization:
          Array.isArray(record.immunization_records) &&
          record.immunization_records.length > 1
            ? record.immunization_records.join(", ")
            : "No records",
        family_history: record.family_history || "No records",
        test_reports: Array.isArray(record.test_reports)
          ? record.test_reports.join(", ")
          : "No records",
        nail_image_analysis: Array.isArray(record.nail_image_analysis)
          ? record.nail_image_analysis.join(", ")
          : "No records",
        diagnostics: Array.isArray(record.diagnostics)
          ? record.diagnostics.join(", ")
          : "No records",
      }));
      setRecords(transformedRecords);
      setIsPatientConfirmed(true);
      console.log("ALL PATIENT RECORDS", records);
    } catch (error) {
      console.error("Error fetching EHR data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEhrData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartAppointment = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/${
          appointmentDetails.appointment_id
        }/save_and_complete/`,
        ehrData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment started and EHR updated successfully");
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

        {/* Patient Selection */}
        <div className={styles.formGroup}>
          <label>Select Patient</label>
          <Select
            options={patients}
            isSearchable
            onChange={handlePatientChange}
            placeholder="Search & select patient"
          />
          <button onClick={confirmPatientSelection} disabled={!selectedPatient}>
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
            <div className={styles.formGroup}>
              <label>Medical Conditions</label>
              <input
                type="text"
                name="medical_conditions"
                value={ehrData.medical_conditions}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Current Medications</label>
              <input
                type="text"
                name="current_medications"
                value={ehrData.current_medications}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Family History</label>
              <textarea
                name="family_history"
                value={ehrData.family_history}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <Select
                options={categoryOptions}
                defaultValue={categoryOptions.find(
                  (opt) => opt.value === ehrData.category
                )}
                onChange={(selected) =>
                  setEhrData({ ...ehrData, category: selected.value })
                }
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
          </>
        )}
      </div>
    </Popup>
  );
};

export default PopupEHRCreate;

import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./popup-appointment-book.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import popupEhrCreateConfirm from "./popup-ehr-create-confirm.jsx";


const medicalConditionsOptions = [
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

const PopupEHRCreate = ({ onClose, appointmentDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

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

        // Use setEhrData correctly to update state
        setEhrData((prev) => ({
          ...prev,
          patient_id: selected.value, // Ensure patient_id is set properly
        }));

        setIsPatientConfirmed(true);
      } catch (error) {
        console.error("Error fetching EHR data:", error);
      }
    }
  };

  // const confirmPatientSelection = async () => {
  //   // if (!selectedPatient) {
  //   //   return;
  //   // }
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/api/ehr_records/?patient=${
  //         selectedPatient.value
  //       }`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     const transformedRecords = response.data.map((record) => ({
  //       id: record.id,
  //       patient_name: `${record.patient?.user?.first_name || "Null"} ${
  //         record.patient?.user?.last_name || "Null"
  //       }`,
  //       category: record.category || "N/A",
  //       notes: record.comments || "No comments",
  //       last_updated: record.last_updated
  //         ? new Date(record.last_updated).toLocaleDateString() +
  //           " | " +
  //           new Date(record.last_updated).toLocaleTimeString()
  //         : "N/A",
  //       consulted_by: record.consulted_by || "Unknown",
  //       medical_conditions: Array.isArray(record.medical_conditions)
  //         ? record.medical_conditions.join(", ")
  //         : "No records",
  //       medications: Array.isArray(record.current_medications)
  //         ? record.current_medications.join(", ")
  //         : "No records",
  //       immunization:
  //         Array.isArray(record.immunization_records) &&
  //         record.immunization_records.length > 1
  //           ? record.immunization_records.join(", ")
  //           : "No records",
  //       family_history: record.family_history || "No records",
  //       test_reports: Array.isArray(record.test_reports)
  //         ? record.test_reports.join(", ")
  //         : "No records",
  //       nail_image_analysis: Array.isArray(record.nail_image_analysis)
  //         ? record.nail_image_analysis.join(", ")
  //         : "No records",
  //       diagnostics: Array.isArray(record.diagnostics)
  //         ? record.diagnostics.join(", ")
  //         : "No records",
  //     }));
  //     setRecords(transformedRecords);
  //     setEhrData((prev) => ({
  //       ...prev,
  //       patient_id: selectedPatient.value, // Ensure patient_id is set
  //     }));
  //     setIsPatientConfirmed(true);
  //     console.log("ALL PATIENT RECORDS", records);
  //   } catch (error) {
  //     console.error("Error fetching EHR data:", error);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEhrData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEHR = async () => {
    try {
      popupEhrCreateConfirm(true);
      const formData = new FormData();
      Object.entries(ehrData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); //  Keep JSON format for arrays
        } else {
          formData.append(key, value);
        }
      });
  
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ehr_records/create_record/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "application/form-data",
        }
      );
      alert("EHR created successfully");
    } catch (error) {
      alert("Failed to create new EHR");
      console.error(error);
    }
  };
  const handleSelectChange = (name, selectedOptions) => {
    setEhrData((prevData) => ({
      ...prevData,
      [name]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <div className={styles.headerSection}>
          <div className={styles.titleSection}>
            <h2>Add New EHR Record</h2>
            <p>Choose a patient from list to add new record</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <span>×</span>
          </button>
        </div>
        <hr />

        <div className={styles.popupBottom}>

        {/* Patient Selection Dropdown */}
        <div className={styles.patientSelectSection}>
          <label>Select Patient</label>
          <div className={styles.dropdown}>
            <Select
              options={patients}
              isSearchable
              onChange={handlePatientChange}
              placeholder="ID: PAT001 | Mr. John Doe"
            />
          </div>
        </div>

        {/* Patient Information Section */}
        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.bullet}></div>
            <h3>Patient Information</h3>
          </div>

          <div className={styles.patientInfoGrid}>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Patient ID</div>
              <div className={styles.infoValue}>123456</div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Patient Name</div>
              <div className={styles.infoValue}>Mr. John Doe</div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Age</div>
              <div className={styles.infoValue}>32</div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Gender</div>
              <div className={styles.infoValue}>Male</div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Phone Number</div>
              <div className={styles.infoValue}>+92 12345678</div>
            </div>
          </div>

          <div className={styles.emailSection}>
            <div className={styles.infoLabel}>Email Address</div>
            <div className={styles.infoValue}>patient@gmail.com</div>
          </div>
        </div>

        <br />

        {/* Current Available Records Section */}
        <div className={styles.recordsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.bullet}></div>
            <h3>Current Available Records</h3>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.recordsTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Record ID</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Category</th>
                  <th>Details/Summary</th>
                  <th>Consultation Notes</th>
                  <th>Consulted By</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>123456</td>
                  <td>123456</td>
                  <td>John</td>
                  <td>Lab Test</td>
                  <td>
                    Lorem ipsum è un testo segnaposto utilizzato nel settore...
                  </td>
                  <td>
                    Lorem ipsum è un testo segnaposto utilizzato nel settore...
                  </td>
                  <td>Dr. John Doe</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>123456</td>
                  <td>123456</td>
                  <td>Doe</td>
                  <td>Lab Test</td>
                  <td>
                    Lorem ipsum è un testo segnaposto utilizzato nel settore...
                  </td>
                  <td>
                    Lorem ipsum è un testo segnaposto utilizzato nel settore...
                  </td>
                  <td>Dr. John Doe</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>123456</td>
                  <td>123456</td>
                  <td>Doe</td>
                  <td>Lab Test</td>
                  <td>
                    Lorem ipsum è un testo segnaposto utilizzato nel settore...
                  </td>
                  <td>
                    Lorem ipsum è un testo segnaposto utilizzato nel settore...
                  </td>
                  <td>Dr. John Doe</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Continue Button */}
        <div className={styles.actionSection}>
          <button className={styles.continueButton} onClick={handleCreateEHR}>
            Continue
          </button>
        </div>
      </div>

      </div>
    </Popup>
  );
};
export default PopupEHRCreate;

import React, { useState, useEffect } from "react";
import styles from "./EHR.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import axios from "axios";
const EHR = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [records, setRecords] = useState([]);
  const [apiResponse, setApiResponse] = useState();
  const token = localStorage.getItem("access");
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      try {
        const apiResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ehr_records`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // console.log("SUCCESSFULLY FETCHED EHR RECORDS");
        setApiResponse(apiResponse);
        console.log(apiResponse);

        // Transform the API response to match the dummyRecords structure
        const transformedRecords = apiResponse.data.map((record) => ({
          id: record.record_id,
          recordId: record.record_id,
          patientName: `${record.patient?.user?.first_name || ""} ${
            record.patient?.user?.last_name || ""
          }`,
          category: record.category || "N/A",
          notes: record.comments || "No comments",
          lastUpdated: record.last_updated
            ? new Date(record.last_updated).toLocaleDateString() +
              " | " +
              new Date(record.last_updated).toLocaleTimeString()
            : "N/A",
          consultedBy: record.consulted_by || "Unknown",
          medicalConditions: Array.isArray(record.medical_conditions)
            ? record.medical_conditions.join(", ")
            : "No records",
          medications: Array.isArray(record.current_medications)
            ? record.current_medications.join(", ")
            : "No records",
          immunization: Array.isArray(record.immunization_records)
            ? record.immunization_records.join(", ")
            : "No records",
          diagnostics: Array.isArray(record.diagnoses)
            ? record.diagnoses.join(", ")
            : "No recordsss",
        }));

        setRecords(transformedRecords);
        console.log("TRANSFORMED RECORDS:", records);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  const toggleMenu = (recordId) => {
    setMenuOpen(menuOpen === recordId ? null : recordId);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Electronic Health Records</h1>
          <p>View and manage patient health records</p>
        </div>
        <button className={styles.addButton}>+ Add New Record</button>
      </div>

      <div className={styles.statusContainer}>
        <span className={styles.status}>All</span>
        <span className={styles.status}>Pending Result</span>
        <span className={styles.status}>Abnormal Result</span>
        <span className={styles.status}>Your Patients</span>
        <span className={styles.completed}>50 completed, 4 pending</span>
      </div>

      <div className={styles.mainContent}>
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
                <th>Immunization</th>
                <th>Consultation Notes</th>
                <th>Diagnostics</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.recordId}</td>
                  <td>{record.patientName}</td>
                  <td>{record.consultedBy}</td>
                  <td>{record.category}</td>
                  <td>{record.medicalConditions}</td>
                  <td>{record.medications}</td>
                  <td>{record.immunization}</td>
                  <td>{record.notes}</td>
                  <td>{record.diagnostics}</td>
                  <td>{record.lastUpdated}</td>
                  <td>
                    <button onClick={() => toggleMenu(record.id)}>⋮</button>
                    {menuOpen === record.id && (
                      <div className={styles.menu}>
                        <ul>
                          <li>Edit</li>
                          <li>Delete</li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EHR;

import React, { useState, useEffect } from "react";
import styles from "./electronic-health-records.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import axios from "axios";
// Importing Popups for performing actions on EHR Records
import PopupEHREdit from "../../components/Popup/popup-ehr-edit";
import PopupEHRDelete from "../../components/Popup/popup-ehr-delete";
import PopupEHRCreate from "../../components/Popup/popup-ehr-create";

const ElectronicHealthRecord = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);
  // WebSocket useEffect
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/ehr_updates/");

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "create") {
        if (!data.ehr_data || !data.id) {
          console.warn(
            "Invalid WebSocket data received for 'create' action:",
            data
          );
          return;
        }

        // Transform the WebSocket data to match the records structure
        const newRecord = {
          id: data.id,
          patient_name: `${data.ehr_data.patient?.user?.first_name || ""} ${
            data.ehr_data.patient?.user?.last_name || ""
          }`,
          category: data.ehr_data.category || "N/A",
          notes: data.ehr_data.comments || "No comments",
          last_updated: data.ehr_data.last_updated
            ? new Date(data.ehr_data.last_updated).toLocaleDateString() +
              " | " +
              new Date(data.ehr_data.last_updated).toLocaleTimeString()
            : "N/A",
          consulted_by: data.ehr_data.consulted_by || "Unknown",
          medical_conditions: Array.isArray(data.ehr_data.medical_conditions)
            ? data.ehr_data.medical_conditions.join(", ")
            : "No records",
          medications: Array.isArray(data.ehr_data.current_medications)
            ? data.ehr_data.current_medications.join(", ")
            : "No records",
          immunization:
            Array.isArray(data.ehr_data.immunization_records) &&
            data.ehr_data.immunization_records.length > 1
              ? data.ehr_data.immunization_records.join(", ")
              : "No records",
          family_history: data.ehr_data.family_history || "No records",
          test_reports: Array.isArray(data.ehr_data.test_reports)
            ? data.ehr_data.test_reports.join(", ")
            : "No records",
          nail_image_analysis: Array.isArray(data.ehr_data.nail_image_analysis)
            ? data.ehr_data.nail_image_analysis.join(", ")
            : "No records",
          diagnostics: Array.isArray(data.ehr_data.diagnoses)
            ? data.ehr_data.diagnoses.join(", ")
            : "No records",
        };

        setRecords((prevRecords) => [...prevRecords, newRecord]);

        // fetchData();
      } else if (data.action === "update" && data.updatedRecord) {
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === data.id
              ? { ...record, ...data.updatedRecord }
              : record
          )
        ); // Update only the changed record
      } else if (data.action === "delete" && data.id) {
        setRecords((prevRecords) =>
          prevRecords.filter((r) => r.id !== data.id)
        );
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => socket.close(); // Cleanup on unmount
  }, []); // Empty dependency array ensures it runs once

  // useEffect(() => {
  // Simulate fetching data from an API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ehr_records`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("SUCCESSFULLY FETCHED ElectronicHealthRecord RECORDS");
      // setResponse(response);
      console.log(response);
      console.log("API Response Data:", response.data);

      // Transform the API response to match the dummyRecords structure
      const transformedRecords = response.data.map((record) => ({
        id: record.id,
        patient_name: `${record.patient?.user?.first_name || ""} ${
          record.patient?.user?.last_name || ""
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

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it runs once on mount

  // }, [token, popupContent]);

  const toggleMenu = (recordId) => {
    setMenuOpen(menuOpen === recordId ? null : recordId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup when button is clicked
  };

  /**
   * Handles the selected action for an EHR record.
   *
   * @param {string} action - The action to be performed (e.g., "Edit").
   * @param {number|string} id - The unique ID of the EHR record.
   */
  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on ${recordDetails}`);
    setMenuOpen(null);

    if (action === "Edit") {
      setPopupContent(
        <PopupEHREdit
          onClose={handleClosePopup}
          recordDetails={recordDetails}
        />
      );
      setShowPopup(true);
    } else if (action === "Delete") {
      setPopupContent(
        <PopupEHRDelete
          onClose={handleClosePopup}
          recordDetails={recordDetails}
        />
      );
      setShowPopup(true);
    } else if (action === "Add New Record") {
      setPopupContent(
        <PopupEHRCreate
          onClose={handleClosePopup}
          // recordDetails={recordDetails}
        />
      );
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Electronic Health Records</h1>
          <p>View and manage patient health records</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            handleActionClick("Add New Record");
          }}
        >
          + Add New Record
        </button>
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
                <th>Family History</th>
                <th>Immunization</th>
                <th>Test Reports</th>
                <th>Nail Image Analysis</th>
                <th>Consultation Notes</th>
                <th>Diagnostics</th>
                <th>Last Updated</th>
                {curUserRole === "doctor" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>

                  <td>{record.id || "No ID"}</td>
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
                  {curUserRole === "doctor" && (
                    <td>
                      <button onClick={() => toggleMenu(record.id)}>⋮</button>
                      {menuOpen === record.id && (
                        <div className={styles.menu}>
                          <ul>
                            <li
                              onClick={() => handleActionClick("Edit", record)}
                            >
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
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ElectronicHealthRecord;

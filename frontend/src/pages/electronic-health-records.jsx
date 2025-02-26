import React, { useState, useEffect } from "react";
import styles from "./electronic-health-records.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import axios from "axios";
// Importing Popups for performing actions on EHR Records
import PopupEHREdit from "../components/Popup/popup-ehr-edit";
import PopupEHRDelete from "../components/Popup/popup-ehr-delete";
import PopupEHRCreate from "../components/Popup/popup-ehr-create";

import { useEhrUpdatesWS } from "../sockets/ehrSocket";
import { formatEhrRecords } from "../utils/utils";
import { getEHR } from "../api/ehrApi";

const ElectronicHealthRecord = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);
  // WebSocket useEffect
  useEhrUpdatesWS(setRecords); // Empty dependency array ensures it runs once

  // useEffect(() => {
  // Simulate fetching data from an API
  const fetchData = async () => {
    try {
      const response = await getEHR(  );
      // Formatting the response data to display on table
      console.log("EHR_DATA", response);
      const formattedData = formatEhrRecords(response.data, "ehr_create");

      setRecords(formattedData);
      console.log("TRANSFORMED RECORDS:", records);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("Updated Records:", records);
  }, [records]); // This will log the updated records when they change

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
        {curUserRole === "doctor" && (
          <button
            className={styles.addButton}
            onClick={() => {
              handleActionClick("Add New Record");
            }}
          >
            + Add New Record
          </button>
        )}
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

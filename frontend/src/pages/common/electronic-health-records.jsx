import React, { useState, useEffect } from "react";
import styles from "./electronic-health-records.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import axios from "axios";

// Importing Popups for performing actions on EHR Records
import PopupEHREdit from "../../components/Popup/popups-electronic-health-records/popup-ehr-edit";
import PopupEHRDelete from "../../components/Popup/popups-electronic-health-records/popup-ehr-delete";
import PopupEHRCreate from "../../components/Popup/popups-electronic-health-records/popup-ehr-create";

import { useEhrUpdatesWS } from "../../sockets/ehrSocket";
import {
  formatEhrRecords,
  toggleActionMenu,
  handleOpenPopup,
  handleClosePopup,
  getAccessToken,
  getRole,
} from "../../utils/utils";
import { getEHR, addEHRToMedicalHistory } from "../../api/ehrApi";
import useCurrentUserData from "../../useCurrentUserData";

/**
 * **ElectronicHealthRecord Component**
 *
 * This component displays a table of Electronic Health Records (EHR) and
 * allows users (doctors) to add, edit, or delete records.
 *
 * - Fetches EHR data from the API on mount.
 * - Uses WebSockets to receive real-time updates.
 * - Provides action buttons for doctors to manage records.
 * - Displays EHR details in a formatted table.
 *
 * @component
 */
const ElectronicHealthRecord = () => {
  const [menuOpen, setMenuOpen] = useState(null); // Track open action menu
  const [popupContent, setPopupContent] = useState(); // Store popup content
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const [records, setRecords] = useState([]); // Store EHR records
  const curUserRole = getRole(); // Get current user role

  const { data: curUser } = useCurrentUserData(); // Fetch patient data;
  // Initialize WebSocket to receive real-time EHR updates
  useEhrUpdatesWS(setRecords);

  /**
   * Fetches EHR data from the backend and formats it.
   */
  const fetchData = async () => {
    let response;
    try {
      if (curUserRole === "patient") {
        console.log(
          "USER IS PATIENT SO FETCHING ONLY PATIENTS EHR",
          curUser[0]?.user_id
        );

        response = await getEHR(curUser[0].user_id);
      } else {
        response = await getEHR();
      }
      console.log("EHR_DATA", response);

      // Format fetched data before updating the state
      const formattedData = formatEhrRecords(response.data, "ehr_create");
      setRecords(formattedData);

      console.log("TRANSFORMED RECORDS:", formattedData);
    } catch (error) {
      console.log("Error fetching EHR data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Handles actions on EHR records (Edit, Delete, Add New).
   *
   * @param {string} action - The selected action type (e.g., "Edit", "Delete").
   * @param {object} recordDetails - The full details of the selected record.
   */
  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on`, recordDetails);
    setMenuOpen(null, menuOpen, setMenuOpen); // Close action menu

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
    } else if (action === "AddToMH") {
      console.log("Sending this to add medical history", recordDetails);
      addEHRToMedicalHistory(recordDetails);

      alert("Updated Medical History with Selected Record");
    } else if (action === "Add New Record") {
      setPopupContent(<PopupEHRCreate onClose={handleClosePopup} />);
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Electronic Health Record</h1>
          <p>
            Here you can view and manage all time health records of the patients
          </p>
        </div>
        <button className={styles.addButton}>+ Add New Record</button>
      </div>

      {/* Status Section */}
      <div className={styles.statusContainer}>
        <span className={styles.status}>All</span>
        <span className={styles.status}>Pending Result</span>
        <span className={styles.status}>Abnormal Result</span>
        <span className={styles.status}>Your Patients</span>
        <span className={styles.completed}>50 completed, 4 pending</span>
      </div>

      {/* EHR Table */}
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
                  <td>{record.id || "Null"}</td>
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
                  <td>{record.diagnoses}</td>
                  <td>{record.last_updated}</td>
                  {curUserRole === "doctor" && (
                    <td>
                      <button
                        onClick={() =>
                          toggleActionMenu(record.id, menuOpen, setMenuOpen)
                        }
                      >
                        ⋮
                      </button>
                      {menuOpen === record.id && (
                        <div className={styles.menu}>
                          <ul>
                            <li
                              onClick={() => handleActionClick("Edit", record)}
                            >
                              Edit
                            </li>
                            <li
                              onClick={() =>
                                handleActionClick("Delete", record)
                              }
                            >
                              Delete
                            </li>
                            {!record.added_to_medical_history && (
                              <li
                                onClick={() =>
                                  handleActionClick("AddToMH", record.id)
                                }
                              >
                                Add to Medical History
                              </li>
                            )}
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

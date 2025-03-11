import React, { useEffect, useState } from "react";
import styles from "./patient-health-history.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

import {
  formatMedicalHistoryRecords,
  toggleActionMenu,
  getRole,
} from "../../utils/utils.js";
import useCurrentUserData from "../../useCurrentUserData.jsx";

import { getMedicalHistory } from "../../api/ehrApi";

const PatientHealthHistory = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [records, setRecords] = useState([]);
  const curUserRole = getRole();
  const { data: curUser } = useCurrentUserData();
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    let response;
    try {
      if (curUserRole === "doctor" || curUserRole === "clinic_admin") {
        response = await getMedicalHistory();
      } else if (curUserRole === "patient") {
        response = await getMedicalHistory(curUser[0].user_id);
      } 
      const formattedData = formatMedicalHistoryRecords(response);
      console.log(formattedData);
      setRecords(formattedData);
    } catch (error) { 
      console.log("error");
      throw error;
    }
    console.log("response MEDICAL HISTORY", response);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(records.map((record) => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Patient's Health History</h1>
          <p>
            Here you can view and manage the health history and consultations of
            the patient
          </p>
        </div>
        <button className={styles.addButton}>+ Add New Record</button>
      </div>

      <div className={styles.statusContainer}>
        <span className={`${styles.status} ${styles.active}`}>All</span>
        <span className={styles.status}>Pending Results</span>
        <span className={styles.status}>Abnormal Results</span>
        <span className={styles.status}>Your Patients</span>
        <span className={styles.completed}>50 completed, 4 pending</span>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.tableActions}>
          <div className={styles.bulkActions}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectedRows.length === records.length}
              />
              <span className={styles.checkmark}></span>
            </label>
            <span>Bulk Action: Delete</span>
          </div>
          <div className={styles.searchSort}>
            <div className={styles.sortBy}>Sort By: Consulted Today</div>
            <div className={styles.search}>
              <input type="text" placeholder="Search By Patient Name" />
              {/* <button className={styles.searchButton}>🔍</button> */}
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Record ID</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Date Created</th>
                <th>Last Updated</th>
                <th>Family History</th>
                <th>Immunization History</th>
                <th>Chronic Conditions</th>
                <th>Allergies</th>
                <th>Surgeries</th>
                <th>Injuries</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{record.id}</td>
                  <td>{record.patient_id}</td>
                  <td>{record.patient_name}</td>
                  <td>{record.date_created}</td>
                  <td>{record.last_updated}</td>
                  <td>{record.family_history}</td>

                  <td>{record.immunization_history}</td>
                  <td>{record.chronic_conditions}</td>
                  <td>{record.allergies}</td>
                  <td>{record.surgeries}</td>
                  <td>{record.injuries}</td>
                  <td>
                    <button onClick={() => toggleActionMenu(record.id)}>
                      ⋮
                    </button>
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

export default PatientHealthHistory;

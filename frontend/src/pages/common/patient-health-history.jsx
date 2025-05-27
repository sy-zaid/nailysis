import React, { useEffect, useState } from "react";
// import styles from "./patient-health-history.module.css";
import styles from "./all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header.jsx";


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
  const [activeButton, setActiveButton] = useState(0); // Tracks which filter button is active

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
      {/* Page Header */}
      <div className={styles.pageTop}>
        <Header
          mainHeading={"Patient's Health History"}
          subHeading={"Here you can view and manage the health history and consultations of the patient"}
        />
      </div>
      {/* <div className={styles.header}>
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
      </div> */}

      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>

          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${activeButton === 0 ? styles.active : ""}`}
              onClick={() => setActiveButton(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ""}`}
              onClick={() => setActiveButton(3)}
            >
              Your Patients
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 1 ? styles.active : ""}`}
              onClick={() => setActiveButton(1)}
            >
              Abnormal Results
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ""}`}
              onClick={() => setActiveButton(2)}
            >
              Emergency
            </button>
            <p>50 completed, 4 pending</p>

            <button
              className={styles.addButton}
            >
              + Add New Record
            </button>
          </div>

          
          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>

              {/* Sort Dropdown */}
              <select
                className={styles.sortBy}
              >
                {/* Default option sorts by last_updated (latest first) */}
                <option value="last_updated">Sort By: Last Updated</option>
                <option value="patient_name">Patient Name (A-Z)</option>
                <option value="consulted_by">Doctor Name (A-Z)</option>
                <option value="category">Category</option>
                {/* Extra option to view the oldest records first */}
                <option value="oldest">Oldest Record</option>
              </select>

              <input
                className={styles.search}
                type="text"
                placeholder="Search"
              />
            </div>

            <hr />
            <br />

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                      />
                    </th>
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
                      <td>
                        <input
                          type="checkbox"
                        />
                      </td>
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
      </div>
    </div>
  );
};

export default PatientHealthHistory;

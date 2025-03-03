import React, { useState } from "react";
import styles from "./patient-health-history.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

const PatientHealthHistory = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleActionMenu = (recordId) => {
    setMenuOpen(menuOpen === recordId ? null : recordId);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(dummyRecords.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const dummyRecords = [
    {
      id: 1,
      patientId: "123456",
      patientName: "John",
      visitDateTime: "10/15/2023 09:30 AM",
      diagnosis: "Hypertension",
      prescribedTests: "CBC & Ray",
      testResult: "Abnormal",
      treatmentProvided: "Lorem ipsum to create symptoms of different variants",
      consultationNotes: "Lorem based on birth sequence method call tests",
      consultedBy: "Dr. John Doe"
    },
    {
      id: 2,
      patientId: "123456",
      patientName: "Doe",
      visitDateTime: "10/15/2023 09:30 AM",
      diagnosis: "Common Cold",
      prescribedTests: "CBC & Ray",
      testResult: "Pending",
      treatmentProvided: "Lorem ipsum to create symptoms of different variants",
      consultationNotes: "Lorem based on birth sequence method call tests",
      consultedBy: "Dr. John Doe"
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Patient's Health History</h1>
          <p>Here you can view and manage the health history and consultations of the patient</p>
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
                checked={selectedRows.length === dummyRecords.length}
              />
              <span className={styles.checkmark}></span>
            </label>
            <span>Bulk Action: Delete</span>
          </div>
          <div className={styles.searchSort}>
            <div className={styles.sortBy}>
              Sort By: Consulted Today
            </div>
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
                <th></th>
                <th>#</th>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Visit Date & Time</th>
                <th>Diagnosis</th>
                <th>Prescribed Tests</th>
                <th>Test Result</th>
                <th>Treatment Provided</th>
                <th>Consultation Notes</th>
                <th>Consulted By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dummyRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <label className={styles.checkboxContainer}>
                      {/* <input 
                        type="checkbox"
                        checked={selectedRows.includes(record.id)}
                        onChange={() => toggleRowSelect(record.id)}
                      /> */}
                      {/* <span className={styles.checkmark}></span> */}
                    </label>
                  </td>
                  <td>{record.id}</td>
                  <td>{record.patientId}</td>
                  <td>{record.patientName}</td>
                  <td>{record.visitDateTime}</td>
                  <td>{record.diagnosis}</td>
                  <td>{record.prescribedTests}</td>
                  <td>
                    <span className={styles[record.testResult.toLowerCase()]}>
                      {record.testResult}
                    </span>
                  </td>
                  <td>{record.treatmentProvided}</td>
                  <td>{record.consultationNotes}</td>
                  <td>{record.consultedBy}</td>
                  <td>
                    <button onClick={() => toggleActionMenu(record.id)}>⋮</button>
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
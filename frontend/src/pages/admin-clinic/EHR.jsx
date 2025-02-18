import React, { useState } from "react";
import styles from "./EHR.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

const EHR = () => {
  const [menuOpen, setMenuOpen] = useState(null);

  const toggleMenu = (recordId) => {
    setMenuOpen(menuOpen === recordId ? null : recordId);
  };

  const dummyRecords = [
    {
      id: 1,
      recordId: "REC001",
      patientName: "John Doe",
      category: "General",
      notes: "Routine check-up",
      lastUpdated: "2025-02-18",
      consultedBy: "Dr. Smith",
      medicalConditions: "None",
      medications: "Paracetamol",
      lastVisit: "2025-02-10",
      immunization: "Up to date",
      diagnostics: "Normal",
    },
    {
      id: 2,
      recordId: "REC002",
      patientName: "Jane Doe",
      category: "Cardiology",
      notes: "Heart check-up",
      lastUpdated: "2025-02-15",
      consultedBy: "Dr. Adams",
      medicalConditions: "Hypertension",
      medications: "Aspirin",
      lastVisit: "2025-02-12",
      immunization: "Up to date",
      diagnostics: "Mild issues",
    },
  ];

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
                <th>Category</th>
                <th>Consultation Notes</th>
                <th>Last Updated</th>
                <th>Consulted By</th>
                <th>Medical Conditions</th>
                <th>Medications</th>
                <th>Last Visit</th>
                <th>Immunization</th>
                <th>Diagnostics</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.recordId}</td>
                  <td>{record.patientName}</td>
                  <td>{record.category}</td>
                  <td>{record.notes}</td>
                  <td>{record.lastUpdated}</td>
                  <td>{record.consultedBy}</td>
                  <td>{record.medicalConditions}</td>
                  <td>{record.medications}</td>
                  <td>{record.lastVisit}</td>
                  <td>{record.immunization}</td>
                  <td>{record.diagnostics}</td>
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

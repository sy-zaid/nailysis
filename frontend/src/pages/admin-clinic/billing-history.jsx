import React, { useState } from "react";
import styles from "../common/patient-health-history.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

const BillingHistory = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleMenu = (recordId) => {
    setMenuOpen(menuOpen === recordId ? null : recordId);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(dummyRecords.map((record) => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const dummyRecords = [
    {
      id: 1,
      invoiceNumber: "123456",
      patientName: "John",
      actionType: "Created",
      paymentDate: "15/10/2025 09:30 PM",
      paidAmount: "RS/- 5000",
      pendingAmount: "RS/- 0",
      totalAmount: "RS/- 5000",
      consultationNotes: "Lorem based on birth sequence method call tests",
      paymentStatus: "Paid",
    },
    {
      id: 2,
      invoiceNumber: "123456",
      patientName: "Doe",
      actionType: "Edited",
      paymnentDate: "10/10/2025 09:30 AM",
      paidAmount: "RS/- 5000",
      pendingAmount: "Pending",
      totalAmount: "RS/- 5000",
      consultationNotes: "Lorem based on birth sequence method call tests",
      paymentStatus: "Paid",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div>
        <h1>Billing History & Audit Trail</h1>
        <p>Here you can view all the billing details and audit trail</p>
      </div>
      <div
        className={styles.header}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px",
        }}
      >
        <button className={styles.addButton}>Manage Availability</button>
        <button className={styles.addButton}>Export to CSV File</button>
      </div>

      <div className={styles.statusContainer}>
        <span className={`${styles.status} ${styles.active}`}>All</span>
        <span className={styles.status}>Paid</span>
        <span className={styles.status}>Pending</span>
        <span className={styles.status}>Overdue</span>
        <span className={styles.completed}>50 paid, 4 pending</span>
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
            <div className={styles.sortBy}>Sort By: Edited Today</div>
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
                <th>Invoice Nuumber</th>
                <th>Patient Name</th>
                <th>Action Type</th>
                <th>Payment Date & Time</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Total Amount</th>
                <th>Comments</th>
                <th>Payment Status</th>
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
                  <td>{record.invoiceNumber}</td>
                  <td>{record.patientName}</td>
                  <td>{record.actionType}</td>
                  <td>{record.paymnentDate}</td>
                  <td>{record.paidAmount}</td>
                  <td>
                    <span
                      className={styles[record.pendingAmount.toLowerCase()]}
                    >
                      {record.pendingAmount}
                    </span>
                  </td>
                  <td>{record.totalAmount}</td>
                  <td>{record.consultationNotes}</td>
                  <td>{record.paymentStatus}</td>
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

export default BillingHistory;

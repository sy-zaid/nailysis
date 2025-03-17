import React, { useEffect, useState } from "react";
import styles from "./invoice.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

const BillingHistory = () => {
  const [records, setRecords] = useState([
    {
      id: "123456",
      patient_name: "John Doe",
      action_type: "Created",
      date_created: "2025-03-01 09:30 AM",
      paid_amount: "RS/- 5000",
      pending_amount: "RS/- 0",
      total_amount: "RS/- 5000",
      comments: "lorem ipsum afnj asfm",
      payment_status: "Paid",
    },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  const toggleSelectAll = () => {
    if (selectedRows.length === records.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(records.map((record) => record.id));
    }
  };

  const toggleActionMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Billing History & Audit Trail</h1>
          <p>Here you can view all the billing details and audit trail</p>
        </div>
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
                checked={selectedRows.length === records.length}
              />
              <span className={styles.checkmark}></span>
            </label>
            <span>Bulk Action: Delete</span>
          </div>
          <div className={styles.searchSort}>
            <div className={styles.sortBy}>Sort By: Edited Today</div>
            <div className={styles.search}>
              <input type="text" placeholder="Search By Patient Name" />
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice No</th>
                <th>Patient Name</th>
                <th>Action Type</th>
                <th>Payment Date & Time</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Total Amount</th>
                <th>Comments</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{record.id}</td>
                  <td>{record.patient_name}</td>
                  <td>{record.action_type}</td>
                  <td>{record.date_created}</td>
                  <td>{record.paid_amount}</td>
                  <td>{record.pending_amount}</td>
                  <td>{record.total_amount}</td>
                  <td>{record.comments}</td>
                  <td>{record.payment_status}</td>
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

export default BillingHistory;

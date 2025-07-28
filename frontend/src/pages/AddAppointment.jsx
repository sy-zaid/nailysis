import React from "react";
import styles from "./AddAppointment.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Header from "../components/Dashboard/Header/Header";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const AddAppointment = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageTop}>
        <Sidebar />
        <h1>Add New Appointment</h1>
        <p>Add a new patient and schedule his/her appointment</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <h3>Patient Information</h3>
              <button className={styles.qrButton}>
                Load Profile by QR Code
              </button>
            </div>
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    className={styles.inputBox}
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    className={styles.inputBox}
                    type="number"
                    placeholder="21"
                  />
                </div>
                <div>
                  <label htmlFor="gender">Gender</label>
                  <input
                    id="gender"
                    className={styles.inputBox}
                    type="text"
                    placeholder="Male"
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    className={styles.inputBox}
                    type="tel"
                    placeholder="+92 12345678"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Appointment Details</h3>
              <div className={styles.formGroup}>
                <div>
                  <label htmlFor="technician">Technician</label>
                  <select id="technician">
                    <option>Dr. Jane Doe</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="datetime">Date & Time</label>
                  <input id="datetime" type="datetime-local" />
                </div>
                <div>
                  <label htmlFor="visitPurpose">Visit Purpose</label>
                  <select id="visitPurpose">
                    <option>Lab Test</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="testType">Test Type</label>
                  <select id="testType">
                    <option>Lab Test</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Payment Details</h3>
              <div className={styles.formGroup}>
                <div>
                  <label htmlFor="discount">Discount</label>
                  <select id="discount">
                    <option>No Discount</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="testFee">Test Fee</label>
                  <input id="testFee" type="text" placeholder="5000" />
                </div>
                <div>
                  <label htmlFor="amountPaid">Amount Paid</label>
                  <input id="amountPaid" type="text" placeholder="4000" />
                </div>
                <div>
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select id="paymentMethod">
                    <option>Cash</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="comments" className={styles.commentLabel}>
                  Comments
                </label>
                <textarea
                  id="comments"
                  placeholder="Payment of PKR 5000 received for Invoice ID 'INV-98765'"
                ></textarea>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelButton}>Cancel</button>
              <button className={styles.confirmButton}>
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;

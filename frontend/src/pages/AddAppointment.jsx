import React from "react";
import styles from "./AddAppointment.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Header from "../components/Dashboard/Header/Header";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const AddAppointment = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageTop}>
        <Navbar />
        <h1>Add New Appointment</h1>
        <p>Add a new patient and schedule his/her appointment</p>
        <Sidebar/>
      </div>

      <div className={styles.mainContent}>
    

        <div className={styles.content}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
            <h3>Patient Information</h3>
              <button className={styles.qrButton}>Load Profile by QR Code</button>
              
            </div>
            <div className={styles.formSection}>
             
              <div className={styles.formGroup}>
                <div>
                  <label>Name</label>
                  <input className={styles.inputBox} type="text" placeholder="John Doe" />
                </div>
                <div>
                  <label>Age</label>
                  <input className={styles.inputBox} type="number" placeholder="21" />
                </div>
                <div>
                  <label>Gender</label>
                  <input className={styles.inputBox} type="text" placeholder="Male" />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input className={styles.inputBox} type="tel" placeholder="+92 12345678" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Appointment Details</h3>
              <div className={styles.formGroup}>
                <div>
                  <label>Technician</label>
                  <select>
                    <option>Dr. Jane Doe</option>
                  </select>
                </div>
                <div>
                  <label>Date & Time</label>
                  <input type="datetime-local" />
                </div>
                <div>
                  <label>Visit Purpose</label>
                  <select>
                    <option>Lab Test</option>
                  </select>
                </div>
                <div>
                  <label>Test Type</label>
                  <select>
                    <option>Lab Test</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Payment Details</h3>
              <div className={styles.formGroup}>
                <div>
                  <label>Discount</label>
                  <select>
                    <option>No Discount</option>
                  </select>
                </div>
                <div>
                  <label>Test Fee</label>
                  <input type="text" placeholder="5000" />
                </div>
                <div>
                  <label>Amount Paid</label>
                  <input type="text" placeholder="4000" />
                </div>
                <div>
                  <label>Payment Method</label>
                  <select>
                    <option>Cash</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={styles.commentLabel} >Comments</label>
                <textarea placeholder="Payment of PKR 5000 received for Invoice ID 'INV-98765'"></textarea>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelButton}>Cancel</button>
              <button className={styles.confirmButton}>Confirm Appointment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;

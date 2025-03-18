import React from "react";
import styles from "./doctor-appointment-details-popup.module.css";
import Popup from "../Popup";
import { useState } from "react"; 

const AppointmentDetailsPopup = ({onClose}) => {
  const [popupTrigger, setPopupTrigger] = useState(false);

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Appointment Details: John Doe (Appointment ID: 123456)</h2>
        </div>

        <h5 className={styles.subhead}>
          Detailed view for the appointment #123456.
        </h5>
        <hr />

        <p className={styles.newSubHeading}>
          <span className={styles.icons}>
            <i class="bx bx-plus-medical"></i>
          </span>
          <span className={styles.key}> Doctor/Technician: </span>
          <span className={styles.locationValue}>Dr. John Doe</span>
          <span className={styles.statusIcon}>
            <i className="bx bx-loader-alt"></i>
          </span>
          <span className={styles.key}>Status: </span>
          <span className={styles.statusValue}>Upcoming</span>
        </p>

        <p className={styles.newSubHeading}>
          <span className={styles.icons}>
            <i class="bx bx-calendar"></i>
          </span>
          <span className={styles.key}> Date & Time: </span>
          <span className={styles.locationValue}>10/10/2024 09:30 AM</span>
          <span className={styles.icons}>
            <i className="bx bx-map"></i>
          </span>
          <span className={styles.key}>Location: </span>
          <span className={styles.locationValue}>
            Lifeline Hospital, North Nazimabad
          </span>
        </p>

        <div className={styles.formSection}>
          <h3>Doctor/Technician Details</h3>
          <div className={styles.newFormGroup}>
            <div>
              <label>Speciality</label>
              <p className={styles.subHeading}>Dermatologist</p>
            </div>
            <div>
              <label>Visit Purpose</label>
              <p className={styles.subHeading}>Consultation</p>
            </div>
            <div>
              <label>Next Follow Up</label>
              <p className={styles.subHeading}>10/10/2024</p>
            </div>
            <div>
              <label>Paid Amount</label>
              <p className={styles.subHeading}>RS/- 4000</p>
            </div>
            <div>
              <label>Pending Amount</label>
              <p className={styles.subHeading}>RS/- 1000</p>
            </div>

            <div>
              <label>Total Amount</label>
              <p className={styles.subHeading}>RS/- 5000</p>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Attached Documents</h3>
          <div className={styles.documentFormGroup}>
            <div>
              <p className={styles.subHeading}>
                Upload and attach any test report in PDF or directly from the
                Test Results.
              </p>
            </div>

            <div>
              <button className={styles.uploadDocBtn}>Upload Document</button>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Comments/Reason</h3>
          <div className={styles.documentFormGroup}>
            <div>
              <p className={styles.subHeading}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
                provident commodi, sapiente, totam veritatis odio ad sequi eius
                quod inventore dicta saepe. Nisi, accusamus.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.newActions}>
          <button className={styles.confirmButton}>Download as PDF File</button>
        </div>
      </div>
    </Popup>
  );
};

export default AppointmentDetailsPopup;

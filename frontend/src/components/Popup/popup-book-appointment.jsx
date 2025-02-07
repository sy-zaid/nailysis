import React from "react";

const PopupBookAppointments = () => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2>Schedule Your Appointment</h2>
      </div>

      <h5 className={styles.subhead}>
        Choose your customized appointment timings and other details
      </h5>
      <hr />

      <p className={styles.subHeading}>
        <span className={styles.icons}>
          <i className="bx bx-loader-alt"></i>
        </span>
        <span className={styles.key}>Status: </span>
        <span className={styles.statusValue}>Upcoming</span>
        <span className={styles.icons}>
          <i className="bx bx-map"></i>
        </span>
        <span className={styles.key}>Location: </span>
        <span className={styles.locationValue}>
          Lifeline Hospital, North Nazimabad
        </span>
      </p>

      <div className={styles.formSection}>
        <h3>Patient Information</h3>
        <div className={styles.formGroup}>
          <div>
            <label>Name</label>
            <input type="text" placeholder="John Doe" />
          </div>
          <div>
            <label>Age</label>
            <input type="number" placeholder="21" />
          </div>
          <div>
            <label>Gender</label>
            <input type="text" placeholder="Male" />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="tel" placeholder="+92 12345678" />
          </div>
          <div>
            <label>Email Address</label>
            <input type="tel" placeholder="patient@gmail.com" />
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Appointment Details</h3>
        <div className={styles.formGroup}>
          <div>
            <label>Specification</label>
            <select>
              <option>Dermatologist</option>
            </select>
          </div>
          <div>
            <label>Doctor/Provider</label>
            <select>
              <option>Dr. Jane Doe</option>
            </select>
          </div>
          <div>
            <label>Date & Time (Available)</label>
            <input type="datetime-local" />
          </div>

          <div>
            <label>Visit Purpose</label>
            <select>
              <option>Consultation</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Payment Details</h3>
        <div className={styles.formGroup}>
          <div>
            <label>Discount Code</label>
            <select>
              <option>No Discount</option>
            </select>
          </div>
          <div>
            <label>Service Fee</label>
            <p className={styles.subHeading}>RS/- 5000</p>
          </div>
          <div>
            <label>Sales Tax</label>
            <p className={styles.subHeading}>RS/- 5.0</p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.cancelButton}
          onClick={() => setFirstPopup(false)}
        >
          Cancel
        </button>
        <button className={styles.confirmButton}>Continue to Next Step</button>
      </div>
    </div>
  );
};

export default PopupBookAppointments;
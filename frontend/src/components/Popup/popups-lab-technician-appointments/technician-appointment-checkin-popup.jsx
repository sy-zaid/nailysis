import React from "react";
import styles from "./technician-appointment-checkin-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import {
  calculateAge,
  handleClosePopup,
  convertDjangoDateTime,
} from "../../../utils/utils";
import { completeTechnicianAppointment } from "../../../api/appointmentsApi";
import { getStatusClass } from "../../../utils/utils";

const TechnicianAppointmentCheckinPopup = ({ onClose, appointmentDetails }) => {
  // State variables
  const [timer, setTimer] = useState(0); // Keeps track of elapsed time in seconds
  const [isConsultationStarted, setIsConsultationStarted] = useState(false); // Tracks whether consultation has started
  const [intervalId, setIntervalId] = useState(null); // Stores the timer's interval ID to control it
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [status, setStatus] = useState("Pending");
  // Function to format time in HH:MM:SS format
  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // ----- HANDLERS
  // Handles the completion of appointment
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await completeTechnicianAppointment(appointmentId);
      alert("Successfully marked as completed");
    } catch (error) {
      console.log(error);
    }
    handleClosePopup(onClose); // Closes popup as soon as completed
  };

  // Function to start the timer when consultation begins
  const startTimer = () => {
    setIsConsultationStarted(true);
    const id = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  // Function to stop the timer when consultation ends
  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };


  // useEffect to reset timer and state when popup opens
  useEffect(() => {
    if (popupTrigger) {
      setTimer(0); // Reset timer when popup opens
      setIsConsultationStarted(false); // Reset consultation status
      if (intervalId) {
        clearInterval(intervalId); // Clear any running timer
        setIntervalId(null); // Reset interval ID
      }
    }
  }, [popupTrigger]); // Runs when the popup state changes

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2>
              {isConsultationStarted
                ? "2. Complete Patient Check-In"
                : "1. Confirm Patient Checking-In"}
            </h2>
          </div>

          <div className={styles.subhead}>
            <h5>
              Please confirm if this is the correct patient visiting or choose
              another appointment.
            </h5>
            <div>
              <h2 style={{ marginRight: "45px" }}>
                Time: <span>{formatTime(timer)}</span>
              </h2>
            </div>
          </div>

          <hr />
        </div>

        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading}>
            <span className={styles.key}>
              {" "}
              <i className="fa-solid fa-circle-notch"></i> Status:{" "}
            </span>
            <span className={getStatusClass(status, styles)}>Pending</span>
            <span className={styles.key} style={{ margin: "0 0 0 50px" }}>
              {" "}
              <i className="fa-solid fa-location-dot"></i> Location:{" "}
            </span>
            <span className={styles.locationValue}>
              Chughtai Lab, North Nazimabad
            </span>
          </p>

          <div className={styles.formSection}>
            <br />
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Patient Information
            </h3>
            <div className={styles.newFormGroup}>
              <div>
                <label>First Name</label>
                <p className={styles.subHeading}>
                  {appointmentDetails.patient?.user?.first_name}
                </p>
              </div>
              <div>
                <label>Last Name</label>
                <p className={styles.subHeading}>
                  {appointmentDetails.patient?.user?.last_name}
                </p>
              </div>
              <div>
                <label>Age</label>
                <p className={styles.subHeading}>
                  {calculateAge(appointmentDetails.patient?.date_of_birth)}
                </p>
              </div>
              <div>
                <label>Gender</label>
                <p className={styles.subHeading}>
                  {appointmentDetails.patient?.gender}
                </p>
              </div>
              <div>
                <label>Phone Number</label>
                <p className={styles.subHeading}>
                  {appointmentDetails.patient?.user?.phone || "N/A"}
                </p>
              </div>

              <div>
                <label>Email Address</label>
                <p className={styles.subHeading}>
                  {appointmentDetails.patient?.user?.email}
                </p>
              </div>
            </div>
          </div>

          <hr />

          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Appointment Details
            </h3>
            <div className={styles.newFormGroup}>
              <div>
                <label>Specialization</label>
                <p className={styles.subHeading}>
                  {appointmentDetails.lab_technician?.specialization}{" "}
                </p>
              </div>
              <div>
                <label>Technician</label>
                <p className={styles.subHeading}>
                  Tech. {appointmentDetails.lab_technician?.user?.first_name}{" "}
                  {appointmentDetails.lab_technician?.user?.last_name}{" "}
                </p>
              </div>

              <div>
                <label>Date & Time</label>
                <p className={styles.subHeading}>
                  {convertDjangoDateTime(appointmentDetails?.checkin_datetime)}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.commentsFormSection}>
            <h3
              style={{ color: "#737070", marginLeft: "25px", fontSize: "16px" }}
            >
              Comments
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea className={styles.textAreaField} style={{ border: "none" }} disabled>
                  {appointmentDetails?.notes || "N/A"}
                </textarea>
              </div>
            </div>
          </div>

          <hr />

          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Requested Test Details
            </h3>
            <div style={{ marginLeft: "25px" }}>
              {appointmentDetails.test_orders[0]?.test_types.map(
                (test, index) => (
                  <div key={test.id} className={styles.testType}>
                    <span style={{ marginLeft: "25px" }}>{test.label}</span>
                    <span className={styles.testTypeBorder}></span>
                    <span style={{ marginRight: "45px" }}>
                      RS/- {test.price}
                    </span>
                  </div>
                )
              )}

              <hr
                style={{
                  marginTop: "25px",
                  width: "93.5%",
                  marginLeft: "25px",
                }}
              />

              <div className={styles.testType}>
                <span style={{ marginLeft: "25px", fontWeight: "bold" }}>
                  Subtotal
                </span>
                <span style={{ marginRight: "45px", fontWeight: "bold" }}>
                  RS/-{" "}
                  {appointmentDetails.test_orders[0]?.test_types.reduce(
                    (sum, test) => sum + parseFloat(test.price),
                    0
                  )}
                </span>
              </div>

              <hr
                style={{
                  marginTop: "15px",
                  width: "93.5%",
                  marginLeft: "25px",
                }}
              />
            </div>
          </div>

          <div className={styles.newActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setPopupTrigger(false)}
            >
              Cancel
            </button>
            {!isConsultationStarted ? (
              <button className={styles.addButton} onClick={startTimer}>
                Confirm Patient
              </button>
            ) : (
              <button
                className={styles.addButton}
                onClick={() => {
                  stopTimer();
                  handleCompleteAppointment(appointmentDetails.appointment_id);
                }}
              >
                Complete Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default TechnicianAppointmentCheckinPopup;

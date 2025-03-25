import React from "react";
import styles from "./select-test-order-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { convertDjangoDateTime } from "../../../utils/utils";

const PopupSelectTestOrder = ({ onClose, setInnerPopup, testOrderDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  // if (!selectreportTypePopup) return null;
  console.log("GOT THIS TO PROCESS", testOrderDetails);
  // Function to determine the CSS class based on status
  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return styles.consulted;
      case "Cancelled":
        return styles.cancelled;
      case "Scheduled":
        return styles.scheduled;
      case "Pending":
        return styles.scheduled;
      case "Urgent":
        return styles.cancelled;
      default:
        return {};
    }
  };

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2 style={{ marginBottom: "30px" }}>
              1.Process Test Order |{" "}
              <span>Order ID # {testOrderDetails.id}</span>
            </h2>
          </div>

          <div className={styles.subhead}>
            <h5 style={{ marginBottom: "5px" }}>
              Check patient details and requested tests before adding reports.
            </h5>
          </div>

          <hr />
        </div>

        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading}>
            <span className={styles.key}>
              {" "}
              <i className="fa-solid fa-circle-notch"></i> Status:{" "}
            </span>
            <span className={getStatusClass("Pending")}>Pending</span>
            <span className={styles.key} style={{ margin: "0 0 0 50px" }}>
              {" "}
              <i className="fa-solid fa-location-dot"></i> Location:{" "}
            </span>
            <span className={styles.locationValue}>
              Lifeline Hospital, North Nazimabad
            </span>
          </p>

          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Patient Information
            </h3>
            <div className={styles.newFormGroup}>
              <div>
                <label>Patient ID</label>
                <p className={styles.subHeading}>123456</p>
              </div>
              <div>
                <label>Patient Name</label>
                <p className={styles.subHeading}>Mr. John Doe</p>
              </div>
              <div>
                <label>Age</label>
                <p className={styles.subHeading}>32</p>
              </div>
              <div>
                <label>Gender</label>
                <p className={styles.subHeading}>Male</p>
              </div>
              <div>
                <label>Phone Number</label>
                <p className={styles.subHeading}>+92 12345678</p>
              </div>

              <div>
                <label>Email Address</label>
                <p className={styles.subHeading}>patient@gmail.com</p>
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
                <p className={styles.subHeading}>Technician</p>
              </div>
              <div>
                <label>Technician Name</label>
                <p className={styles.subHeading}>
                  Tech.{" "}
                  {testOrderDetails.lab_technician_appointment?.technician_name}
                </p>
              </div>

              <div>
                <label>Completed On</label>
                <p className={styles.subHeading}>
                  {convertDjangoDateTime(
                    testOrderDetails.lab_technician_appointment
                      ?.checkout_datetime
                  )}{" "}
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
                <textarea style={{ border: "none" }} disabled>
                  {testOrderDetails.lab_technician_appointment?.notes || "N/A"}
                </textarea>
              </div>
            </div>
          </div>
          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Requested Test Details
            </h3>
            <div style={{ marginLeft: "25px" }}>
              {testOrderDetails?.test_types?.map((test, index) => (
                <div key={test.id} className={styles.testType}>
                  <span style={{ marginLeft: "25px" }}>
                    {test.name} ({test.category})
                  </span>
                  <span className={styles.testTypeBorder}></span>
                  <button
                    className={styles.addButton}
                    style={{ marginRight: "45px" }}
                    onClick={() => {
                      onClose(); // Close this popup
                      setInnerPopup(true); // Open the next popup
                    }}
                  >
                    Add Record
                  </button>
                </div>
              ))}
            </div>
          </div>

          <br />
          <hr />

          <div className={styles.newActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setselectreportTypePopup(false)}
            >
              Cancel
            </button>
            <button className={styles.addButton}>
              Finalize & Submit to Admin
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupSelectTestOrder;

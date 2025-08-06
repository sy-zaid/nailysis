import React from "react";
import styles from "./select-test-order-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import {
  calculateAge,
  convertDjangoDateTime,
  getStatusClass,
} from "../../../utils/utils";
import {
  submitTestResults,
  getTestResults,
  finalizeTestOrder,
} from "../../../api/labsApi";
import { toast } from "react-toastify";
import BloodTestEntryPopup from "./blood-test-entry-popup";
import UrineTestEntryPopup from "./urine-test-entry-popup";

/**
 * PopupViewTestOrder Component
 *
 * This component renders a popup for viewing test orders.
 * It fetches test results, updates the UI accordingly, and provides
 * functionalities to finalize test orders and view test records.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the popup.
 * @param {Object} props.testOrderDetails - Details of the test order.
 */
const PopupViewTestOrder = ({ onClose, testOrderDetails }) => {
  // ----- POPUPS & NAVIGATION
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [completedTests, setCompletedTests] = useState([]);
  // console.log("TEST ORDER DETAILSSSS", testOrderDetails);

  // ----- IMPORTANT DATA

  // ----- HANDLERS
  /**
   * Handles viewing test records in a new tab.
   *
   * @param {string} action - Action type.
   * @param {string} id - Test record ID.
   */
  const handleActionClick = (action, id) => {
    if (action === "View Record") {
      const url = `/lab-test-result/${id}`;
      window.open(url, "_blank");
    }
  };

  /**
   * Handles finalizing and submitting test orders.
   * Sends a request to finalize the test order and handles response messages.
   */
  const handleFinalizeAndSubmit = async () => {
    try {
      const response = await finalizeTestOrder(testOrderDetails.id);
      if (response.status === 200) {
        toast.success("Test Order Finalized Successfully", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      // console.log(error);
      if (error.response) {
        const status = error.response;
        toast.error(status.data.error || "Failed to finalize test order", {
          className: "custom-toast",
        });
      } else {
        toast.error("Network error! Please try again.", {
          className: "custom-toast",
        });
      }
    }
  };

  // ----- MAIN LOGIC FUNCTIONS

  // ----- USE EFFECTS
  useEffect(() => {
    /**
     * Fetches test results for the given test order and updates state.
     */
    const fetchTestResults = async () => {
      try {
        const response = await getTestResults(testOrderDetails.id);
        // console.log("Fetched Test Results:", response.data);
        const tests = response.data;
        // console.log("Fetched Test Results:", tests);
        setCompletedTests(tests);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, [testOrderDetails?.id]);

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      {showPopup && popupContent}
      <div className={styles.formContainer}>
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2 style={{ marginBottom: "30px" }}>
              View & Confirm Test Order |{" "}
              <span>Order ID # {testOrderDetails.id}</span>
            </h2>
          </div>

          <div className={styles.subhead}>
            <h5 style={{ marginBottom: "5px" }}>
              Check patient details and requested tests before finalizing
              reports.
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
            <span className={getStatusClass(testOrderDetails.test_status,styles)}>
              {testOrderDetails.test_status}
            </span>
            <span className={styles.key} style={{ margin: "0 0 0 50px" }}>
              {" "}
              <i className="fa-solid fa-location-dot"></i> Location:{" "}
            </span>
            <span className={styles.locationValue}>
              Lifeline Hospital, North Nazimabad
            </span>
          </p>
          {/* Patient Information */}
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
                <p className={styles.subHeading}>
                  {
                    testOrderDetails.lab_technician_appointment?.patient.user
                      ?.user_id
                  }
                </p>
              </div>
              <div>
                <label>Patient Name</label>
                <p className={styles.subHeading}>
                  {
                    testOrderDetails.lab_technician_appointment?.patient.user
                      ?.first_name
                  }{" "}
                  {
                    testOrderDetails.lab_technician_appointment?.patient.user
                      ?.last_name
                  }
                </p>
              </div>
              <div>
                <label>Age</label>
                <p className={styles.subHeading}>
                  {calculateAge(
                    testOrderDetails.lab_technician_appointment?.patient
                      .date_of_birth
                  )}
                </p>
              </div>
              <div>
                <label>Gender</label>
                <p className={styles.subHeading}>
                  {testOrderDetails.lab_technician_appointment?.patient?.gender}
                </p>
              </div>
              <div>
                <label>Phone Number</label>
                <p className={styles.subHeading}>
                  {testOrderDetails.lab_technician_appointment?.patient?.user
                    ?.phone || "N/A"}
                </p>
              </div>

              <div>
                <label>Email Address</label>
                <p className={styles.subHeading}>
                  {
                    testOrderDetails.lab_technician_appointment?.patient?.user
                      ?.email
                  }
                </p>
              </div>
            </div>
          </div>
          <hr />
          {/* Appointment Details */}
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
                  {testOrderDetails.lab_technician_appointment
                    ?.technician_specialization || "Technician"}
                </p>
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
          {/* Requested Test Details */}
          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Requested Test Details
            </h3>
            <div style={{ marginLeft: "25px" }}>
              {testOrderDetails.test_types.map((test) => {
                const testResult = completedTests.find(
                  (t) => t.test_type === test.id
                );
                // console.log(testResult, "TEST RESULTSSSSSS");
                return (
                  <div key={test.id} className={styles.testType}>
                    <span style={{ marginLeft: "25px" }}>
                      {test.name} ({test.category})
                    </span>
                    <span className={styles.testTypeBorder}></span>
                    <span
                      className={getStatusClass(
                        testResult?.result_status || "Pending",styles
                      )}
                    >
                      {testResult?.result_status || "Pending"}
                    </span>
                    <button
                      className={styles.addButton}
                      onClick={() =>
                        handleActionClick("View Record", testResult?.id)
                      }
                    >
                      View Record
                    </button>
                  </div>
                );
              })}
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
            {testOrderDetails.test_status !== "Completed" && (
              <button
                className={styles.addButton}
                onClick={() => handleFinalizeAndSubmit()}
              >
                Finalize & Upload Results
              </button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupViewTestOrder;

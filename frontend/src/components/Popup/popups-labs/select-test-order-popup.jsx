import React from "react";
import styles from "./select-test-order-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { calculateAge, convertDjangoDateTime } from "../../../utils/utils";
import BloodTestEntryPopup from "./blood-test-entry-popup";
import UrineTestEntryPopup from "./urine-test-entry-popup";
import { submitTestResults, getTestResults } from "../../../api/labsApi";
import { toast } from "react-toastify";

/**
 * PopupSelectTestOrder Component
 *
 * This component renders a popup for selecting and managing test orders.
 * It fetches test results, updates the UI accordingly, and provides
 * functionalities to submit finalized test reports.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the popup.
 * @param {Object} props.testOrderDetails - Details of the test order.
 */

const PopupSelectTestOrder = ({ onClose, testOrderDetails }) => {
  // ----- POPUPS & NAVIGATION
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [popupContent, setPopupContent] = useState(null);
  const [showInnerPopup, setShowInnerPopup] = useState(false);
  const [completedTests, setCompletedTests] = useState([]);

  // ----- IMPORTANT DATA
  const test_categories = {
    "Blood Test": (testDetails, testOrderDetails, editable) => (
      <BloodTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
        editable={editable}
      ></BloodTestEntryPopup>
    ),

    "Urine Test": (testDetails, testOrderDetails, editable) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
        editable={editable}
      />
    ),
    "Imaging Test": (testDetails, testOrderDetails, editable) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
        editable={editable}
      />
    ),
    "Pathology Report": (testDetails, testOrderDetails, editable) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
        editable={editable}
      />
    ),
  };

  // ----- HANDLERS
  /**
   * Handles finalizing and submitting test reports.
   * Sends a request to submit test results and handles response messages.
   */
  const handleFinalizeAndSubmit = async () => {
    const payload = { test_order_id: testOrderDetails.id };

    try {
      const response = await submitTestResults(payload);
      if (response.status === 200) {
        toast.success(" All test reports submitted to admin!", {
          className: "custom-toast",
        });
      }
    } catch (error) {
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
  /**
   * Retrieves the test status based on test type ID.
   *
   * @param {string} testTypeId - The test type identifier.
   * @param {Array} testResults - List of test results.
   * @returns {string} - The status of the test.
   */
  const getTestStatus = (testTypeId, testResults) => {
    const test = testResults.find((t) => t.id === testTypeId);
    return test ? test.result_status || "" : "Empty Results"; // Default to "Pending" if not found
  };

  console.log("GOT THIS TO PROCESS", testOrderDetails);

  /**
   * Determines the CSS class based on test status.
   *
   * @param {string} status - The test status.
   * @returns {Object} - The corresponding CSS class.
   */
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

  /**
   * Sets and displays the inner popup based on test category.
   *
   * @param {Object} testDetails - Details of the selected test.
   * @param {Array} editable - Array of the editable being true allowing the post request to be edit along with a status.
   */
  const setInnerPopup = (testDetails, editable) => {
    setPopupContent(
      test_categories[testDetails.category](
        testDetails,
        testOrderDetails,
        editable
      )
    );
    setShowInnerPopup(true);
  };

  // ----- USE EFFECTS
  useEffect(() => {
    /**
     * Fetches test results for the given test order and updates state.
     */
    const fetchTestResults = async () => {
      try {
        const response = await getTestResults(testOrderDetails.id);
        console.log("Fetched Test Results:", response.data);
        const tests = response.data.map((test) => ({
          id: test.test_type,
          result_status: test.result_status,
        }));
        console.log("Fetched Test Results:", tests);
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
      {showInnerPopup && popupContent}
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
            <span className={getStatusClass(testOrderDetails.test_status)}>
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
              {testOrderDetails?.test_types?.map((test, index) => {
                const testStatus = getTestStatus(test.id, completedTests);

                return (
                  <div key={test.id} className={styles.testType}>
                    <span style={{ marginLeft: "25px" }}>
                      {test.name} ({test.category})
                    </span>
                    <span className={styles.testTypeBorder}></span>

                    {testStatus === "Review Required" ||
                    testStatus === "Pending" ? (
                      <>
                        <p style={{ color: "green", fontWeight: "bold" }}>
                          {testStatus}
                        </p>
                        <button
                          className={styles.addButton}
                          onClick={() =>
                            setInnerPopup(test, [true, testStatus])
                          }
                        >
                          Edit Record
                        </button>
                      </>
                    ) : testStatus === "Finalized" ? (
                      <>
                        <p style={{ color: "orange", fontWeight: "bold" }}>
                          {testStatus}
                        </p>
                        <button
                          className={styles.addButton}
                          style={{ marginRight: "45px" }}
                          onClick={() =>
                            setInnerPopup(test, [true, testStatus])
                          }
                        >
                          View Record
                        </button>
                      </>
                    ) : (
                      <>
                        <p style={{ color: "red", fontWeight: "bold" }}>
                          Empty Results
                        </p>
                        <button
                          className={styles.addButton}
                          style={{ marginRight: "45px" }}
                          onClick={() =>
                            setInnerPopup(test, [true, testStatus])
                          }
                        >
                          Add Record
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          ;
          <br />
          <hr />
          <div className={styles.newActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setselectreportTypePopup(false)}
            >
              Cancel
            </button>
            <button
              className={styles.addButton}
              onClick={() => handleFinalizeAndSubmit()}
            >
              Finalize & Submit to Admin
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupSelectTestOrder;

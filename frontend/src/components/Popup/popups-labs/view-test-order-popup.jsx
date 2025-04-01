import React from "react";
import styles from "./select-test-order-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { calculateAge, convertDjangoDateTime } from "../../../utils/utils";
import {
  submitTestResults,
  getTestResults,
  finalizeTestOrder,
} from "../../../api/labsApi";
import { toast } from "react-toastify";
import BloodTestEntryPopup from "./blood-test-entry-popup";
import UrineTestEntryPopup from "./urine-test-entry-popup";

const PopupViewTestOrder = ({ onClose, testOrderDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [completedTests, setCompletedTests] = useState([]);
  console.log("TEST ORDER DETAILSSSS", testOrderDetails);
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await getTestResults(testOrderDetails.id);
        console.log("Fetched Test Results:", response.data);
        const tests = response.data;
        console.log("Fetched Test Results:", tests);
        setCompletedTests(tests);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, [testOrderDetails?.id]);

  const getTestStatus = (testTypeId, testResults) => {
    const test = testResults.find((t) => t.id === testTypeId); // Ensure test.id matches correctly
    return test ? test.result_status || "Completed" : "Pending"; // Default to "Pending" if not found
  };

  //   Object for storing different popups components for navigating according to the requested test types.
  const test_categories = {
    "Blood Test": (testDetails, testOrderDetails) => (
      <BloodTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowPopup(false)}
      ></BloodTestEntryPopup>
    ),

    "Urine Test": (testDetails, testOrderDetails) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowPopup(false)}
      />
    ),
    "Imaging Test": (testDetails, testOrderDetails) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowPopup(false)}
      />
    ),
    "Pathology Report": (testDetails, testOrderDetails) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowPopup(false)}
      />
    ),
  };

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
  const handleActionClick = (action, id) => {
    if (action === "View Record") {
      const url = `/lab-test-result/${id}`;
      window.open(url, "_blank"); // Open in a new tab
    }
  };

  const handleFinalizeAndSubmit = async () => {
    const payload = { test_order_id: testOrderDetails.id };

    try {
      const response = await finalizeTestOrder(payload);

      if (response.status === 200) {
        toast.success("Test Order Finalized Successfully", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      console.log(error);
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
              {testOrderDetails.test_types.map((test) => {
                const testResult = completedTests.find(
                  (t) => t.test_type === test.id
                );
                console.log(testResult, "TEST RESULTSSSSSS");
                return (
                  <div key={test.id} className={styles.testType}>
                    <span style={{ marginLeft: "25px" }}>
                      {test.name} ({test.category})
                    </span>
                    <span className={styles.testTypeBorder}></span>
                    <span
                      className={getStatusClass(
                        testResult?.result_status || "Pending"
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
            <button
              className={styles.addButton}
              onClick={() => handleFinalizeAndSubmit()}
            >
              Finalize & Upload Results
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupViewTestOrder;

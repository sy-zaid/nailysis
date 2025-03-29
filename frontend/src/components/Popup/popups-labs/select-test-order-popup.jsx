import React from "react";
import styles from "./select-test-order-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { convertDjangoDateTime } from "../../../utils/utils";
import BloodTestEntryPopup from "./blood-test-entry-popup";
import UrineTestEntryPopup from "./urine-test-entry-popup";
import { finalizeTestOrder, getTestResults } from "../../../api/labsApi";
import { toast } from "react-toastify";

const PopupSelectTestOrder = ({ onClose, testOrderDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [popupContent, setPopupContent] = useState(null);
  const [showInnerPopup, setShowInnerPopup] = useState(false);
  const [completedTests, setCompletedTests] = useState([]);

  useEffect(() => {
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

  const checkExistingResults = (testTypeId, testResults) => {
    return testResults.some((test) => test.id === testTypeId);
  };

  const test_categories = {
    "Blood Test": (testDetails, testOrderDetails) => (
      <BloodTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
      ></BloodTestEntryPopup>
    ),

    "Urine Test": (testDetails, testOrderDetails) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
      />
    ),
    "Imaging Test": (testDetails, testOrderDetails) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
      />
    ),
    "Pathology Report": (testDetails, testOrderDetails) => (
      <UrineTestEntryPopup
        testDetails={testDetails}
        testOrderDetails={testOrderDetails}
        onClose={() => setShowInnerPopup(false)}
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

  const setInnerPopup = (testDetails) => {
    setPopupContent(
      test_categories[testDetails.category](testDetails, testOrderDetails)
    );
    setShowInnerPopup(true);
  };

  const handleFinalizeAndSubmit = async () => {
    const payload = { test_order_id: testOrderDetails.id };

    try {
      const response = await finalizeTestOrder(payload);

      if (response.status === 200) {
        toast.success(" All test reports submitted to admin!", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;

        if (status === 403) {
          toast.error("Not authorized to submit test reports", {
            className: "custom-toast",
          });
        } else if (
          status === 400 &&
          data.message === "Some test results are missing!"
        ) {
          toast.error("Some test results are missing!", {
            className: "custom-toast",
          });
        } else {
          toast.error(`Error: ${data.message || "Something went wrong!"}`, {
            className: "custom-toast",
          });
        }
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
                  {checkExistingResults(test.id, completedTests) ? (
                    <>
                      <p>Completed</p>
                      <button className={styles.addButton}>Edit Record</button>
                    </>
                  ) : (
                    <button
                      className={styles.addButton}
                      style={{ marginRight: "45px" }}
                      onClick={() => setInnerPopup(test)}
                    >
                      Add Record
                    </button>
                  )}
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

import React from "react";
import styles from "./all-reports-list-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
// import { getPatientTests } from "../../../api/labsApi";
import { toast } from "react-toastify";
import { calculateAge, convertDjangoDateTime } from "../../../utils/utils";

/**
 * PopupAllReportsList Component
 *
 * This component renders a popup showing all available tests for a patient
 * with the ability to view individual test reports.
 *
 * @param {Object} props - Component props
 * @param {string} props.patient_id - ID of the patient
 * @param {Function} props.onClose - Function to close the popup
 */
const PopupAllReportsList = ({ patient_id, onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [patientTests, setPatientTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patient tests and details on component mount
  useEffect(() => {
    const fetchPatientTests = async () => {
      try {
        setLoading(true);
        const response = await getPatientTests(patient_id);
        setPatientData(response.data.patient);
        setPatientTests(response.data.tests);
      } catch (error) {
        console.error("Error fetching patient tests:", error);
        toast.error("Failed to load patient test data", {
          className: "custom-toast",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientTests();
  }, [patient_id]);

  /**
   * Handles opening a test report in a new tab
   * @param {string} testId - ID of the test to view
   */
  const handleViewReport = (testId) => {
    const url = `/lab-test-result/${testId}`;
    window.open(url, "_blank");
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
            <h2>Patient Test Reports</h2>
          </div>

          <div className={styles.subhead}>
            <h5>View all available test reports for this patient</h5>
          </div>

          <hr />
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Loading patient data...</p>
          </div>
        ) : (
          <div className={styles.popupBottom}>
            {/* Patient Information Section */}
            <div className={styles.formSection}>
              <h3>
                <i
                  className="fa-solid fa-circle fa-2xs"
                  style={{ color: "#007bff", marginRight: "10px" }}
                ></i>
                Patient Details
              </h3>
              <div className={styles.newFormGroup}>
                <div>
                  <label>Patient ID</label>
                  <p className={styles.subHeading}>
                    {patientData?.user?.user_id || "N/A"}
                  </p>
                </div>
                <div>
                  <label>Patient Name</label>
                  <p className={styles.subHeading}>
                    {patientData?.user?.first_name || ""}{" "}
                    {patientData?.user?.last_name || ""}
                  </p>
                </div>
                <div>
                  <label>Age</label>
                  <p className={styles.subHeading}>
                    {calculateAge(patientData?.date_of_birth)}
                  </p>
                </div>
                <div>
                  <label>Gender</label>
                  <p className={styles.subHeading}>
                    {patientData?.gender || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <hr />

            {/* Test Reports Section */}
            <div className={styles.formSection}>
              <h3>
                <i
                  className="fa-solid fa-circle fa-2xs"
                  style={{ color: "#007bff", marginRight: "10px" }}
                ></i>
                Available Test Reports
              </h3>

              {patientTests.length === 0 ? (
                <p className={styles.noTestsMessage}>
                  No test reports available for this patient.
                </p>
              ) : (
                <div className={styles.testListContainer}>
                  {patientTests.map((test) => (
                    <div key={test.id} className={styles.testItem}>
                      <div className={styles.testInfo}>
                        <span className={styles.testName}>
                          {test.test_type.name} ({test.test_type.category})
                        </span>
                        <span className={styles.testDate}>
                          {convertDjangoDateTime(test.created_at)}
                        </span>
                        <span
                          className={`${styles.testStatus} ${
                            styles[test.result_status.toLowerCase()]
                          }`}
                        >
                          {test.result_status}
                        </span>
                      </div>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewReport(test.id)}
                        disabled={test.result_status === "Pending"}
                      >
                        View Report
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button className={styles.closeButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default PopupAllReportsList;

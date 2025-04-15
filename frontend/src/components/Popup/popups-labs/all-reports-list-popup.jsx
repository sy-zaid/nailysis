import React from "react";
import styles from "./all-reports-list-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { calculateAge, convertDjangoDateTime } from "../../../utils/utils";
import { getTestResultsByPatientId } from "../../../api/labsApi";
import { getAvailableLabTests } from "../../../api/labsApi";

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
  const [availableLabTests, setAvailableLabTests] = useState([]);

  // Fetch available tests on component mount
  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        const response = await getAvailableLabTests();
        setAvailableLabTests(response.data); // Store the original data, no need to transform here
      } catch (error) {
        console.error("Error fetching lab tests:", error);
      }
    };

    fetchLabTests();
  }, []);
  console.log("AVT",availableLabTests)

  // Fetch patient tests and details on component mount
  useEffect(() => {
    const fetchPatientTests = async () => {
      try {
        setLoading(true);
        const response = await getTestResultsByPatientId(patient_id);
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
   * Get test name and category from availableLabTests based on test type ID
   * @param {number} testTypeId - ID of the test type
   * @returns {Object} - Object containing name and category of the test
   */
  const getTestInfo = (testTypeId) => {
    const test = availableLabTests.find((t) => t.id === testTypeId);
    if (!test) return { name: "Unknown Test", category: "Unknown" };
    
    // Extract name from label (assuming format "Test Name | Price")
    const name = test.label.split("|")[0].trim();
    // For category, we can either add it to the availableLabTests data or derive it
    // For now, I'll set a default category since it's not in your sample data
    return { name, category: "Laboratory" }; // You may need to adjust this based on actual data
  };

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
                  {patientTests.map((test) => {
                    const testInfo = getTestInfo(test.test_type);
                    return (
                      <div key={test.id} className={styles.testItem}>
                        <div className={styles.testInfo}>
                          <span className={styles.testName}>
                            {testInfo.name} ({testInfo.category})
                          </span>
                          <span className={styles.testDate}>
                            {convertDjangoDateTime(test.reviewed_at)}
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
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default PopupAllReportsList;
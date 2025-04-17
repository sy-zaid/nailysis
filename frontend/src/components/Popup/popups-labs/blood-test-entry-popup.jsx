import React, { useEffect } from "react";
import styles from "../../CSS Files/LabTechnician.module.css";
import Popup from "../Popup";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  formatBloodTestEntries,
  bloodTestParameters,
  convertDjangoDateTime,
  handleParameterChange,
  handleResultChange,
  handleAddParameter,
  handleRemoveParameter,
  handleInputChange,
  getStatusClass,
} from "../../../utils/utils";
import useCurrentUserData from "../../../useCurrentUserData";
import { saveTestResults } from "../../../api/labsApi";

const BloodTestEntryPopup = ({
  onClose,
  testDetails,
  testOrderDetails,
  editable,
}) => {
  console.log("GOT THIS TEST TO WORK", testDetails, testOrderDetails);
  console.log(editable);
  // ----- POPUPS & NAVIGATION
  const [popupTrigger, setPopupTrigger] = useState(true);

  // ----- IMPORTANT DATA
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  console.log(curUser[0]);
  const [isChecked, setIsChecked] = useState(false);

  const [testEntries, setTestEntries] = useState([
    { parameter: "Hemoglobin", result: "" },
    { parameter: "WBC", result: "" },
    { parameter: "Platelets", result: "" },
  ]);

  // Test Result form state
  const [formData, setFormData] = useState({
    test_entries: [],
    comments: "",
  });

  // ----- HANDLERS
  const onInputChange = handleInputChange(setFormData);

  /**
   * Handles saving the test results when the form is submitted.
   *
   * Sends a request to save the test results and handles response messages.
   */
  const handleSaveResults = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      toast.warning(
        "Please confirm that the results are accurate and complete before submitting.",
        {
          className: "custom-toast",
        }
      );
      return;
    }

    if (testEntries.some((entry) => !entry.result || entry.result.trim() === "")) {
      toast.warning("Please fill in all test result fields.", {
        className: "custom-toast",
      });
      return;
    }
  
    const incompleteEntry = testEntries.some(
      (entry) => !entry.result || entry.result.trim() === ""
    );
  
    if (incompleteEntry) {
      toast.warning("Please fill in all test result fields.", {
        className: "custom-toast",
      });
      return;
    }

    const payload = {
      test_order_id: testOrderDetails.id,
      test_type_id: testDetails.id,
      technician_id: curUser[0]?.user_id,
      test_entries: formData.test_entries,
      comments: formData.comments,
    };
    console.clear();
    try {
      console.log("SENDING THIS TO SAVE RESULTS", payload);
      const response = await saveTestResults(payload);
      
      if (response.status === 201) {
        toast.success("Successfully Created Test Result", {
          className: "custom-toast",
        });
        onClose();
      } else if (response.status === 200) {
        toast.success("Successfully Edited Test Result", {
          className: "custom-toast",
        });
        onClose();
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        toast.error(error.response.data.error || "Something went wrong.", {
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
  /**
   * Synchronizes the testEntries state with formData when testEntries changes.
   */
  useEffect(() => {
    if (testEntries && Array.isArray(testEntries)) {
      setFormData((prev) => ({
        ...prev,
        test_entries: formatBloodTestEntries({
          testEntries,
          bloodTestParameters: bloodTestParameters,
        }),
      }));
    }
  }, [testEntries]); // This will update formData when testEntries changes

  /**
   * Logs the formatted test entries whenever the testEntries or bloodTestParameters change.
   */
  useEffect(() => {
    if (!testEntries || !Array.isArray(testEntries)) return; // Prevent errors
    console.log(
      "TEST ENTRIES FORMATTING:",
      formatBloodTestEntries({ testEntries, bloodTestParameters })
    );
  }, [testEntries, bloodTestParameters]);

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2>Enter Test Details For Patient </h2>
          </div>

          <div className={styles.subhead}>
            <h5 style={{ margin: "10px 0" }}>
              Manage and generate lab test reports with ease. Technicians can
              edit reports until finalized, ensuring accuracy before they become
              downloadable PDFs for patients and doctors.
            </h5>
          </div>
          <hr />
        </div>

        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading}>
            <span className={styles.key}>Patient Name: </span>
            <span className={styles.locationValue}>
              {
                testOrderDetails?.lab_technician_appointment?.patient.user
                  .first_name
              }{" "}
              {
                testOrderDetails?.lab_technician_appointment?.patient.user
                  .last_name
              }
            </span>
            <span className={styles.secKey}> Status: </span>
            <span className={getStatusClass("Pending", styles)}>
              {editable[0] === true ? editable[1] : "Pending"}
            </span>
          </p>

          <p className={styles.newSubHeading}>
            <span className={styles.key}>Appointment Date & Time: </span>
            <span className={styles.locationValue}>
              {convertDjangoDateTime(testOrderDetails?.created_at)}
            </span>
          </p>

          <hr style={{ margin: "20px 0 0 0" }} />

          <div className={styles.formSection} style={{ margin: "-20px 0 0 0" }}>
            <br />
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Test Details
            </h3>
            <div className={styles.newFormGroup}>
              {/* <div>
                <label>Report ID</label>
                <p className={styles.subHeading}>123456</p>
              </div> */}

              <div>
                <label>Technician</label>
                <p className={styles.subHeading}>
                  Tech.{" "}
                  {
                    testOrderDetails?.lab_technician_appointment
                      ?.technician_name
                  }
                </p>
              </div>

              <div>
                <label>Test Name</label>
                <p className={styles.subHeading}>{testDetails?.label}</p>
              </div>

              <div>
                <label>Test Category</label>
                <p className={styles.subHeading}>{testDetails?.category}</p>
              </div>

              <div>
                <label>Date & Time of Test</label>
                <p className={styles.subHeading}>
                  {convertDjangoDateTime(
                    testOrderDetails?.lab_technician_appointment
                      ?.checkout_datetime
                  )}
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
              Test Result Entry
            </h3>
            {/* // Inside component: */}
            {testEntries.map((entry, index) => (
              <div key={index} className={styles.testParamFormGroup}>
                <div>
                  <label>Parameter Name</label>
                  <select
                    className={styles.patientSelect}
                    value={entry.parameter}
                    onChange={(e) =>
                      handleParameterChange(
                        setTestEntries,
                        index,
                        e.target.value
                      )
                    }
                  >
                    {Object.keys(bloodTestParameters).map((param) => (
                      <option key={param} value={param}>
                        {param}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Normal Range</label>
                  <p>{bloodTestParameters[entry.parameter].normalRange}/</p>
                </div>

                <div>
                  <label>Results</label>
                  <input
                    type="text"
                    placeholder="Enter result"
                    required
                    value={entry.result}
                    onChange={(e) =>
                      handleResultChange(setTestEntries, index, e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Units</label>
                  <p>{bloodTestParameters[entry.parameter].unit}</p>
                </div>

                {/* Remove Button */}
                <div>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleRemoveParameter(setTestEntries, index)}
                    style={{ marginTop: "20px" }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <button
                className={styles.addButton}
                onClick={() => handleAddParameter(setTestEntries, "Blood")}
                style={{ zIndex: "100" }}
              >
                <i className="bx bx-plus-circle"></i> Add More Parameters
              </button>
            </div>
            <hr
              style={{
                borderColor: "#007bff",
                marginTop: "-18px",
                zIndex: "50",
              }}
            />
          </div>

          <hr style={{ marginTop: "50px" }} />

          <div className={styles.commentsFormSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Comments/Observations
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea
                  style={{ borderBottom: "2px solid #0067FF" }}
                  placeholder="Enter your comments for this test report"
                  name="comments"
                  value={formData.comments}
                  onChange={onInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Verification
            </h3>
            <div
              className={styles.documentFormGroup}
              style={{ marginRight: "65px" }}
            >
              <div>
                <p style={{ color: "#737070", fontWeight: "600" }}>Consent</p>
                <p style={{ fontStyle: "italic", fontSize: "14px" }}>
                  Tech.{" "}
                  {
                    testOrderDetails?.lab_technician_appointment
                      ?.technician_name
                  }
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#737070",
                    fontSize: "14px",
                  }}
                >
                  {"Specialization: "}
                  {curUser[0].lab_technician?.specialization}
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#737070",
                    fontSize: "14px",
                  }}
                >
                  {"License Number: "}
                  {curUser[0].lab_technician?.license_number}
                </p>
              </div>
              <div>
                <p style={{ color: "#737070", fontWeight: "600" }}>
                  Date of Test Submission
                </p>
                <p style={{ fontStyle: "italic", fontSize: "14px" }}>
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className={styles.verificationConfirmation}>
              <p>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(event) => setIsChecked(event.target.checked)}
                />{" "}
                <span>
                  I confirm that the results entered are accurate and complete
                  to the best of my knowledge.
                </span>{" "}
              </p>
            </div>

            <br />
            <br />

            <p className={styles.computerReportMessage}>
              This is a computer generated report and does not require any
              signatures.
            </p>
            <hr />

            <br />
          </div>

          <div className={styles.newActions}>
            <button className={styles.addButton}>
              <i className="fa-regular fa-file-pdf"></i> Download PDF
            </button>
            <button className={styles.addButton} onClick={handleSaveResults}>
              <i className="fa-regular fa-floppy-disk"></i> Save Results
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default BloodTestEntryPopup;

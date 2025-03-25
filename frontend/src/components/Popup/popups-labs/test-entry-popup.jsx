import React from "react";
import styles from "../../CSS Files/LabTechnician.module.css";
import Popup from "../Popup";
import { useState } from "react";

const TestEntryPopup = ({ onClose }) => {
  // if (!testDetailsPopup) return null
  const [popupTrigger, setPopupTrigger] = useState(true);
  const testParameters = {
    Hemoglobin: {
      normalRange: "13.5 - 17.5",
      unit: "g/dL",
    },
    WBC: {
      normalRange: "4,500 - 11,000",
      unit: "cells/mcL",
    },
    Platelets: {
      normalRange: "150,000 - 450,000",
      unit: "platelets/mcL",
    },
  };

  const [testEntries, setTestEntries] = useState([
    { parameter: "Hemoglobin", result: "" },
    { parameter: "WBC", result: "" },
    { parameter: "Platelets", result: "" },
    { parameter: "Hemoglobin", result: "" },
  ]);

  // Changes the test type (e.g., Hemoglobin, WBC) for a specific test entry when the user selects a different option.
  const handleParameterChange = (index, newParameter) => {
    setTestEntries((prevEntries) =>
      prevEntries.map((entry, i) =>
        i === index ? { ...entry, parameter: newParameter } : entry
      )
    );
  };

  // Updates the test result for a specific entry when the user types a new value.
  const handleResultChange = (index, newResult) => {
    setTestEntries((prevEntries) =>
      prevEntries.map((entry, i) =>
        i === index ? { ...entry, result: newResult } : entry
      )
    );
  };

  //  Adds a new test entry with "Hemoglobin" as the default test type.
  const handleAddParameter = () => {
    setTestEntries((prevEntries) => [
      ...prevEntries,
      { parameter: "Hemoglobin", result: "" }, // Default new parameter
    ]);
  };

  // Deletes a test entry unless there is only one left, ensuring at least one remains.
  const handleRemoveParameter = (index) => {
    setTestEntries((prevEntries) =>
      prevEntries.length > 1
        ? prevEntries.filter((_, i) => i !== index)
        : prevEntries
    );
  };

  // Returns the correct CSS styling based on the test status
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
            <h2>
              Enter Test Details For Patient: John Doe (Patient ID: 12345)
            </h2>
          </div>

          <div className={styles.subhead}>
            <h5 style={{ margin: "10px 0" }}>
              Enter the patient's test details to proceed with documentation and
              results.
            </h5>
          </div>
          <hr />
        </div>

        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading}>
            <span className={styles.key}> Viewed By: </span>
            <span className={styles.locationValue}>Tech. Jane Doe</span>
            <span className={styles.secKey}> Status: </span>
            <span className={getStatusClass("Pending")}>In-Progress</span>
          </p>

          <p className={styles.newSubHeading}>
            <span className={styles.key}> Issuance Date & Time: </span>
            <span className={styles.locationValue}>10/10/2024 09:30 AM</span>
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
              <div>
                <label>Report ID</label>
                <p className={styles.subHeading}>123456</p>
              </div>

              <div>
                <label>Technician</label>
                <p className={styles.subHeading}>John Doe</p>
              </div>

              <div>
                <label>Blood Type</label>
                <p className={styles.subHeading}>Blood Test</p>
              </div>

              <div>
                <label>Sample Type</label>
                <select className={styles.patientSelect}>
                  <option>Blood</option>
                </select>
              </div>

              <div>
                <label>Date & Time of Test</label>
                <p className={styles.subHeading}>12/9/2024 05:30 PM</p>
              </div>

              <div>
                <label>Status</label>
                <select
                  className={`${styles.patientSelect} ${getStatusClass(
                    "Completed"
                  )}`}
                >
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label>Test Fee</label>
                <p className={styles.subHeading}>RS/- 5000</p>
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

            {testEntries.map((entry, index) => (
              <div key={index} className={styles.testParamFormGroup}>
                <div>
                  <label>Parameter Name</label>
                  <select
                    className={styles.patientSelect}
                    value={entry.parameter}
                    onChange={(e) =>
                      handleParameterChange(index, e.target.value)
                    }
                  >
                    {Object.keys(testParameters).map((param) => (
                      <option key={param} value={param}>
                        {param}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Normal Range</label>
                  <select>
                    <option>
                      {testParameters[entry.parameter].normalRange}
                    </option>
                  </select>
                </div>

                <div>
                  <label>Results</label>
                  <input
                    type="text"
                    placeholder="Enter result"
                    value={entry.result}
                    onChange={(e) => handleResultChange(index, e.target.value)}
                  />
                </div>

                <div>
                  <label>Units</label>
                  <select>
                    <option>{testParameters[entry.parameter].unit}</option>
                  </select>
                </div>

                {/* Remove Button */}
                <div>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleRemoveParameter(index)}
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
                onClick={handleAddParameter}
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
                  defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit"
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
                  Tech. Naeem Iqbal
                </p>
                <p
                  style={{
                    fontStyle: "italic",
                    color: "#737070",
                    fontSize: "14px",
                  }}
                >
                  MBBS, FCPS
                </p>
              </div>
              <div>
                <p style={{ color: "#737070", fontWeight: "600" }}>
                  Date of Verification
                </p>
                <p style={{ fontStyle: "italic", fontSize: "14px" }}>
                  12/09/2024
                </p>
              </div>
            </div>

            <div className={styles.verificationConfirmation}>
              <p>
                <input type="checkbox" />{" "}
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
            <button className={styles.addButton}>
              <i className="fa-regular fa-floppy-disk"></i> Save Results
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default TestEntryPopup;

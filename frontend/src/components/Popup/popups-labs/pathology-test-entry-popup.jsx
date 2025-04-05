import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../CSS Files/LabTechnician.module.css"; 
import Popup from "../Popup";
import { toast } from "react-toastify";
import {
  convertDjangoDateTime,
  getStatusClass,
  handleAddParameter,
  handleRemoveParameter,
  handleResultChange,
} from "../../../utils/utils";
import useCurrentUserData from "../../../useCurrentUserData";

const PathologyTestEntryPopup = ({
  onClose,
  testDetails,
  testOrderDetails,
  editable,
}) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  // Pathology test state
  const [numericResults, setNumericResults] = useState({});
  const [booleanResults, setBooleanResults] = useState({});
  const [comments, setComments] = useState("");
  const [resultFile, setResultFile] = useState(null);

  const PARAMETER_LIBRARY = {
    quantitative: {
      WBC: { unit: "cells/mcL", normalRange: "4,500 - 11,000" },
      Hemoglobin: { unit: "g/dL", normalRange: "13.5 - 17.5" },
      Glucose: { unit: "mg/dL", normalRange: "70-99" },
    },
    qualitative: {
      MalariaTest: {
        options: ["Positive", "Negative"],
        interpretation: {
          Positive: "Malaria parasites detected",
          Negative: "No parasites observed",
        },
      },
      HIV: {
        options: ["Reactive", "Non-Reactive", "Indeterminate"],
      },
      HepatitisBSurfaceAg: {
        options: ["Positive", "Negative"],
      },
    },
  };
  const handleAddQualitativeParam = () => {
    setQualitativeEntries([
      ...qualitativeEntries,
      {
        parameter: Object.keys(PARAMETER_LIBRARY.qualitative)[0],
        result: "",
        ...PARAMETER_LIBRARY.qualitative[
          Object.keys(PARAMETER_LIBRARY.qualitative)[0]
        ],
      },
    ]);
  };
  const [qualitativeEntries, setQualitativeEntries] = useState([
    {
      parameter: "MalariaTest",
      result: "",
      ...PARAMETER_LIBRARY.qualitative["MalariaTest"],
    },
  ]);
  // Sample pathology test parameters (would normally come from API)
  const pathologyParameters = {
    WBC: {
      type: "numeric",
      unit: "cells/mcL",
      normalRange: "4,500 - 11,000",
    },
    RBC: {
      type: "numeric",
      unit: "million cells/mcL",
      normalRange: "4.5 - 5.9",
    },
    Hemoglobin: {
      type: "numeric",
      unit: "g/dL",
      normalRange: "13.5 - 17.5",
    },
    Hematocrit: {
      type: "numeric",
      unit: "%",
      normalRange: "38.3 - 48.6",
    },
    Platelets: {
      type: "numeric",
      unit: "cells/mcL",
      normalRange: "150,000 - 450,000",
    },
    MalariaTest: {
      type: "boolean",
      options: ["Positive", "Negative"],
    },
    HIVTest: {
      type: "boolean",
      options: ["Positive", "Negative", "Indeterminate"],
    },
  };

  const { data: curUser } = useCurrentUserData();

  const handleNumericResultChange = (param, value) => {
    setNumericResults((prev) => ({
      ...prev,
      [param]: {
        ...prev[param],
        value: value,
        unit: pathologyParameters[param].unit,
        range: pathologyParameters[param].normalRange,
      },
    }));
  };

  // Pathology test state
  const [testEntries, setTestEntries] = useState([
    { parameter: "WBC", type: "numeric", result: "" },
    { parameter: "RBC", type: "numeric", result: "" },
  ]);
  const handleBooleanResultChange = (param, value) => {
    setBooleanResults((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleFileChange = (event) => {
    setResultFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChecked) {
      toast.warning(
        "Please confirm that the results are accurate and complete before submitting.",
        { className: "custom-toast" }
      );
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("test_order_id", testOrderDetails.id);
    formData.append("test_type_id", testDetails.id);
    formData.append("technician_id", curUser[0]?.user_id);
    formData.append("numeric_results", JSON.stringify(numericResults));
    formData.append("boolean_results", JSON.stringify(booleanResults));
    formData.append("comments", comments);
    if (resultFile) {
      formData.append("result_file", resultFile);
    }

    try {
      const response = await axios.post(
        "/api/lab-tests/pathology-entry",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success("Successfully Created Pathology Test Result", {
          className: "custom-toast",
        });
      } else if (response.status === 200) {
        toast.success("Successfully Updated Pathology Test Result", {
          className: "custom-toast",
        });
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data.error ||
          "Failed to save pathology test result. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>

        <div className={styles.headerSection}>

          <div className={styles.titleSection}>
              <h2>Enter Pathology Test Details For Patient</h2> 
              <p>
                Record and manage pathology test results with both quantitative
                measurements and qualitative assessments. Upload supporting
                documents when available.
              </p>
          </div>

        </div>

        <hr />

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
              ></i>
              Test Parameters
            </h3>

            {testEntries.map((entry, index) => {
              const paramConfig = pathologyParameters[entry.parameter];

              return (
                <div key={index} className={styles.testParamFormGroup}>
                  <div>
                    <label>Parameter</label>
                    <select
                      className={styles.patientSelect}
                      value={entry.parameter}
                      onChange={(e) =>
                        handleParameterChange(index, e.target.value)
                      }
                    >
                      {Object.keys(pathologyParameters).map((param) => (
                        <option key={param} value={param}>
                          {param}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Normal Range</label>
                    <p>{paramConfig.normalRange}</p>
                  </div>

                  <div>
                    <label>Result</label>
                    {entry.type === "numeric" ? (
                      <input
                        type="number"
                        step="any"
                        placeholder="Enter value"
                        value={entry.result}
                        onChange={(e) => handleResultChange(setTestEntries, index, e.target.value)}

                      />
                    ) : (
                      <select
                        className={styles.patientSelect}
                        value={entry.result}
                        onChange={(e) => handleResultChange(setTestEntries, index, e.target.value)}

                      >
                        <option value="">Select result</option>
                        {paramConfig.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {entry.type === "numeric" && (
                    <div>
                      <label>Unit</label>
                      <p>{paramConfig.unit}</p>
                    </div>
                  )}

                  <div>
                    <button
                      className={styles.cancelButton}
                      onClick={() =>
                        handleRemoveParameter(setTestEntries, index)
                      }
                      style={{ marginTop: "20px" }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <button
                className={styles.addButton}
                onClick={() => handleAddParameter(setTestEntries, "Pathology")}
                style={{ zIndex: "100" }}
              >
                <i className="bx bx-plus-circle"></i> Add Parameter
              </button>
            </div>
          </div>

          <div className={styles.qualitativeSection}>
            <h3>
              <i className="fa-solid fa-vial-circle-check" style={{ color: "#007bff", marginRight: "10px"}}></i>
              Qualitative Tests
              <button
                onClick={handleAddQualitativeParam}
                className={styles.addButton}
                style={{ marginLeft: "10px" }}
              >
                <i className="bx bx-plus"></i> Add Test
              </button>
            </h3>

            {qualitativeEntries.map((entry, index) => (
              <div key={index} className={styles.qualitativeRow}>
                <div className={styles.paramSelect}>
                  <select
                    value={entry.parameter}
                    onChange={(e) => {
                      const updated = [...qualitativeEntries];
                      updated[index] = {
                        ...PARAMETER_LIBRARY.qualitative[e.target.value],
                        parameter: e.target.value,
                        result: "",
                      };
                      setQualitativeEntries(updated);
                    }}
                  >
                    {Object.keys(PARAMETER_LIBRARY.qualitative).map((param) => (
                      <option key={param} value={param}>
                        {param}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setQualitativeEntries(
                        qualitativeEntries.filter((_, i) => i !== index)
                      );
                    }}
                    className={styles.deleteButton}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <div className={styles.resultInput}>
                  <select
                    value={entry.result}
                    onChange={(e) => {
                      const updated = [...qualitativeEntries];
                      updated[index].result = e.target.value;
                      setQualitativeEntries(updated);
                    }}
                  >
                    <option value="">Select result</option>
                    {entry.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {entry.interpretation && entry.result && (
                    <div className={styles.interpretation}>
                      <strong>Note:</strong>{" "}
                      {entry.interpretation[entry.result]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Supporting Documents
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <label>Upload Report/Images</label>
                <input
                  type="file"
                  accept="image/*,.pdf,.dicom"
                  onChange={handleFileChange}
                  className={styles.patientSelect}
                />
                {resultFile && (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Selected File: {resultFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.commentsFormSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Pathologist Comments
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea
                  style={{ borderBottom: "2px solid #0067FF", marginLeft: "0" }}
                  placeholder="Enter detailed findings and interpretation..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}
          <hr style={{ marginTop: "20px" }} />
          <div className={styles.formSection}>
            <h3>
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>{" "}
              Verification
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <p style={{ color: "#737070", fontWeight: "600" }}>Consent</p>
                <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                  Please verify the accuracy of the pathology results
                </p>
                <input
                  type="checkbox"
                  style={{ margin: "30px 10px -5px 0" }}
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                <span style={{ fontSize: "14px" }}>
                  I confirm the pathology results provided are accurate and
                  complete.
                </span>
              </div>
            </div>
          </div>
          <div className={styles.newActions}>

            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>

            <button
              className={styles.addButton}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Pathology Results"}
            </button>
            
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PathologyTestEntryPopup;

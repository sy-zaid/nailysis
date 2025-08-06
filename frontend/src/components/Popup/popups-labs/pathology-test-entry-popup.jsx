import React, { useState, useEffect } from "react";
import styles from "../../CSS Files/LabTechnician.module.css";
import Popup from "../Popup";
import { toast } from "react-toastify";
import {
  convertDjangoDateTime,
  getStatusClass,
  handleAddParameter,
  handleParameterChange,
  handleResultChange,
  handleRemoveParameter,
  handleInputChange,
} from "../../../utils/utils";
import useCurrentUserData from "../../../useCurrentUserData";
import { saveTestResultsWithImage } from "../../../api/labsApi";

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
  const [resultFile, setResultFile] = useState(null);

  // Test Result form state
  const [formData, setFormData] = useState({
    test_entries: [],
    comments: "",
  });

  const pathologyParameters = {
    WBC: {
      type: "numeric",
      unit: "cells/mcL",
      normalRange: "4,500 - 11,000",
      label: "White Blood Cells",
      description: "Measures the number of white blood cells in blood.",
    },
    RBC: {
      type: "numeric",
      unit: "million cells/mcL",
      normalRange: "4.5 - 5.9",
      label: "Red Blood Cells",
      description: "Measures the number of red blood cells in blood.",
    },
    Hemoglobin: {
      type: "numeric",
      unit: "g/dL",
      normalRange: "13.5 - 17.5",
      label: "Hemoglobin",
      description: "Measures the hemoglobin concentration in blood.",
    },
    Hematocrit: {
      type: "numeric",
      unit: "%",
      normalRange: "38.3 - 48.6",
      label: "Hematocrit",
      description: "Measures the proportion of red blood cells in blood.",
    },
    Platelets: {
      type: "numeric",
      unit: "cells/mcL",
      normalRange: "150,000 - 450,000",
      label: "Platelets",
      description: "Measures the number of platelets in blood.",
    },
    MalariaTest: {
      type: "boolean",
      options: ["Positive", "Negative"],
      label: "Malaria Test",
      interpretation: {
        Positive: "Malaria parasites detected",
        Negative: "No parasites observed",
      },
      description: "Detects presence of malaria parasites in blood smear.",
    },
    HIV: {
      type: "boolean",
      options: ["Reactive", "Non-Reactive", "Indeterminate"],
      label: "HIV Antibody Test",
      interpretation: {
        Reactive:
          "Possible presence of HIV antibodies. Further testing required.",
        NonReactive: "No HIV antibodies detected.",
        Indeterminate: "Result unclear. Repeat test advised.",
      },
      description: "HIV screening test using ELISA or rapid test methods.",
    },
    HepatitisBSurfaceAg: {
      type: "boolean",
      options: ["Positive", "Negative"],
      label: "Hepatitis B Surface Antigen (HBsAg)",
      interpretation: {
        Positive: "Indicates active Hepatitis B infection.",
        Negative: "No Hepatitis B surface antigen detected.",
      },
      description: "Checks for the presence of Hepatitis B surface antigen.",
    },
    DengueNS1: {
      type: "boolean",
      options: ["Positive", "Negative"],
      label: "Dengue NS1 Antigen",
      interpretation: {
        Positive: "Dengue virus antigen detected.",
        Negative: "No dengue antigen detected.",
      },
      description: "Detects early dengue infection before antibodies form.",
    },
    TyphoidIgM: {
      type: "boolean",
      options: ["Positive", "Negative"],
      label: "Typhoid IgM Antibodies",
      interpretation: {
        Positive: "Recent typhoid infection.",
        Negative: "No typhoid IgM antibodies detected.",
      },
      description: "Identifies recent exposure to Salmonella typhi.",
    },
  };

  const formatPathologyTestEntries = ({ testEntries, pathologyParameters }) => {
    return testEntries.reduce((acc, entry) => {
      const paramInfo = pathologyParameters[entry.parameter];

      if (!paramInfo) {
        // Skip unknown parameters
        return acc;
      }

      if (paramInfo.type === "numeric") {
        acc[entry.parameter] = {
          value: parseFloat(entry.result),
          unit: paramInfo.unit || "",
          range: paramInfo.normalRange || "",
          type: "numeric",
        };
      } else if (paramInfo.type === "boolean") {
        acc[entry.parameter] = {
          value: entry.result, // keep as string: "Positive", "Negative", etc.
          options: paramInfo.options || [],
          type: "boolean",
          interpretation: paramInfo.interpretation?.[entry.result] || "",
        };
      }

      return acc;
    }, {});
  };

  const { data: curUser } = useCurrentUserData();

  // Pathology test state
  const [testEntries, setTestEntries] = useState([
    { parameter: "WBC", type: "numeric", result: "" },
    { parameter: "RBC", type: "numeric", result: "" },
  ]);
  const onInputChange = handleInputChange(setFormData);
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

    if (
      testEntries.some((entry) => !entry.result || entry.result.trim() === "")
    ) {
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

    setLoading(true);
    setError(null);

    const payload = {
      test_order_id: testOrderDetails.id,
      test_type_id: testDetails.id,
      test_category: "Pathology",
      technician_id: curUser[0]?.user_id,
      test_entries: JSON.stringify(formData.test_entries),
      comments: formData.comments,
      result_file: resultFile,
    };
    try {
      // console.log("SENDING THIS TO PATH TEST", payload);
      const response = await saveTestResultsWithImage(payload);

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

  // ----- USE EFFECTS
  /**
   * Synchronizes the testEntries state with formData when testEntries changes.
   */
  useEffect(() => {
    if (testEntries && Array.isArray(testEntries)) {
      setFormData((prev) => ({
        ...prev,
        test_entries: formatPathologyTestEntries({
          testEntries,
          pathologyParameters: pathologyParameters,
        }),
      }));
    }
  }, [testEntries]); // This will update formData when testEntries changes

  /**
   * Logs the formatted test entries whenever the testEntries or pathologyParameters change.
   */
  useEffect(() => {
    if (!testEntries || !Array.isArray(testEntries)) return; // Prevent errors
    // console.log(
    //   "TEST ENTRIES FORMATTING:",
    //   formatPathologyTestEntries({ testEntries, pathologyParameters })
    // );
  }, [testEntries, pathologyParameters]);

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
                        handleParameterChange(
                          setTestEntries,
                          index,
                          e.target.value
                        )
                      }
                    >
                      {Object.keys(pathologyParameters).map((param) => (
                        <option key={param} value={param}>
                          {pathologyParameters[param].label}
                        </option>
                      ))}
                    </select>
                    {paramConfig.description && (
                      <p className={styles.parameterDescription}>
                        {paramConfig.description}
                      </p>
                    )}
                  </div>

                  {paramConfig.type === "numeric" && (
                    <>
                      <div>
                        <label>Normal Range</label>
                        <p>{paramConfig.normalRange}</p>
                      </div>
                      <div>
                        <label>Unit</label>
                        <p>{paramConfig.unit}</p>
                      </div>
                    </>
                  )}

                  <div>
                    <label>Result</label>
                    {paramConfig.type === "numeric" ? (
                      <input
                        type="number"
                        step="any"
                        placeholder="Enter value"
                        value={entry.result}
                        onChange={(e) =>
                          handleResultChange(
                            setTestEntries,
                            index,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <>
                        <select
                          className={styles.patientSelect}
                          value={entry.result}
                          onChange={(e) =>
                            handleResultChange(
                              setTestEntries,
                              index,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select result</option>
                          {paramConfig.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {entry.result &&
                          paramConfig.interpretation?.[entry.result] && (
                            <div className={styles.interpretation}>
                              <strong>Note:</strong>{" "}
                              {paramConfig.interpretation[entry.result]}
                            </div>
                          )}
                      </>
                    )}
                  </div>

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
              <i
                className="fa-solid fa-vial-circle-check"
                style={{ color: "#007bff", marginRight: "10px" }}
              ></i>
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
                  style={{ borderBottom: "2px solid #0067FF" }}
                  placeholder="Enter your comments for this test report"
                  name="comments"
                  value={formData.comments}
                  onChange={onInputChange}
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

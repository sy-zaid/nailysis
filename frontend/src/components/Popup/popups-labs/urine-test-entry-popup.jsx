import React, { useEffect } from "react";
import styles from "../../CSS Files/LabTechnician.module.css";
import Popup from "../Popup";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  urineTestParameters,
  convertDjangoDateTime,
  handleParameterChange,
  handleResultChange,
  handleAddParameter,
  handleRemoveParameter,
  handleInputChange,
  getStatusClass,
  formatUrineTestEntries,
} from "../../../utils/utils";
import useCurrentUserData from "../../../useCurrentUserData";
import { saveTestResults } from "../../../api/labsApi";

const UrineTestEntryPopup = ({
  onClose,
  testDetails,
  testOrderDetails,
  editable,
}) => {
  const [popupTrigger, setPopupTrigger] = useState(true);

  // IMPORTANT DATA
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  const [isChecked, setIsChecked] = useState(false);

  const [testEntries, setTestEntries] = useState([
    { parameter: "UrineColor", result: "" },
    { parameter: "pH", result: "" },
    { parameter: "SpecificGravity", result: "" },
  ]);

  const [formData, setFormData] = useState({
    test_entries: [],
    comments: "",
  });

  const onInputChange = handleInputChange(setFormData);

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
    const payload = {
      test_order_id: testOrderDetails.id,
      test_type_id: testDetails.id,
      technician_id: curUser[0]?.user_id,
      test_entries: formData.test_entries,
      comments: formData.comments,
    };
    try {
      const response = await saveTestResults(payload);
      if (response.status === 201) {
        toast.success("Successfully Created Test Result", {
          className: "custom-toast",
        });
      } else if (response.status === 200) {
        toast.success("Successfully Edited Test Result", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      toast.error(error.response?.data.error || "Something went wrong.", {
        className: "custom-toast",
      });
    }
  };

  useEffect(() => {
    if (testEntries && Array.isArray(testEntries)) {
      setFormData((prev) => ({
        ...prev,
        test_entries: formatUrineTestEntries({
          testEntries,
          urineTestParameters: urineTestParameters,
        }),
      }));
    }
  }, [testEntries]);

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>

        <div className="headerSection">

          <div className={styles.titleSection}>
            <h2>
              Enter Test Details For Patient 
            </h2>
            <p>
              Manage and generate lab test reports with ease. Technicians can
              edit reports until finalized, ensuring accuracy <br />  before they become
              downloadable PDFs for patients and doctors.
            </p>
          </div>
          
        </div>

        <hr />

        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading} style={{ marginLeft: "26px" }}>
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
            <span className={getStatusClass("Pending", styles.pending)}>
              {editable[0] === true ? editable[1] : "Pending"}
            </span>
          </p>

          <p className={styles.newSubHeading} style={{ marginLeft: "26px" }}>
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
              ></i>{" "}
              Test Result Entry
            </h3>
            {/* Dynamic test parameters */}
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
                    {Object.keys(urineTestParameters).map((param) => (
                      <option key={param} value={param}>
                        {param}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Normal Range</label>
                  <p>{urineTestParameters[entry.parameter].normalRange}/</p>
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
                  <p>{urineTestParameters[entry.parameter].unit}</p>
                </div>

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
                onClick={() => handleAddParameter(setTestEntries, "urine")}
                style={{ zIndex: "100" }}
              >
                <i className="bx bx-plus-circle"></i> Add More Parameters
              </button>
            </div>
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
                  style={{ borderBottom: "2px solid #0067FF", marginLeft: "0" }}
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
            <div className={styles.documentFormGroup}>
              <div>
                <p style={{ color: "#737070", fontWeight: "600" }}>Consent</p>
                <p style={{ fontStyle: "italic", fontWeight: "600" }}>
                  Please verify the accuracy of the test result
                </p>
                <input
                  type="checkbox"
                  style={{ margin: "20px 10px -5px 0" }}
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                <span style={{ fontSize: "14px", marginTop: "-10px" }}>
                  I confirm the results provided are accurate and complete.
                </span>
              </div>
            </div>
          </div>

          <div className={styles.newActions}>

            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.addButton} onClick={handleSaveResults}>
              Save Test Result
            </button>

          </div>
        </div>
      </div>
    </Popup>
  );
};

export default UrineTestEntryPopup;

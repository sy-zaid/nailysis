import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../CSS Files/LabTechnician.module.css";
import Popup from "../Popup";
import { toast } from "react-toastify";
import {
  convertDjangoDateTime,
  getStatusClass,
  handleInputChange,
} from "../../../utils/utils";
import useCurrentUserData from "../../../useCurrentUserData";
import { saveTestResultsWithImage } from "../../../api/labsApi";

const ImagingTestEntryPopup = ({
  onClose,
  testDetails,
  testOrderDetails,
  editable,
}) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [resultFile, setResultFile] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const { data: curUser } = useCurrentUserData();
  const [formData, setFormData] = useState({
    comments: "",
  });

  const onInputChange = handleInputChange(setFormData);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setResultFile(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
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

    if (!resultFile || resultFile.length === 0) {
      setError("Please upload at least one image or report.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = new FormData();
    payload.append("test_order_id", testOrderDetails.id);
    payload.append("test_type_id", testDetails.id);
    payload.append("test_category", "Imaging");
    payload.append("technician_id", curUser[0]?.user_id);
    payload.append("comments", formData.comments);
    
    // Append all files
    resultFile.forEach(file => {
      payload.append("result_file", file);
    });

    try {
      const response = await saveTestResultsWithImage(payload);

      if (response.status === 201) {
        toast.success("Successfully Created Imaging Test Result", {
          className: "custom-toast",
        });
      } else if (response.status === 200) {
        toast.success("Successfully Updated Imaging Test Result", {
          className: "custom-toast",
        });
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data.error ||
          "Failed to upload imaging test result. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2>Enter Imaging Test Details For Patient</h2>
          </div>
          <div className={styles.subhead}>
            <h5 style={{ margin: "10px 0" }}>
              Upload and manage imaging test results. Technicians can attach
              images or reports and provide descriptions until finalized,
              ensuring accuracy before they become accessible to patients and
              doctors.
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
            <span className={getStatusClass("Pending", styles.pending)}>
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
              ></i>{" "}
              Imaging Test Upload
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <label>Upload Images/Reports</label>
                <input
                  type="file"
                  accept="image/*,.pdf,.dicom"
                  onChange={handleFileChange}
                  multiple
                  className={styles.patientSelect}
                />
                {resultFile && resultFile.length > 0 && (
                  <div className={styles.filePreviews}>
                    <p>Selected Files: {resultFile.length}</p>
                    <div className={styles.previewContainer}>
                      {previewUrls.map((url, index) => (
                        <div key={index} className={styles.previewItem}>
                          {resultFile[index].type.includes('image') ? (
                            <img 
                              src={url} 
                              alt={`Preview ${index}`}
                              className={styles.previewImage}
                            />
                          ) : (
                            <div className={styles.fileIcon}>
                              <i className="fas fa-file-pdf"></i>
                              <span>{resultFile[index].name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
              Findings/Description
            </h3>
            <div className={styles.documentFormGroup}>
              <textarea
                style={{ borderBottom: "2px solid #0067FF" }}
                placeholder="Enter detailed description of imaging findings..."
                name="comments"
                value={formData.comments}
                onChange={onInputChange}
              />
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
                  Please verify the accuracy of the imaging results
                </p>
                <input
                  type="checkbox"
                  style={{ marginRight: "10px" }}
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                <span style={{ fontSize: "14px", marginTop: "-10px" }}>
                  I confirm the imaging results provided are accurate and
                  complete.
                </span>
              </div>
            </div>
          </div>

          <div className={styles.saveCancelButtons}>
            <button
              className={styles.saveButton}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Save Imaging Results"}
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default ImagingTestEntryPopup;
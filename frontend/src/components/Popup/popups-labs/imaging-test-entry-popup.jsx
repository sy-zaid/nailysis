import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../CSS Files/LabTechnician.module.css";
import Popup from "../Popup";
import { toast } from "react-toastify";
import { convertDjangoDateTime, getStatusClass } from "../../../utils/utils";
import useCurrentUserData from "../../../useCurrentUserData";

const ImagingTestEntryPopup = ({
  onClose,
  testDetails,
  testOrderDetails,
  editable,
}) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const { data: curUser } = useCurrentUserData();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

    if (!file) {
      setError("Please upload an image or report.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("test_order_id", testOrderDetails.id);
    formData.append("test_type_id", testDetails.id);
    formData.append("technician_id", curUser[0]?.user_id);
    formData.append("image", file);
    formData.append("description", description);

    try {
      const response = await axios.post("/api/lab-tests/imaging-entry", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
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
      setError(err.response?.data.error || "Failed to upload imaging test result. Try again.");
    }
    setLoading(false);
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div className={styles.formContainer}>
        <div className={styles.tophead}>
          <div className={styles.header}>
            <h2>Enter Imaging Test Details For Patient</h2>
          </div>
          <div className={styles.subhead}>
            <h5 style={{ margin: "10px 0" }}>
              Upload and manage imaging test results. Technicians can attach images or reports 
              and provide descriptions until finalized, ensuring accuracy before they become 
              accessible to patients and doctors.
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
                <label>Upload Image/Report</label>
                <input
                  type="file"
                  accept="image/*,.pdf,.dicom"
                  onChange={handleFileChange}
                  className={styles.patientSelect}
                />
                {file && (
                  <p style={{ marginTop: "10px", color: "#666" }}>
                    Selected File: {file.name}
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
              Findings/Description
            </h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea
                  style={{ borderBottom: "2px solid #0067FF" }}
                  placeholder="Enter detailed description of imaging findings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Please verify the accuracy of the imaging results
                </p>
                <input
                  type="checkbox"
                  style={{ marginRight: "10px" }}
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                <span style={{ fontSize: "14px", marginTop: "-10px" }}>
                  I confirm the imaging results provided are accurate and complete.
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
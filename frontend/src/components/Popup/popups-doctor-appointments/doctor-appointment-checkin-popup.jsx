import React from "react";
import Select from "react-select";
import styles from "./doctor-appointment-book-popup.module.css";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  calculateAge,
  handleClosePopup,
  convertDjangoDateTime,
  getStatusClass,
} from "../../../utils/utils";
import { saveCompleteDoctorAppointment } from "../../../api/appointmentsApi";
import useCurrentUserData from "../../../useCurrentUserData";

import {
  medicalConditionsOptions,
  categoryOptions,
  handleInputChange,
  handleSelectChange,
  testTypes,
} from "../../../utils/utils";

const CheckinDoctorAppointmentPopup = ({ onClose, appointmentDetails }) => {
  // State variables
  const [timer, setTimer] = useState(0); // Keeps track of elapsed time in seconds
  const [isConsultationStarted, setIsConsultationStarted] = useState(false); // Tracks whether consultation has started
  const [intervalId, setIntervalId] = useState(null); // Stores the timer's interval ID to control it
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [status, setStatus] = useState("Pending");
  console.log("DETAA", appointmentDetails);
  // Function to format time in HH:MM:SS format
  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // State for EHR data
  const [ehrData, setEhrData] = useState({
    medical_conditions: [],
    current_medications: [],
    immunization_records: [],
    recommended_lab_test: [],
    nail_image_analysis: "",
    test_results: "",
    diagnoses: [],
    comments: "",
    family_history: "",
    category: "General",
  });

  // Handlers for input and select changes
  const onSelectChange = handleSelectChange(setEhrData);
  const onInputChange = handleInputChange(setEhrData);

  // Handles the completion of appointment
  const handleCompleteAppointment = async () => {
    try {
      const formData = new FormData();
      Object.entries(ehrData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Keep JSON format for arrays
        } else {
          formData.append(key, value);
        }
      });
      // Run validation checks
      if (!validateEHRForm()) {
        return; // Do not proceed if any field is invalid
      }
      await saveCompleteDoctorAppointment(
        appointmentDetails.appointment_id,
        formData
      );
      toast.success("Successfully marked as completed", {
        className: "custom-toast",
      });
      stopTimer();
      onClose();
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(
          error.response.data.error || "Failed to complete appointment",
          { className: "custom-toast" }
        );
      } else {
        toast.error("Network Error", {
          className: "custom-toast",
        });
      }
    }
  };

  // Function to start the timer when consultation begins
  const startTimer = () => {
    setIsConsultationStarted(true);
    const id = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  // Function to stop the timer when consultation ends
  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  // useEffect to reset timer and state when popup opens
  useEffect(() => {
    if (popupTrigger) {
      setTimer(0); // Reset timer when popup opens
      setIsConsultationStarted(false); // Reset consultation status
      if (intervalId) {
        clearInterval(intervalId); // Clear any running timer
        setIntervalId(null); // Reset interval ID
      }
    }
  }, [popupTrigger]); // Runs when the popup state changes

  // Validation helper before completing the appointment
  const validateEHRForm = () => {
    if (
      !ehrData.medical_conditions ||
      ehrData.medical_conditions.length === 0
    ) {
      toast.warning("Please Select Medical Conditions", {
        className: "custom-toast",
      });
      return false;
    }
    if (
      !ehrData.current_medications ||
      ehrData.current_medications.length === 0
    ) {
      toast.warning("Please Select Current Medications", {
        className: "custom-toast",
      });
      return false;
    }
    if (!ehrData.diagnoses || ehrData.diagnoses.length === 0) {
      toast.warning("Please Select Diagnoses", { className: "custom-toast" });
      return false;
    }
    if (!ehrData.category) {
      toast.warning("Please Select Category", { className: "custom-toast" });
      return false;
    }
    if (
      !ehrData.recommended_lab_test ||
      ehrData.recommended_lab_test.length === 0
    ) {
      toast.warning("Please Select Recommended Tests", {
        className: "custom-toast",
      });
      return false;
    }
    // All validations passed
    return true;
  };

  // Content to display as second screen (patient information)
  const renderPatientInfoContent = () => (
    <>
      <div className={styles.formSection}>
        <br />
        <h3>
          <i
            className="fa-solid fa-circle fa-2xs"
            style={{ color: "#007bff", marginRight: "10px" }}
          ></i>{" "}
          Patient Information
        </h3>
        <div className={styles.newFormGroup}>
          <div>
            <label>First Name</label>
            <p className={styles.subHeading}>
              {appointmentDetails.patient?.user?.first_name}
            </p>
          </div>
          <div>
            <label>Last Name</label>
            <p className={styles.subHeading}>
              {appointmentDetails.patient?.user?.last_name}
            </p>
          </div>
          <div>
            <label>Age</label>
            <p className={styles.subHeading}>
              {calculateAge(appointmentDetails.patient?.date_of_birth)}
            </p>
          </div>
          <div>
            <label>Gender</label>
            <p className={styles.subHeading}>
              {appointmentDetails.patient?.gender}
            </p>
          </div>
          <div>
            <label>Phone Number</label>
            <p className={styles.subHeading}>
              {appointmentDetails.patient?.user?.phone || "N/A"}
            </p>
          </div>

          <div>
            <label>Email Address</label>
            <p className={styles.subHeading}>
              {appointmentDetails.patient?.user?.email}
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
          Appointment Details
        </h3>
        <div className={styles.newFormGroup}>
          <div>
            <label>Specialization</label>
            <p className={styles.subHeading}>
              {appointmentDetails.doctor?.specialization}{" "}
            </p>
          </div>
          <div>
            <label>Doctor</label>
            <p className={styles.subHeading}>
              Dr. {appointmentDetails.doctor?.user?.first_name}{" "}
              {appointmentDetails.doctor?.user?.last_name}{" "}
            </p>
          </div>

          <div>
            <label>Date & Time</label>
            <p className={styles.subHeading}>
              {convertDjangoDateTime(appointmentDetails?.checkin_datetime)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.commentsFormSection}>
        <h3 style={{ color: "#737070", marginLeft: "25px", fontSize: "16px" }}>
          Comments
        </h3>
        <div className={styles.documentFormGroup}>
          <div>
            <textarea
              className={styles.textAreaField}
              style={{ border: "none" }}
              disabled
            >
              {appointmentDetails?.notes || "N/A"}
            </textarea>
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
          Payment Test Details
        </h3>
        <div style={{ marginLeft: "25px" }}>
          {ehrData.recommended_lab_test.map((test, index) => (
            <div key={index} className={styles.testType}>
              <span style={{ marginLeft: "25px" }}>{test.label}</span>
              <span className={styles.testTypeBorder}></span>
              <span style={{ marginRight: "45px" }}>
                RS/- {test.price || 0}
              </span>
            </div>
          ))}

          <hr
            style={{
              marginTop: "25px",
              width: "93.5%",
              marginLeft: "25px",
            }}
          />

          <div className={styles.testType}>
            <span style={{ marginLeft: "25px", fontWeight: "bold" }}>
              Subtotal
            </span>
            <span style={{ marginRight: "45px", fontWeight: "bold" }}>
              RS/-{" "}
              {ehrData.recommended_lab_test.reduce(
                (sum, test) => sum + parseFloat(test.price || 0),
                0
              )}
            </span>
          </div>

          <hr
            style={{
              marginTop: "15px",
              width: "93.5%",
              marginLeft: "25px",
            }}
          />
        </div>
      </div>
    </>
  );

  // Content to display as first screen (EHR form/consultation)
  const renderConsultationFormContent = () => (
    <>
      {/* Medical Conditions */}
      <div className={styles.formGroup}>
        <label>Medical Conditions</label>
        <Select
          isMulti
          options={medicalConditionsOptions}
          onChange={(selected) =>
            onSelectChange("medical_conditions", selected)
          }
        />
      </div>

      {/* Current Medications */}
      <div className={styles.formGroup}>
        <label>Current Medications</label>
        <Select
          isMulti
          options={[
            { value: "None", label: "None" },
            { value: "Metformin", label: "Metformin" },
            { value: "Aspirin", label: "Aspirin" },
            { value: "Lisinopril", label: "Lisinopril" },
            { value: "Atorvastatin", label: "Atorvastatin" },
          ]}
          placeholder="Select or add medications"
          onChange={(selected) =>
            onSelectChange("current_medications", selected)
          }
        />
      </div>

      {/* Diagnoses */}
      <div className={styles.formGroup}>
        <label>Diagnoses</label>
        <Select
          isMulti
          options={[
            { value: "None", label: "None" },
            { value: "Anemia", label: "Anemia" },
            { value: "Diabetes", label: "Diabetes" },
            { value: "Hypertension", label: "Hypertension" },
            { value: "Fungal Infection", label: "Fungal Infection" },
          ]}
          placeholder="Select diagnoses"
          onChange={(selected) => onSelectChange("diagnoses", selected)}
        />
      </div>

      {/* Category */}
      <div className={styles.formGroup}>
        <label>Category</label>
        <Select
          options={categoryOptions}
          defaultValue={categoryOptions[3]}
          onChange={(selected) =>
            setEhrData({ ...ehrData, category: selected.value })
          }
        />
      </div>

      {/* Recommended Test Types */}
      <div className={styles.formGroup}>
        <label>Recommended Tests</label>
        <Select
          isMulti
          options={testTypes}
          placeholder="Recommend any test to patient"
          onChange={(selected) =>
            onSelectChange("recommended_lab_test", selected)
          }
        />
      </div>

      {/* Comments */}
      <div className={styles.formGroup}>
        <label>Comments</label>
        <textarea
          name="comments"
          placeholder="Add any additional comments"
          value={ehrData.comments}
          onChange={onInputChange}
        />
      </div>

      {/* Family History */}
      <div className={styles.formGroup}>
        <label>Family History</label>
        <textarea
          name="family_history"
          placeholder="Enter relevant family medical history"
          value={ehrData.family_history}
          onChange={onInputChange}
        />
      </div>
    </>
  );

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
              {isConsultationStarted
                ? "1. Patient Information"
                : "2. Complete Patient Check-In"}
            </h2>
          </div>

          <div className={styles.subhead}>
            <h5>
              {isConsultationStarted
                ? "Review Patient Details"
                : "Electronic Health Record"}
            </h5>
            <div>
              <h2 style={{ marginRight: "45px" }}>
                Time: <span>{formatTime(timer)}</span>
              </h2>
            </div>
          </div>

          <hr />
        </div>

        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading}>
            <span className={styles.key}>
              {" "}
              <i className="fa-solid fa-circle-notch"></i> Status:{" "}
            </span>
            <span className={getStatusClass(status, styles)}>Pending</span>
            <span className={styles.key} style={{ margin: "0 0 0 50px" }}>
              {" "}
              <i className="fa-solid fa-location-dot"></i> Location:{" "}
            </span>
            <span className={styles.locationValue || ""}>
              Chughtai Lab, North Nazimabad
            </span>
          </p>

          {isConsultationStarted
            ? renderConsultationFormContent()
            : renderPatientInfoContent()}

          <div className={styles.newActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setPopupTrigger(false)}
            >
              Cancel
            </button>
            {!isConsultationStarted ? (
              <button className={styles.addButton} onClick={startTimer}>
                Next: Patient Details
              </button>
            ) : (
              <button
                className={styles.addButton}
                onClick={handleCompleteAppointment}
              >
                Complete Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default CheckinDoctorAppointmentPopup;

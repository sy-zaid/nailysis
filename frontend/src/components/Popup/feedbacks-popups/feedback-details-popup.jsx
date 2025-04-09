import Popup from "../Popup.jsx";
import styles from "./popup-feedback.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api/feedback_reponse";

import {
  calculateAge,
  getAccessToken,
  getRole,
  handleInputChange,
} from "../../../utils/utils.js";

const FeedbackDetails = ({ onClose, recordDetails }) => {
  console.log("Record Details", recordDetails)
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [status, setStatus] = useState("Resolved");
  const token = getAccessToken();
  const feedbackId = recordDetails?.id;
  const [feedback, setFeedback] = useState([]);

  
  // Fetch feedback details when the popup opens
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${feedbackId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback details:", error);
      }
    };

    if (feedbackId) {
      fetchFeedbackDetails();
    }
  }, [feedbackId, token]);


  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return styles.resolved;
      case "In Progress":
        return styles.inProgress;
      case "Pending":
        return styles.pending;
      default:
        return {};
    }
  }

  // Using the first feedback entry for display (for now)

  const handleResponse = () => {
    console.log("Response Submitted:", { response, status });
  };



  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>

      <div className={styles.formContainer}>

        <div className={styles.headerSection}>

          <div className={styles.titleSection}>
            <h2 style={{ marginLeft: "20px" }}>Feedback Details</h2>
            <p style={{ marginLeft: "20px" }}>View feedback details to understand user concerns and improve service quality.</p>
          </div>

        </div>

        <hr />

        <p className={styles.newSubHeading}>
          <span className={styles.key} style={{ margin: "0 0 0 20px" }}> <i className="fa-solid fa-circle-notch" style={{ fontSize: "14px" }}></i> Status: </span>
          <span className={getStatusClass(status)} style={{ fontSize: "16px" }}>{recordDetails?.status}</span>

          <span className={styles.key} style={{ margin: "0 0 0 20px" }}> <i class='bx bx-calendar-alt'></i> Date Submitted: </span>
          <span className={styles.locationValue}>{new Date(recordDetails?.date_submitted).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}</span>

          <span className={styles.key} style={{ margin: "0 0 0 20px" }}> <i class='bx bx-calendar-check' ></i> Date Responded: </span>
          <span className={styles.locationValue}>{new Date(recordDetails?.response?.date_submitted).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}</span>
        </p>

        <div className={styles.popupBottom}>

          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Feedback Submitted By</h3>
            <div className={styles.newFormGroup}>
              <div>
                <label>Patient ID</label>
                <p className={styles.subHeading}>{recordDetails?.user?.user_id}</p>
              </div>
              <div>
                <label>Patient Name</label>
                <p className={styles.subHeading}>{recordDetails?.user?.first_name}{" "}{recordDetails?.user?.last_name}</p>
              </div>
              <div>
                <label>Age</label>
                <p className={styles.subHeading}>{calculateAge(recordDetails?.user?.patient?.date_of_birth)}</p>
              </div>
              <div>
                <label>Gender</label>
                <p className={styles.subHeading}>{recordDetails?.user?.patient?.gender}</p>
              </div>
              <div>
                <label>Phone Number</label>
                <p className={styles.subHeading}>{recordDetails?.user?.phone}</p>
              </div>

              <div>
                <label>Email Address</label>
                <p className={styles.subHeading}>{recordDetails?.user?.email}</p>
              </div>

            </div>
          </div>

          <hr />

          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Comments/Feedback</h3>
            <div>
              <div>
                <textarea value={recordDetails?.description || "No response yet"} disabled></textarea>
              </div>
            </div>
          </div>

          <hr />

          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Response By Clinic Admin/Lab Admin</h3>
            <div>
              <div>
                <textarea value={recordDetails?.response?.description || "No response yet"} disabled></textarea>
              </div>
            </div>
          </div>

          <hr />

          <div className={styles.actions}>

            <button
              className={styles.cancelButton}
              onClick={onClose}
            >
              Close
            </button>

          </div>

        </div>

      </div>


      {/* <div className="p-5">
        <h2 className="text-xl font-bold">Feedback Details</h2>
        <p><strong>Category:</strong> {feedback.category}</p>
        <p><strong>Message:</strong> {feedback.message}</p>
        <p><strong>Status:</strong> {feedback.status}</p>

        <textarea
          className="border p-2 w-full mt-2"
          placeholder="Enter response..."
          onChange={(e) => setResponse(e.target.value)}
        />

        <select
          className="border p-2 mt-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <button
          className="bg-green-500 text-white p-2 mt-2"
          onClick={handleResponse}
        >
          Submit Response
        </button>
      </div> */}
    </Popup>
  );
};

export default FeedbackDetails;

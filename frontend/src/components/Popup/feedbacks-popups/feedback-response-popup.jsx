import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:8000/api/feedback_reponse"; // Update with actual API URL
import styles from "./popup-feedback.module.css";
import useCurrentUserData from "../../../useCurrentUserData.jsx";


import {
  calculateAge,
  getAccessToken,
  getRole, getStatusClass,
  handleInputChange,
} from "../../../utils/utils.js";
import {
  submitFeedbackResponse,
  getFeedbackCategories,
} from "../../../api/feedbacksApi.js";

const FeedbackResponse = ({ onClose, recordDetails }) => {
  console.log("Record Details", recordDetails)
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("Pending");

  // Static feedback data (2 sample rows)
  const data = [
    {
      id: 1,
      feedbackID: "123456",
      feedbackBy: "John",
      role: "patient",
      dateAndTimeofFeedback: "10/10/2024 09:30 AM",
      category: "Service Issues",
      feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
      response: "xyz lorem ipsum",
      respondedBy: "CA/LA",
      status: "Resolved",
    },

    {
      id: 2,
      feedbackID: "123456",
      feedbackBy: "Doe",
      role: "patient",
      dateAndTimeofFeedback: "10/10/2024 09:30 AM",
      category: "Technical Issues",
      feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
      response: "N/a",
      respondedBy: "N/a",
      status: "Pending",
    },
  ];


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
  const feedback = data[0];

  const handleResponse = () => {
    console.log("Response Submitted:", { response, status });
  };



  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>

      <div className={styles.formContainer} style={{ marginTop: "-2%" }}>

        <div className={styles.headerSection}>

          <div className={styles.titleSection}>
            <h2 style={{ marginLeft: "20px" }}>Respond to Feedback</h2>
            <p style={{ marginLeft: "20px" }}>Check insights from the patient's feedback for continuous improvement in care.</p>
          </div>

        </div>

        <hr />

        <p className={styles.newSubHeading}>
          <span className={styles.key} style={{ margin: "0 0 0 20px" }}> <i className="fa-solid fa-circle-notch" style={{ fontSize: "14px" }}></i> Status: </span>
          <span className={getStatusClass(status)} style={{ fontSize: "16px" }}>{feedback.status}</span>

          <span className={styles.key} style={{ margin: "0 0 0 20px" }}> <i class='bx bx-calendar-alt'></i> Date Submitted: </span>
          <span className={styles.locationValue}>{new Date(recordDetails?.date_submitted).toLocaleString("en-US", {
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
            <h3><i className="fa-solid fa-circle fa-2xs" style={{ color: "#007bff", marginRight: "10px" }}></i> Feedback Submitted By</h3>
            <div className={styles.newFormGroup}>
              <div>
                <label>Fedback ID</label>
                <p className={styles.subHeading}>{recordDetails?.id}</p>
              </div>
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
            <h3><i className="fa-solid fa-circle fa-2xs" style={{ color: "#007bff", marginRight: "10px" }}></i> Comments/Feedback</h3>
            <div>
              <div>
                <textarea style={{ borderBottom: "2px solid #0067FF" }} value={recordDetails?.description || "No feedback available"} disabled></textarea>
              </div>
            </div>
          </div>

          <hr />

          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs" style={{ color: "#007bff", marginRight: "10px" }}></i> Add a Reply</h3>
            <div className={styles.formGroup}>
              <textarea style={{ borderBottom: "2px solid #0067FF", marginLeft: "0" }}
                placeholder="Enter your response here..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}>
              </textarea>

              <div className={styles.verificationConfirmation}>
                <p><input type="checkbox"
                  checked={isResolved}
                  onChange={(e) => setIsResolved(e.target.checked)} />
                  <span>Mark Issue As Resolved</span> </p>
              </div>
            </div>
          </div>

          <hr />

          <div className={styles.actions}>

            <button
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className={styles.addButton}
              onClick={handleSubmit}
            >
              Submit Response
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

export default FeedbackResponse;

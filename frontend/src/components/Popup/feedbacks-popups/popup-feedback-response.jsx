import React, { useState } from "react";
import Popup from "../Popup.jsx";
import styles from "./popup-feedback.module.css";

const FeedbackResponse = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("Pending");

  // Static feedback data (3 sample rows)
  const feedbackList = [
    { id: "PAT001", category: "Service Issue", message: "The waiting time is too long.", status: "Pending" },
    { id: "PAT002", category: "Technical Issue", message: "The app crashes on login.", status: "In Progress" },
    { id: "PAT003", category: "Billing Issue", message: "Incorrect charge on my bill.", status: "Resolved" }
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
  const feedback = feedbackList[0];

  const handleResponse = () => {
    console.log("Response Submitted:", { response, status });
  };

 

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>

      <div className={styles.formContainer}>

        <div className={styles.headerSection}>

          <div className={styles.titleSection}>
            <h2 style={{ marginLeft: "20px" }}>Feedback Details</h2> 
            <p style={{ marginLeft: "20px" }}>Review and respond to the feedback provided to ensure all concerns are addressed effectively</p>
          </div>

        </div>

        <hr />

        <p className={styles.newSubHeading}>
            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i class='bx bx-category'></i> Category: </span>
            <span className={styles.locationValue}>{feedback.category}</span>

            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i class='bx bx-message-rounded'></i> Message: </span>
            <span className={styles.locationValue}>{feedback.message}</span>

            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i className="fa-solid fa-circle-notch" style={{ fontSize: "12px" }}></i> Status: </span>
            <span className={getStatusClass(status)} style={{ fontSize: "16px" }}>{status}</span>
          </p>

        <div className={styles.popupBottom}>

          <label style={{ marginRight: "10px" }}>Enter Response</label>
          <textarea
            placeholder="Write your response here..."
            onChange={(e) => setResponse(e.target.value)}
          />

          <label style={{ marginRight: "47px" }}>Set Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <div className={styles.actions}>

            <button 
              className={styles.cancelButton}
              onClick={() => setPopupTrigger(false)}
              >
                Cancel
            </button>

            <button
              className={styles.addButton}
              onClick={handleResponse}
            >
              Submit
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

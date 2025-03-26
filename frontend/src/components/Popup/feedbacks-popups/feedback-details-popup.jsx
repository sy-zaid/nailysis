import React, { useState } from "react";
import Popup from "../Popup.jsx";
import styles from "./popup-feedback.module.css";
import { getStatusClass } from "../../../utils/utils.js";

const FeedbackDetails = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [status, setStatus] = useState("Resolved");

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
        feedbackBy: "John",
        role: "patient",
        dateAndTimeofFeedback: "10/10/2024 09:30 AM",
        category: "Technical Issues",
        feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
        response: "N/a",
        respondedBy: "N/a",
        status: "Pending",
    },
  ];


  // Using the first feedback entry for display (for now)
  const feedback = data[0];

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
            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i className="fa-solid fa-circle-notch" style={{ fontSize: "14px" }}></i> Status: </span>
            <span className={getStatusClass(status, styles)} style={{ fontSize: "16px" }}>{feedback.status}</span>

            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i class='bx bx-calendar-alt'></i> Date Submitted: </span>
            <span className={styles.locationValue}>{feedback.dateAndTimeofFeedback}</span>

            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i class='bx bx-calendar-check' ></i> Date Responded: </span>
            <span className={styles.locationValue}>10/10/2024 09:30 AM</span>
        </p>

        <div className={styles.popupBottom}>

          <div className={styles.formSection}>
                    <h3><i className="fa-solid fa-circle fa-2xs"></i> Feedback Submitted By</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Patient ID</label>
                        <p className={styles.subHeading}>123456</p>
                      </div>
                      <div>
                        <label>Patient Name</label>
                        <p className={styles.subHeading}>Mr. John Doe</p>
                      </div>
                      <div>
                        <label>Age</label>
                        <p className={styles.subHeading}>32</p>
                      </div>
                      <div>
                        <label>Gender</label>
                        <p className={styles.subHeading}>Male</p>
                      </div>
                      <div>
                        <label>Phone Number</label>
                        <p className={styles.subHeading}>+92 12345678</p>
                      </div>

                      <div>
                        <label>Email Address</label>
                        <p className={styles.subHeading}>patient@gmail.com</p>
                      </div>

                    </div>
          </div>

          <hr />

          <div className={styles.formSection}>
              <h3><i className="fa-solid fa-circle fa-2xs"></i> Comments/Feedback</h3>
              <div>
                <div>
                  <textarea defaultValue="Very good technician" disabled></textarea>
                </div>
              </div>
          </div>

          <hr />

          <div className={styles.formSection}>
              <h3><i className="fa-solid fa-circle fa-2xs"></i> Response By Clinic Admin/Lab Admin</h3>
              <div>
                <div>
                  <textarea defaultValue="Thank You!" disabled></textarea>
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

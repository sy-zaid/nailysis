import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:8000/api/feedback_reponse"; // Update with actual API URL
import styles from "./popup-feedback.module.css";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import { toast } from "react-toastify";


import {
  calculateAge,
  getAccessToken,
  getRole,
  handleInputChange,
} from "../../../utils/utils.js";
import {
  submitFeedbackResponse,
  getFeedbackCategories,
} from "../../../api/feedbacksApi.js";

const FeedbackResponse = ({ onClose, recordDetails }) => {
  console.log("Record Details", recordDetails)
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = getAccessToken();
  const [reply, setReply] = useState("");  // Stores the response text
  const [isResolved, setIsResolved] = useState(false); // ✅ Track checkbox state
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = [{
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
  }]; // Store feedback details
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const feedbackId = "2"
  const [formData, setFormData] = useState({
    description: "",
  });

  const onInputChange = handleInputChange(setFormData);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reply.trim()) {
      toast.error("Response cannot be empty.");
      return;
    }

    const feedbackData = {
      description: reply, // Send the response text
      status: isResolved ? "Resolved" : "Pending",
    };

    const feedbackId = recordDetails?.id; // Ensure this is correctly passed

    if (!feedbackId) {
      toast.error("Error: Feedback ID missing");
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/api/feedback_response/${feedbackId}/submit_response/`;

    try {
      const response = await axios.post(url, feedbackData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 201) {
        toast.success("Response submitted successfully!", {
          className: "custom-toast",
        });
        onClose(); // Close the popup
      } 

    } catch (error) {
      console.error("Error submitting response:", error.response?.data || error);
      if (error.response) {
        toast.error(error.response.data.error || "Something went wrong.", {
          className: "custom-toast",
        });
      } 
    }
  };




  const handleFeedback = async (e) => {
    e.preventDefault();

    const feedbackData = {
      description: formData.description,
    };

    try {
      const response = await submitFeedbackResponse(feedbackData);
      if (response.status === 200) {
        alert("Response Submitted Successfully");
      }
    } catch (error) {
      alert("Failed to submit response");
      console.error(error);
      throw error;
    }
  };

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
          <span className={getStatusClass(status)} style={{ fontSize: "16px" }}>{recordDetails?.status || "Unknown"}</span>

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
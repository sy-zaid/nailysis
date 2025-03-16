import React from "react";
import { useState } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:8000/api/feedback"; // Update with actual API URL
import styles from "./popup-feedback.module.css";

// Feedback Submission Screen
const SubmitFeedback = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async () => {
    await axios.post(`${API_BASE_URL}/submit`, { category, message });
    navigate("/my-feedback");
  };
  return (
    
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>

      <div className={styles.formContainer}>

        <div className={styles.headerSection}>

          <div className={styles.titleSection}>
            <h2 style={{ marginLeft: "20px" }}>Feedbacks</h2> 
            <p style={{ marginLeft: "20px" }}>Select a category and submit your feedback to help us improve our services.</p>
          </div>

        </div>

        <hr />

        <div className={styles.popupBottom}>
          
          <label>Select a Category</label>
          <select
          style={{  }}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Service Issue">Service Issue</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Billing Issue">Billing Issue</option>
          </select>

          <label style={{ marginLeft: "-67.5%" }}>Enter Feedback</label>
          <textarea
            placeholder="Write your feedback here..." 
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className={styles.actions} style={{ marginTop: "50px" }}>

            <button 
              className={styles.cancelButton}
              onClick={() => setPopupTrigger(false)}
              >
                Cancel
            </button>

            <button
              className={styles.addButton}
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>
        
        </div>

      </div>

    </Popup>
  );
};

export default SubmitFeedback;





{/* 
      <div className="p-5">
        <h2 className="text-xl font-bold">Submit Feedback</h2>

        <select
          className="border p-2"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Service Issue">Service Issue</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Billing Issue">Billing Issue</option>
        </select>
        <textarea
          className="border p-2 w-full mt-2"
          placeholder="Enter your feedback..." 
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 mt-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div> */}

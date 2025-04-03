import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:8000/api/feedback"; // Update with actual API URL
import styles from "./popup-feedback.module.css";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import {
  calculateAge,
  getAccessToken,
  getRole,
  handleInputChange,
} from "../../../utils/utils.js";
import {
  submitFeedback,
  getFeedbackCategories,
} from "../../../api/feedbacksApi.js";



// Feedback Submission Screen
const SubmitFeedback = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = getAccessToken();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const onInputChange = handleInputChange(setFormData);
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form behavior
  
    const feedbackData = {
      category: formData.category,
      description: formData.description, //  Fix: Send "description" instead of "message"
      is_clinic_feedback: true, //  Change based on feedback type
    };
  
    try {
      const response = await submitFeedback(feedbackData);
      if (response.status === 201) {
        alert("Feedback submitted successfully!");
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };
  
  const handleFeedback = async (e) => {
    e.preventDefault();

    const feedbackData = {
      category: formData.category,
      description: formData.description,
      is_clinic_feedback: "True"           //This needs to be updated
    };

    try {
      const response = await submitFeedback(feedbackData);
      if (response.status === 200) {
        alert("Feedback Submitted Successfully");
      }
    } catch (error) {
      alert("Failed to submit feedback");
      console.error(error);
      throw error;
    }
  };


  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getFeedbackCategories();
        console.log("Categories", response.data)
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        throw error;
      }
    };

    fetchCategories();
  }, [token]);
  return (

    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>

      <div className={styles.formContainer} style={{ marginTop: "-12%" }}>

        <div className={styles.headerSection}>

          <div className={styles.titleSection}>
            <h2 style={{ marginLeft: "20px" }}>Feedbacks</h2>
            <p style={{ marginLeft: "20px" }}>Select a category and submit your feedback to help us improve our services.</p>
          </div>

        </div>

        <hr />

        <div className={styles.popupBottom}>
          
          <label className={styles.submitFeedbackLabel}>Select a Category</label>
          <select
          style={{ marginLeft: "23px" }}
              name="category"
              value={formData.category}
              onChange={onInputChange}
          >
            <option value="">Select Category</option>
            {categories.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <label className={styles.submitFeedbackLabel}>Enter Feedback</label>
          <textarea
            name="description"
            placeholder="Write your feedback here..."
            onChange={onInputChange}
            value={formData.description}
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

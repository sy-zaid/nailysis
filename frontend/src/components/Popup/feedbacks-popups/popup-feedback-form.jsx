import React from "react";
import { useState } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:8000/api/feedback"; // Update with actual API URL

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
      </div>
    </Popup>
  );
};

export default SubmitFeedback;

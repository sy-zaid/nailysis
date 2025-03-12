import React, { useState } from "react";
import Popup from "../Popup.jsx";

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

  // Using the first feedback entry for display (for now)
  const feedback = feedbackList[0];

  const handleResponse = () => {
    console.log("Response Submitted:", { response, status });
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className="p-5">
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
      </div>
    </Popup>
  );
};

export default FeedbackResponse;

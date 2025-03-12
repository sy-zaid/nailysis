import React from "react";
import PopupFeedbackForm from "../../components/Popup/feedbacks-popups/popup-feedback-form";
import PopupFeedbackResponse from "../../components/Popup/feedbacks-popups/popup-feedback-response";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleOpenPopup, handleClosePopup } from "../../utils/utils";

const API_BASE_URL = "http://localhost:8000/api/feedback"; // Update with actual API URL

// My Feedback Screen
const SendFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // Track open action menu
  const [popupContent, setPopupContent] = useState(); // Store popup content
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/my-feedback`)
      .then((res) => setFeedbackList(res.data));
  }, []);

  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on`, recordDetails);
    setMenuOpen(null, menuOpen, setMenuOpen); // Close action menu

    if (action === "Submit Feedback") {
      setPopupContent(<PopupFeedbackForm onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "Respond To Feedback") {
      setPopupContent(<PopupFeedbackResponse onClose={handleClosePopup} />);
      setShowPopup(true);
    }
  };
  return (
    <div className="p-5">
      {showPopup && popupContent}
      <button onClick={() => handleActionClick("Submit Feedback")}>
        Submit New Feedback
      </button>
      <button onClick={() => handleActionClick("Respond To Feedback")}>
        Respond To Feedback
      </button>
      <h2 className="text-xl font-bold">My Feedbacks History</h2>
      <table className="border w-full mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.category}</td>
              <td>{f.status}</td>
              <td>
                <Link to={`/feedback/${f.id}`} className="text-blue-500">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SendFeedback;

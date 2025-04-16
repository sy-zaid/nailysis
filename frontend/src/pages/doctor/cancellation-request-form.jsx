/**
 * @fileoverview CancellationRequestForm Component
 * 
 * @description
 * This component provides a form for users (likely doctors) to request the cancellation 
 * of an appointment. It uses a popup modal for user interaction and sends the request 
 * to the backend API with a reason for cancellation.
 * 
 * @component CancellationRequestForm
 * @param {string} appointmentId - The ID of the appointment to be canceled.
 * 
 * @author [Your Name] (optional)
 * @lastModified [Date]
 */

import React, { useState } from "react";
import axios from "axios";
import Popup from "../../components/Popup/Popup"; // Reusable Popup component
import { toast } from "react-toastify";

/**
 * CancellationRequestForm Component
 * 
 * Provides a popup form to request the cancellation of an appointment.
 * 
 * @param {Object} props
 * @param {string} props.appointmentId - The ID of the appointment to be canceled.
 * 
 * @returns {JSX.Element} A modal form for submitting a cancellation request.
 */
const CancellationRequestForm = ({ appointmentId, onClose }) => {
  // State variables to handle form data, messages, and errors
  const [reason, setReason] = useState(""); // Stores the reason for cancellation
  const [message, setMessage] = useState(""); // Stores success message
  const [error, setError] = useState(""); // Stores error messages
  const [popupTrigger, setPopupTrigger] = useState(true); // Controls popup visibility

  /**
   * Handles form submission and sends a cancellation request to the backend.
   * 
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.warning("Please Provide A Reason For Cancellation", { className: "custom-toast" });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/${appointmentId}/request_cancellation/`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Token-based authentication
          },
        }
      );

      toast.success("Cancellation Request Sent successfully!", {
        className: "custom-toast",
      });
      onClose(); // Close the popup
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error || "Failed to Submit Cancellation Request. Please Try Again.", {
          className: "custom-toast",
        });
      } else {
        toast.error("Network Error", {className: "custom-toast"})
      }
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div>
        <h2>Request Appointment Cancellation</h2>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        {/* Cancellation form */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="reason">Reason for Cancellation:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Cancellation Request</button>
        </form>
      </div>
    </Popup>
  );
};

export default CancellationRequestForm;

/**
 * USAGE:
 * 
 * <CancellationRequestForm appointmentId="12345" />
 * 
 * This component should be used in a page where doctors or staff can request 
 * appointment cancellations, and it will send the request to the backend API.
 */

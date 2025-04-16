import React, { useState } from "react";
import axios from "axios";
import Popup from "../../components/Popup/Popup";
import styles from "./cancellation-request-form.module.css";
import { toast } from "react-toastify";

const CancellationRequestForm = ({ onClose, appointmentId }) => {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [popupTrigger, setPopupTrigger] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.warning("Please Provide A Reason For Cancellation", { className: "custom-toast" });
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/doctor_appointments/${appointmentId}/request_cancellation/`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      toast.success("Cancellation Request Sent successfully!", {
        className: "custom-toast",
      });
      onClose(); // Close the popup
    } catch (err) {
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
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.headerSection}>
          <div className={styles.titleSection}>
            <h2 style={{ marginLeft: "20px" }}>
              Request Appointment Cancellation
            </h2>
            <p style={{ marginLeft: "20px" }}>
              Please provide a reason for requesting cancellation of this
              appointment.
            </p>
          </div>
        </div>

        <hr />

        <div className={styles.popupBottom}>
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formSection}>
            <h3>
              <i className="fa-solid fa-circle fa-2xs"></i> Cancellation Request
              Details
            </h3>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="reason" style={{ marginLeft: "26px" }}>
                  Reason for Cancellation:
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please explain in detail why you need to cancel this appointment..."
                  required
                  style={{ marginLeft: "26px", width: "calc(100% - 52px)" }}
                />
              </div>

              <div className={styles.actions}>
                <button type="submit">Submit Request</button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default CancellationRequestForm;

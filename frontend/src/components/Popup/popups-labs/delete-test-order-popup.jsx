import React, { useState, useEffect } from "react";
import styles from "../all-popups-styles.module.css";
import { toast } from "react-toastify";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import { deleteTestOrder } from "../../../api/labsApi.js";

const PopupDeleteTestOrder = ({ onClose, testOrderDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  console.log("ORDER DELETE DETAILS", testOrderDetails);

  const handleDeleteTestOrder = async () => {
    try {
      const response = await deleteTestOrder(testOrderDetails.id);

      if (response.status === 204) {
        toast.success("Test Order Deleted Successfully", {
          className: "custom-toast",
        });
        navigate("");
      } else {
        toast.warn("Unexpected response from server", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.error || "Failed to delete test order.",
          {
            className: "custom-toast",
          }
        );
      } else {
        toast.error("Network error! Please try again.", {
          className: "custom-toast",
        });
      }
      console.error("Delete Test Order Error:", error);
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
              <h2>Delete Test Order</h2> 
              <p>Permanently remove this test order and its details if they’re no longer needed.</p>
          </div>

        </div>

        <hr />

        <div className={styles.popupBottom}>

          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Test Order Details</h3>
            <div className={styles.formGroup}>
              <div>
                <label>Test Order ID:</label>
                <span>{testOrderDetails.id || "N/A"}</span>
              </div>
              <div>
                <label>Patient Name:</label>
                <span>
                  {
                    testOrderDetails?.lab_technician_appointment?.patient?.user
                      ?.first_name
                  }{" "}
                  {
                    testOrderDetails?.lab_technician_appointment?.patient?.user
                      ?.last_name
                  }
                </span>
              </div>
              <div>
                <label>Requested Tests:</label>
                <span>
                  {testOrderDetails?.test_types
                    ?.map((test) => test.label)
                    .join(", ") || "N/A"}
                </span>
              </div>
              <div>
                <label>Test Status:</label>
                <span>{testOrderDetails?.test_status || "N/A"}</span>
              </div>
              <div>
                <label>Results Available:</label>
                <span>{testOrderDetails.results_available ? "Yes" : "No"}</span>
              </div>
              <div>
                <label>Technician Name:</label>
                <span>
                  {testOrderDetails.lab_technician_appointment?.technician_name ||
                    "N/A"}
                </span>
              </div>
              <div>
                <label>Technician Specialization:</label>
                <span>
                  {testOrderDetails.lab_technician_appointment
                    ?.technician_specialization || "N/A"}
                </span>
              </div>
              <div>
                <label>Notes:</label>
                <span>
                  {testOrderDetails.lab_technician_appointment?.notes || "N/A"}
                </span>
              </div>
              <div>
                <label>Fee:</label>
                <span>
                  {testOrderDetails.lab_technician_appointment?.fee
                    ? `PKR ${testOrderDetails.lab_technician_appointment?.fee}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.addButton}
              onClick={handleDeleteTestOrder}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupDeleteTestOrder;

import React, { useState, useEffect } from "react";
import styles from "../all-popups-styles.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../../useCurrentUserData.jsx";

const PopupDeleteTestOrder = ({ onClose, testOrderDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const { data: curUser, isLoading, isError, error } = usePatientData();
  const [patient, setPatient] = useState([]);

  useEffect(() => {
    if (curUser && curUser.length > 0) {
      setPatient([curUser[0].user, curUser[0]]);
    } else {
      console.log("No patient data available");
    }
  }, [curUser]);

  const handleDeleteTestOrder = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/test_orders/${
          testOrderDetails.test_order_id
        }/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Test Order Deleted Successfully");
      navigate("");
    } catch (error) {
      alert("Failed to delete test order");
      console.error(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Delete Test Order</h2>
        </div>

        <h5 className={styles.subhead}>
          Are you sure you want to delete this test order?
        </h5>
        <hr />

        <div className={styles.formSection}>
          <h3>Test Order Details</h3>
          <div className={styles.formGroup}>
            <div>
              <label>Test Order ID</label>
              <input
                type="text"
                value={testOrderDetails.test_order_id || ""}
                disabled
              />
            </div>
            <div>
              <label>Patient Name</label>
              <input
                type="text"
                value={`${testOrderDetails?.patient?.user.first_name} ${testOrderDetails?.patient?.user.last_name}`}
                disabled
              />
            </div>
            <div>
              <label>Requested Tests</label>
              <input
                type="text"
                value={testOrderDetails?.requested_tests?.join(", ") || "N/A"}
                disabled
              />
            </div>
            <div>
              <label>Test Status</label>
              <input
                type="text"
                value={testOrderDetails.test_status || "N/A"}
                disabled
              />
            </div>
            <div>
              <label>Results Available</label>
              <input
                type="text"
                value={testOrderDetails.results_available ? "Yes" : "No"}
                disabled
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleDeleteTestOrder}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupDeleteTestOrder;
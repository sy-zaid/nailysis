import React, { useState } from "react";
import axios from "axios";
import Popup from "../Popup";

const PopupEHRDelete = ({ onClose, recordDetails }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const token = localStorage.getItem("access");

  const handleDeleteEHR = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/ehr_records/${recordDetails.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose(); // Close after delete
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Delete Record</h2>
        </div>

        <p style={styles.subhead}>Are you sure you want to delete this record?</p>

        <div style={styles.actions}>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.confirmButton} onClick={handleDeleteEHR}>
            Yes
          </button>
        </div>
      </div>
    </Popup>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  heading: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
  },
  subhead: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "25px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default PopupEHRDelete;

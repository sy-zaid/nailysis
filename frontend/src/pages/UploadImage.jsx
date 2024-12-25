import React from "react";
import styles from "./UploadImage.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Header from "../components/Dashboard/Header/Header";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
  const navigate = useNavigate();

  const handleUploadImage = () => {
    navigate("/image-guide");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageTop}>
        <Navbar />
        <Header curUserRole="Upload your nail images to get a health checkup" />
      </div>
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.uploadSection}>
          <h4>HOW DOES IT WORK?</h4>
          <ul>
            <li>
              Capture a Clear Image: Use your device's camera to capture a
              clear, focused image of the fingernail(s). Ensure the nail is
              well-lit, clean, and free of obstructions like nail polish or
              accessories.
            </li>
            <li>
              Upload the Image: Click the "Upload Image" button to select and
              upload the image of the fingernail(s) from your device.
            </li>
            <li>
              AI Analysis: Once the image is uploaded, our advanced AI-powered
              system will analyze the fingernail(s) to detect potential health
              conditions.
            </li>
            <li>
              View Results: After processing, you'll receive an
              easy-to-understand assessment and any detected health indicators.
              The results will also be integrated into the patient's Electronic
              Health Record (EHR) for future reference.
            </li>
            <li>
              Next Steps: If any potential issues are identified, the system
              will notify the clinician for further evaluation and
              recommendations.
            </li>
          </ul>
          <div className={styles.uploadContainer}>
          <img src="upload.png" alt="upload icon" />
          <h4>Upload Your Nails Images (Upto 5)</h4>
          <button onClick={handleUploadImage}>Start Diagnosis</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;

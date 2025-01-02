import React, { useState } from "react";
import styles from "./UploadImage.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import ImageGuide from "./ImageGuide";

const UploadImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.pageContainer} ${
          isModalOpen ? styles.blur : ""
        }`}
      >
        <div className={styles.pageTop}>
          <Navbar />
          <h1>Upload your nail images to get a health checkup</h1>
          <p>
            Here you can view and manage all time health records of the patients.
          </p>
        </div>
        <div className={styles.mainContent}>
          <Sidebar />
          <div className={styles.uploadSection}>
            <h4>HOW DOES IT WORK?</h4>
            <div className={styles.lst}>
              <ul>
                <li>
                  Capture a Clear Image: Use your device's camera to capture a
                  clear, focused image...
                </li>
                <li>
                  Upload the Image: Click the "Upload Image" button to select
                  and upload the image...
                </li>
                <li>
                  AI Analysis: Once the image is uploaded, our advanced
                  AI-powered system will analyze...
                </li>
                <li>
                  View Results: After processing, you'll receive an
                  easy-to-understand assessment...
                </li>
                <li>
                  Next Steps: If any potential issues are identified, the
                  system will notify the clinician...
                </li>
              </ul>
            </div>
            <div className={styles.box}>
              <div className={styles.uploadContainer}>
                <img src="upload.png" alt="upload icon" />
                <h4>Upload Your Nails Images (Upto 5)</h4>
                <button onClick={handleOpenModal}>Start Diagnosis</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modalWrapper}>
          <ImageGuide onClose={handleCloseModal} />
        </div>
      )}
    </>
  );
};

export default UploadImage;

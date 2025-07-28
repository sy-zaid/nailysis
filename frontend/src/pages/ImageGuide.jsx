import React from "react";
import styles from "./ImageGuide.module.css";

const ImageGuide = ({ onClose }) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        {/* <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button> */}
        <h1>Guide for Accurate Nail Image Diagnosis</h1>
        <p>
          Use the following images as a guide to ensure proper image capture for
          an accurate diagnosis...
        </p>

        <div className={styles.guideSection}>
          <h3>• Incorrect way of capturing</h3>
          <div className={styles.imageRow}>
            <img src="NailGroup1.png" alt="Incorrect examples" />
          </div>
        </div>

        <div className={styles.guideSection}>
          <h3>• Correct way of capturing</h3>
          <div className={styles.imageRow}>
            <img src="NailGroup2.png" alt="Correct examples" />
          </div>
        </div>
        <div className={styles.buttonWrap}>
          <button className={styles.uploadButton} onClick={onClose}>
            Proceed to Uploading Images
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGuide;

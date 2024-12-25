import React from "react";
import styles from "./ImageGuide.module.css";

const ImageGuide = () => {

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h3>Guide for Accurate Nail Image Diagnosis</h3>
        <p>
          Use the following images as a guide to ensure proper image capture for an accurate diagnosis. Be
          your own technician and follow each step carefully.
        </p>

        <div className={styles.guideSection}>
          <h4>• Incorrect way of capturing</h4>
          <div className={styles.imageRow}>
            <img src="NailGroup1.png" alt="" />
          </div>
        </div>

        <div className={styles.guideSection}>
          <h4>• Correct way of capturing</h4>
          <div className={styles.imageRow}>
            <img src="NailGroup2.png" alt="" />
          </div>
        </div>

        <button className={styles.uploadButton}>Start Uploading Images</button>
      </div>
    </div>
  );
};

export default ImageGuide;
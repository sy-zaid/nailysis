import React from "react";
import styles from "./UploadImage.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Header from "../components/Dashboard/Header/Header";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
  const navigate = useNavigate();

  const handleUploadImage = () => {
    navigate("/image-guide"); // Navigate to the image guide page
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
          <p>
            Lorem ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry’s standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className={styles.uploadContainer}>
          <img src="upload.png" alt="upload icon" />
          <h4>Upload Your Nails Images (Upto 5)</h4>
          <button onClick={handleUploadImage}>Start Diagnosis</button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;

import React, { useState, useCallback, useEffect } from "react";
import styles from "./UploadImage.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import ImageGuide from "./ImageGuide";
import NailysisReport from "./common/report";
import axios from "axios";
import { handleClosePopup, handleOpenPopup } from "../utils/utils";

const UploadImage = () => {
  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  useEffect(() => {
    setPopupContent(<ImageGuide onClose={() => setShowPopup(false)} />);
    setShowPopup(true); // Ensure popup is shown on page load
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    processFiles(selectedFiles);
  };

  const processFiles = useCallback(
    (newFiles) => {
      if (newFiles.length + files.length > 3) {
        alert("You can upload a maximum of 3 files at a time");
        return;
      }

      const validFiles = newFiles.filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
      );

      if (validFiles.length !== newFiles.length) {
        alert("Please upload only image files (max 5MB each)");
      }

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);

        const newPreviews = validFiles.map((file) => ({
          id: URL.createObjectURL(file),
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        }));

        setPreviews((prev) => [...prev, ...newPreviews]);
      }
    },
    [files.length]
  );

  const removeFile = (id) => {
    setFiles(files.filter((_, index) => previews[index].id !== id));
    setPreviews(previews.filter((preview) => preview.id !== id));

    const previewToRemove = previews.find((preview) => preview.id === id);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setAnalysisResults(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/nails/analyze/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              overall: progress,
            }));
          },
        }
      );
      console.log("RESULTS FROM MODEL PRED", response.data);
      setAnalysisResults(response.data);
      setPopupContent(
        <NailysisReport predictionResult={analysisResults}></NailysisReport>
      );
      setShowPopup(true);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  // useEffect(() => {
  //   setPopupContent(<NailysisReport predictionResult={analysisResults} />);
  //   setShowPopup(true);
  // }, []);

  return (
    <>
      {showPopup && popupContent}
      <div
        className={`${styles.pageContainer} ${isModalOpen ? styles.blur : ""}`}
      >
        <div className={styles.pageTop}>
          <Navbar />
          <h1>Upload your nail images to get a health checkup</h1>
          <p>
            Upload 2-3 clear images of your nails from different angles for best
            results.
          </p>
        </div>
        <div className={styles.mainContent}>
          <Sidebar />
          <div className={styles.uploadSection}>
            <h4>HOW DOES IT WORK?</h4>
            <div className={styles.lst}>
              <ul>
                <li>
                  <strong>Capture Clear Images:</strong> Take 2-3 photos of each
                  nail from different angles in good lighting.
                </li>
                <li>
                  <strong>Upload Images:</strong> Drag and drop or click to
                  select images (max 3 at a time).
                </li>
                <li>
                  <strong>AI Analysis:</strong> Our system will analyze your
                  nail health indicators.
                </li>
                <li>
                  <strong>View Results:</strong> Get comprehensive results with
                  actionable insights.
                </li>
              </ul>
            </div>
            <div
              className={`${styles.box} ${isDragging ? styles.dragging : ""}`}
            >
              <div
                className={styles.uploadContainer}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <span className={styles.uploadIcon}>&#x2913;</span>
                <h4>Upload Nail Images (2-3 recommended)</h4>
                <p className={styles.supportedFormats}>
                  Supports JPG, PNG (Max 5MB each)
                </p>

                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="file-upload" className={styles.uploadButton}>
                    Select Images
                  </label>
                  <p className={styles.dragText}>or drag and drop files here</p>
                </div>

                {previews.length > 0 && (
                  <div className={styles.previewContainer}>
                    <h5>Selected Files ({previews.length}/3):</h5>
                    <div className={styles.previewGrid}>
                      {previews.map((preview) => (
                        <div key={preview.id} className={styles.previewItem}>
                          <div className={styles.previewImageContainer}>
                            <img
                              src={preview.url}
                              alt="Preview"
                              className={styles.previewImage}
                            />
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => removeFile(preview.id)}
                            >
                              &times;
                            </button>
                          </div>
                          <div className={styles.fileInfo}>
                            <span className={styles.fileName}>
                              {preview.name}
                            </span>
                            <span className={styles.fileSize}>
                              {formatFileSize(preview.size)}
                            </span>
                          </div>
                          {uploadProgress[preview.id] === 100 && (
                            <div className={styles.uploadSuccess}>&#10004;</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className={styles.errorMessage}>{uploadError}</div>
                )}

                {isUploading && (
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${uploadProgress.overall || 0}%` }}
                    ></div>
                    <span>{uploadProgress.overall || 0}%</span>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  className={styles.diagnosisButton}
                  disabled={previews.length === 0 || isUploading}
                >
                  {isUploading ? "Uploading..." : "Start Diagnosis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modalWrapper}>
          <ImageGuide
            onClose={handleClosePopup(setShowPopup, setPopupContent)}
            // files={files}
            // results={analysisResults}
          />
        </div>
      )}
    </>
  );
};

export default UploadImage;

import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "./UploadImage.module.css";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import ImageGuide from "./ImageGuide";
import NailysisReport from "./common/report";
import axios from "axios";
import { handleClosePopup } from "../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to check if an image file can be loaded
const isValidImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });

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

  // For unique toast IDs
  const toastCounterRef = useRef(0);
  const getNextToastId = () => {
    toastCounterRef.current += 1;
    return `toast-id-${toastCounterRef.current}`;
  };

  useEffect(() => {
    setPopupContent(<ImageGuide onClose={() => setShowPopup(false)} />);
    setShowPopup(true); // Ensure popup is shown on page load
  }, []);

  const handleFileChange = (e) => {
    // Do not slice files so we can test the maximum files condition properly
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = useCallback(
    async (newFiles) => {
      // Maximum allowed check: total files should not exceed 5
      if (newFiles.length + files.length > 5) {
        toast.warning("You can upload a maximum of 5 images at a time", {
          toastId: getNextToastId(),
          className: "custom-toast",
        });
        return;
      }

      const validFiles = [];

      for (const file of newFiles) {
        // Only allow image files
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed", {
            toastId: getNextToastId(),
            className: "custom-toast",
          });
          continue;
        }
        // Check for corrupted or unreadable images (e.g., file size of 0)
        if (file.size <= 0) {
          toast.error("One or more images could not be read", {
            toastId: getNextToastId(),
            className: "custom-toast",
          });
          continue;
        }
        // Check file size limit (5MB each)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image file size must be 5MB or less", {
            toastId: getNextToastId(),
            className: "custom-toast",
          });
          continue;
        }
        // Attempt to load the file as an image
        const valid = await isValidImage(file);
        if (!valid) {
          toast.error("One or more images could not be read", {
            toastId: getNextToastId(),
            className: "custom-toast",
          });
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        return;
      }

      setFiles((prev) => [...prev, ...validFiles]);

      const newPreviews = validFiles.map((file) => {
        const objectURL = URL.createObjectURL(file);
        return {
          id: objectURL,
          url: objectURL,
          name: file.name,
          size: file.size,
        };
      });

      setPreviews((prev) => [...prev, ...newPreviews]);
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

  // Handle upload: if user hasn't selected any image or less than 3 images, warn the user.
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warning("No images selected. Please upload 3 to 5 nail images.", {
        className: "custom-toast",
      });
      return;
    } else if (files.length < 3) {
      toast.warning("Please upload at least 3 nail images", {
        toastId: getNextToastId(),
        className: "custom-toast",
      });
      return;
    }

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
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress((prev) => ({ ...prev, overall: progress }));
          },
        }
      );
      console.log("RESULTS FROM MODEL PRED", response.data);
      setAnalysisResults(response.data);
      setPopupContent(
        <NailysisReport
          onClose={handleClosePopup}
          analysisResult={response.data}
          uploadedImages={previews}
        />
      );
      setShowPopup(true);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload files. Please try again.");
      toast.error("Failed to upload files. Please try again.", {
        toastId: getNextToastId(),
        className: "custom-toast",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {showPopup && popupContent}
      <div className={styles.pageContainer}>
        <div className={styles.pageTop}>
          <Navbar />
          <h1>Upload your nail images to get a health checkup</h1>
          <p>Upload 3-5 clear images of your nails from different angles for best results.</p>
        </div>
        <div className={styles.mainContent}>
          <Sidebar />
          <div className={styles.uploadSection}>
            <h4>HOW DOES IT WORK?</h4>
            <div className={styles.lst}>
              <ul>
                <li>
                  <strong>Capture Clear Images:</strong> Take 3-5 photos of each nail from different angles in good lighting.
                </li>
                <li>
                  <strong>Upload Images:</strong> Drag and drop or click to select images.
                </li>
                <li>
                  <strong>AI Analysis:</strong> Our system will analyze your nail health indicators.
                </li>
                <li>
                  <strong>View Results:</strong> Get comprehensive results with actionable insights.
                </li>
              </ul>
            </div>
            <div className={`${styles.box} ${isDragging ? styles.dragging : ""}`}>
              <div
                className={styles.uploadContainer}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <span className={styles.uploadIcon}>&#x2915;</span>
                <h4>Upload Nail Images (3-5 recommended)</h4>
                <p className={styles.supportedFormats}>Supports JPG, PNG (Max 5MB each)</p>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="file-upload" className={styles.uploadButton}>Select Images</label>
                  <p className={styles.dragText}>or drag and drop files here</p>
                </div>
                {previews.length > 0 && (
                  <div className={styles.previewContainer}>
                    <h5>Selected Files ({previews.length}/5):</h5>
                    <div className={styles.previewGrid}>
                      {previews.map((preview) => (
                        <div key={preview.id} className={styles.previewItem}>
                          <div className={styles.previewImageContainer}>
                            <img src={preview.url} alt="Preview" className={styles.previewImage} />
                            <button type="button" className={styles.removeButton} onClick={() => removeFile(preview.id)}>
                              &times;
                            </button>
                          </div>
                          <div className={styles.fileInfo}>
                            <span className={styles.fileName}>{preview.name}</span>
                            <span className={styles.fileSize}>{formatFileSize(preview.size)}</span>
                          </div>
                          {uploadProgress[preview.id] === 100 && (
                            <div className={styles.uploadSuccess}>&#10004;</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {uploadError && <div className={styles.errorMessage}>{uploadError}</div>}
                {isUploading && (
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${uploadProgress.overall || 0}%` }}
                    ></div>
                    <span>{uploadProgress.overall || 0}%</span>
                  </div>
                )}
                <button onClick={handleUpload} className={styles.diagnosisButton} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Start Diagnosis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modalWrapper}>
          <ImageGuide onClose={handleClosePopup(setShowPopup, setPopupContent)} />
        </div>
      )}
    </>
  );
};

export default UploadImage;

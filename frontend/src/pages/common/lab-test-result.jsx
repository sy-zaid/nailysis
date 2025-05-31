//lab-test-result.jsx
import React, { useState, useEffect } from "react";
import {
  getTestResultsByTestId,
  markResultFinalized,
  saveAdminComment,
} from "../../api/labsApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./lab-test-result.module.css";
import logo from "../../../public/nailysis-logo-small.png";
import Modal from "react-modal";

Modal.setAppElement("#root");

const LabTestResult = () => {
  const [labTestResult, setLabTestResult] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { reportId } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [resultFiles, setResultFiles] = useState([]);
  const [allResultFiles, setAllResultFiles] = useState([]);

  useEffect(() => {
    const fetchLabTestResult = async () => {
      try {
        const response = await getTestResultsByTestId(reportId);
        const resultData = response.data[0];
        setLabTestResult(resultData);

        // Combine all result files from both fields
        const files = [];

        // Add the main result_file if it exists
        if (resultData?.result_file) {
          files.push(resultData.result_file);
        }

        // Add additional images from imaging_results array if it exists

        //outputs not loaded image
        if (
          resultData?.imaging_results &&
          Array.isArray(resultData.imaging_results)
        ) {
          // Assuming the imaging_results array contains filenames that need to be prefixed with the media URL
          const baseUrl = `${import.meta.env.VITE_API_URL}/media/lab_results/`;
          resultData.imaging_results.forEach((filename) => {
            files.push(baseUrl + filename);
          });
        }

        setAllResultFiles(files);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLabTestResult();
  }, [reportId]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      toast.warn("Comment cannot be empty.", { className: "custom-toast" });
      return;
    }
    try {
      const payload = { admin_comment: comment };
      const response = await saveAdminComment(reportId, payload);
      if (response.status === 200) {
        toast.success("Comment added successfully!", {
          className: "custom-toast",
        });
        setComment("");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || "Failed to add comment", {
          className: "custom-toast",
        });
      } else {
        toast.error("Network error. Please try again.", {
          className: "custom-toast",
        });
      }
    }
  };

  const handleMarkFinalized = async (event) => {
    event.preventDefault();

    if (!reportId) {
      toast.error("Missing report ID", { className: "custom-toast" });
      return;
    }

    try {
      const response = await markResultFinalized(reportId);
      if (response.status === 200) {
        toast.success("Test report finalized successfully", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      if (error.response) {
        const errorMsg =
          error.response.data.error ||
          error.response.data.message ||
          "Failed to finalize report";
        toast.error(errorMsg, { className: "custom-toast" });
      } else {
        toast.error("Network error. Please try again.", {
          className: "custom-toast",
        });
      }
      console.error("Finalization error:", error);
    }
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const navigateImage = (direction) => {
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = resultFiles.length - 1;
    if (newIndex >= resultFiles.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  const getFileType = (fileUrl) => {
    if (!fileUrl) return "unknown";
    const extension = fileUrl.split(".").pop().toLowerCase();
    return extension === "pdf" ? "pdf" : "image";
  };

  if (loading) return <p className={styles.loading}>Loading report...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <div className="top">
        <h1>Diagnosis Report</h1>
        <p>View diagnosis results and submit comments</p>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Nailysis - Lab Test Report</h1>
        <img src={logo} alt="Nailysis Logo" className={styles.logo} />
      </header>
      <div className={styles.content}>
        <p>
          <strong>Test Order ID:</strong> {labTestResult?.id || "N/A"}
        </p>
        <p>
          <strong>Reviewed By:</strong>{" "}
          {labTestResult?.reviewed_by || "Not reviewed yet"}
        </p>
        <p>
          <strong>Status:</strong> {labTestResult?.result_status || "Unknown"}
        </p>

        {labTestResult?.numeric_results &&
          Object.keys(labTestResult.numeric_results).length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Numeric Results</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(labTestResult.numeric_results).map(
                    ([test, details]) => (
                      <tr key={test}>
                        <td>{test}</td>
                        <td>{details.value || "-"}</td>
                        <td>{details.unit || "-"}</td>
                        <td>{details.range || "-"}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

        {allResultFiles.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Result Images</h2>
            <div className={styles.filesContainer}>
              {allResultFiles.map((file, index) => (
                <div key={index} className={styles.filePreviewWrapper}>
                  <div
                    className={styles.imageThumbnail}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setModalIsOpen(true);
                    }}
                  >
                    <img
                      src={file}
                      alt={`Test result ${index + 1}`}
                      className={styles.thumbnailImage}
                    />
                  </div>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadLink}
                  >
                    <i className="fas fa-download"></i> Download
                  </a>
                  <span className={styles.imageName}>
                    {file.split("/").pop()}
                  </span>
                </div>
              ))}
            </div>

            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Image Viewer"
              className={styles.modal}
              overlayClassName={styles.overlay}
            >
              <button onClick={closeModal} className={styles.closeButton}>
                <i className="fas fa-times"></i>
              </button>

              {allResultFiles.length > 1 && (
                <div className={styles.navigationButtons}>
                  <button
                    onClick={() => {
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + allResultFiles.length) %
                          allResultFiles.length
                      );
                    }}
                    className={styles.navButton}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <span className={styles.imageCounter}>
                    {currentImageIndex + 1} / {allResultFiles.length}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % allResultFiles.length
                      );
                    }}
                    className={styles.navButton}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}

              <img
                src={allResultFiles[currentImageIndex]}
                alt={`Test result ${currentImageIndex + 1}`}
                className={styles.fullscreenImage}
              />
            </Modal>
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className={styles.form}>
          <label htmlFor="admin_comment" className={styles.label}>
            Lab Admin Comments:
          </label>
          <textarea
            id="admin_comment"
            name="admin_comment"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
          />
          <button type="submit" className={styles.button}>
            Save Comment
          </button>
          <button onClick={handleMarkFinalized} className={styles.button}>
            Mark as Finalized
          </button>
        </form>
      </div>
    </div>
  );
};

export default LabTestResult;

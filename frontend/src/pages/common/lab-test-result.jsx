import React, { useState, useEffect } from "react";
import {
  getTestResultsById,
  markResultFinalized,
  saveAdminComment,
} from "../../api/labsApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./lab-test-result.module.css";
import logo from "../../../public/nailysis-logo-small.png";
import Modal from "react-modal"; // Import modal for fullscreen viewing

// Set app element for accessibility (needed for react-modal)
Modal.setAppElement('#root');

const LabTestResult = () => {
  const [labTestResult, setLabTestResult] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { reportId } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    const fetchLabTestResult = async () => {
      try {
        const response = await getTestResultsById(reportId);
        setLabTestResult(response.data[0]);
        // Determine file type if result_file exists
        if (response.data[0]?.result_file) {
          const fileUrl = response.data[0].result_file;
          const extension = fileUrl.split('.').pop().toLowerCase();
          setFileType(extension === 'pdf' ? 'pdf' : 'image');
        }
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (loading) return <p className={styles.loading}>Loading report...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Nailysis Logo" className={styles.logo} />
        <h1 className={styles.title}>Nailysis - Lab Test Report</h1>
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

        {labTestResult?.result_file && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Result File</h2>
            <div className={styles.filePreviewContainer}>
              {fileType === 'pdf' ? (
                <>
                  <div className={styles.pdfThumbnail} onClick={openModal}>
                    <i className="fas fa-file-pdf" style={{ fontSize: '48px', color: '#e74c3c' }}></i>
                    <span>View PDF</span>
                  </div>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="PDF Viewer"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                  >
                    <button onClick={closeModal} className={styles.closeButton}>
                      <i className="fas fa-times"></i>
                    </button>
                    <iframe 
                      src={labTestResult.result_file} 
                      title="PDF Viewer"
                      className={styles.pdfViewer}
                    />
                  </Modal>
                </>
              ) : (
                <>
                  <div className={styles.imageThumbnail} onClick={openModal}>
                    <img 
                      src={labTestResult.result_file} 
                      alt="Test result" 
                      className={styles.thumbnailImage}
                    />
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
                    <img 
                      src={labTestResult.result_file} 
                      alt="Test result" 
                      className={styles.fullscreenImage}
                    />
                  </Modal>
                </>
              )}
              <a
                href={labTestResult.result_file}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadLink}
              >
                <i className="fas fa-download"></i> Download
              </a>
            </div>
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
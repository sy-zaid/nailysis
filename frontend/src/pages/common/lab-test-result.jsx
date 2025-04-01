import React, { useState, useEffect } from "react";
import {
  getTestResultsById,
  markResultFinalized,
  saveAdminComment,
} from "../../api/labsApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./lab-test-result.module.css";
import logo from "../../../public/nailysis-logo-small.png"; // Ensure the logo in this path

const LabTestResult = () => {
  const [labTestResult, setLabTestResult] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { reportId } = useParams();

  useEffect(() => {
    const fetchLabTestResult = async () => {
      try {
        const response = await getTestResultsById(reportId);
        setLabTestResult(response.data[0]);
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
    try {
      const response = await markResultFinalized(reportId);
      console.log(response);
      if (response.status === 200) {
        toast.success("Test report marked as finalized and cannot be changed", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.error || "Failed to mark as finalized",
          {
            className: "custom-toast",
          }
        );
      } else {
        toast.error("Network error. Please try again.", {
          className: "custom-toast",
        });
      }
    }
  };

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
          <strong>Test Order ID:</strong>{" "}
          {labTestResult?.test_order?.id || "N/A"}
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
            <a
              href={labTestResult.result_file}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Download Report
            </a>
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

import React, { useEffect } from "react";
import { useState } from "react";
import styles from "./report.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup";

// Importing recharts sample component
import PieChartRes from "../../components/ReCharts/pie-chart";
import BarChartRes from "../../components/ReCharts/bar-chart";
import RadarChartRes from "../../components/ReCharts/radar-chart";
import BarChartStackedRes from "../../components/ReCharts/bar-chart-stacked";
import SankeyRes from "../../components/ReCharts/sankey";
import PieChartVoteRes from "../../components/ReCharts/pie-charts-vote";
import {
  calculateAge,
  getFormattedCurrentTime,
  getRole,
} from "../../utils/utils";
import { getNailysisResultsFromId } from "../../api/nailysisApi";

const NailysisReport = ({
  onClose,
  analysisResult,
  reportId,
  uploadedImages,
}) => {
  const [popupTrigger, setPopupTrigger] = useState(true);

  // ----- USER INFORMATION
  const curUserRole = getRole();
  // ----- IMPORTANT DATA
  const [predictionResult, setPredictionResult] = useState(() => ({
    individual_predictions: [],
    combined_result: [],
    patient_details: null,
    images: [],
    other_details: {
      final_prediction: "",
      scanned_on: "",
      scanned_by: "",
      total_images: 0,
      total_conditions_detected: 0,
    },
    ...(analysisResult || {}),
  }));

  const fetchNailysisReport = async (reportId) => {
    try {
      const response = await getNailysisResultsFromId(reportId);
      console.log("FECTHING REPORT...", response.data);
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);

      // Handle different error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          throw new Error("Report not found");
        } else if (error.response.status === 500) {
          throw new Error("Server error while fetching report");
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response from server");
      } else {
        // Something happened in setting up the request
        throw new Error("Error setting up request");
      }
    }
  };
  useEffect(() => {
    if (reportId) {
      fetchNailysisReport(reportId);
    }
  }, []);
  console.log("Prediction Result", predictionResult);
  const imageData = predictionResult.images || [];
  const patient_details = predictionResult.patient_details;
  const combined = predictionResult.combined_result;
  const other_details = predictionResult.other_details;

  const diseaseConfidences = {};

  predictionResult.individual_predictions.forEach((prediction) => {
    prediction.top_classes.forEach((classInfo) => {
      if (!diseaseConfidences[classInfo.predicted_class]) {
        diseaseConfidences[classInfo.predicted_class] = [];
      }
      diseaseConfidences[classInfo.predicted_class].push(classInfo.confidence);
    });
  });

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* <div className={styles.sidebar}>
        </div>  */}

          <div className={styles.mainContent}>
            <div className={styles.reportContainer}>
              <h1 className={styles.reportTitle}>Diagnosis Report</h1>
              <p className={styles.reportSubtitle}>
                View your diagnosis results, download, or share with doctors and
                technicians
              </p>

              <div className={styles.reportCard}>
                <div className={styles.reportHeader}>
                  <div className={styles.headerLeft}>
                    <h2 className={styles.clinicName}>
                      Nailysis Disease Detection
                    </h2>
                    <address className={styles.clinicAddress}>
                      ST-13 Abul Hasan Isphahani Rd, Block 7<br />
                      Gulshan-e-Iqbal, Karachi, Karachi City,
                      <br />
                      Sindh 75300
                    </address>
                    <div className={styles.contactInfo}>
                      Contact: 021 12345678
                    </div>
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.logo}>
                      <img src="nailysis-logo-small.png" alt="logo" />
                    </div>
                  </div>
                </div>
                <div className={styles.divider}></div>

                {patient_details && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                      <span className={styles.dot}></span> Patient Information
                    </h3>

                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <h4>Patient ID</h4>
                        <p>{patient_details?.user?.user_id || "N/A"}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <h4>Patient Name</h4>
                        <p>
                          {patient_details?.user?.first_name || "N/A"}{" "}
                          {patient_details?.user?.last_name || "N/A"}
                        </p>
                      </div>
                      <div className={styles.infoItem}>
                        <h4>Age</h4>
                        <p>
                          {calculateAge(patient_details?.date_of_birth) ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <h4>Gender</h4>
                        <p>{patient_details?.gender || "N/A"}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <h4>Test Request</h4>
                        <p>Nailysis Disease Detection</p>
                      </div>
                    </div>
                  </section>
                )}

                <div className={styles.divider}></div>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.dot}></span> Nailysis Disease
                    Detection
                  </h3>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h4>Current Result</h4>
                      <p>{other_details.final_prediction}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Scanned On</h4>
                      <p>{other_details.scanned_on}</p>
                    </div>
                    {!reportId && (
                      <div className={styles.infoItem}>
                        <h4>Scanned By</h4>
                        <p>{other_details.scanned_by}</p>
                      </div>
                    )}
                    <div className={styles.infoItem}>
                      <h4>Total Images Provided</h4>
                      <p>{other_details.total_images}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Total Conditions Detected</h4>
                      <p>{other_details.total_conditions_detected}</p>
                    </div>
                  </div>

                  <div className={styles.infoGrid}></div>
                </section>

                <div className={styles.divider}></div>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.dot}></span> Uploaded Images and
                    their individual results
                  </h3>
                  {/* Image rendering part to use uploadedImages when url is null */}
                  <div className={styles.imagesGrid}>
                    {imageData.map((image, index) => {
                      const topPrediction =
                        predictionResult.individual_predictions[index]
                          ?.top_classes[0];
                      const confidencePercentage = topPrediction
                        ? Math.round(topPrediction.confidence * 100)
                        : 0;
                      const diseaseName =
                        topPrediction?.predicted_class || "Unknown";

                      return (
                        <div key={index} className={styles.imageResult}>
                          <div className={styles.imageBox}>
                            {image.url ? (
                              <img
                                src={image.url}
                                alt={`Uploaded nail ${index + 1}`}
                              />
                            ) : uploadedImages && uploadedImages[index] ? (
                              <img
                                src={uploadedImages[index].url}
                                alt={`Uploaded nail ${index + 1}`}
                              />
                            ) : (
                              <div className={styles.imagePlaceholder}>
                                <span>Image {index + 1}</span>
                              </div>
                            )}
                          </div>

                          <div className={styles.predictionLabel}>
                            <strong>{diseaseName}</strong> (
                            {confidencePercentage}% confidence)
                          </div>

                          <div className={styles.progressBarContainer}>
                            <div
                              className={styles.progressBar}
                              style={{ width: `${confidencePercentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <div className={styles.divider}></div>

                <div>
                  <section className={styles.chartSection}>
                    <h3 className={styles.sectionTitle}>
                      <span className={styles.dot}></span>
                      Disease Votes and Confidence Comparisons
                    </h3>
                    <p className={styles.description}>
                      Shows how many votes each disease received and compares
                      overall confidence levels across all diseases to highlight
                      the most likely prediction.
                    </p>

                    {/* Container for all charts */}
                    <div className={styles.chartContainer}>
                      {/* Wrapper for the first two charts */}
                      <div className={styles.chartsWrapper}>
                        {/* First chart */}
                        <div className={styles.chartWrapper}>
                          {/* <h2 className={styles.chartSubtitle}>
                            Pie Chart Vote
                          </h2> */}
                          <div className={styles.chartContent}>
                            <PieChartVoteRes data={combined} />
                          </div>
                        </div>

                        {/* Second chart */}
                        <div className={styles.chartWrapper}>
                          {/* <h2 className={styles.chartSubtitle}>Radar Chart</h2> */}
                          <div className={styles.chartContent}>
                            <RadarChartRes allClassConfidences={combined} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.divider}></div>

                      {/* Third chart (Sankey Chart) in a separate div */}
                      <div className={styles.sankeyWrapper}>
                        <h3 className={styles.sectionTitle}>
                          <span className={styles.dot}></span>
                          Flow of possible diseases towards final result
                        </h3>
                        <p className={styles.description}>
                          Visualizes the flow of confidence from all possible
                          classes to the final prediction. It helps understand
                          how votes and confidence are distributed.
                        </p>
                        <div
                          className={`${styles.chartContent} ${styles.sankeyContent}`}
                        >
                          <SankeyRes predictionResult={predictionResult} />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className={styles.divider}></div>
                <section>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.dot}></span>
                    Top Predictions
                  </h3>
                  <p className={styles.description}>
                    Shows a vertical bar for each predicted disease with height
                    based on confidence. Simple view to quickly identify top
                    predictions.
                  </p>
                  <BarChartRes data={combined} />

                  <div className={styles.divider}></div>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.dot}></span>
                    Comparision of Predictions with Max Confidences
                  </h3>
                  <p className={styles.description}>
                    Stacked bar chart to visualize the weight of predicted
                    classes confidences and the max confidence.
                  </p>
                  <BarChartStackedRes data={combined} />
                </section>
                <div className={styles.divider}></div>
                <div className={styles.disclaimer}>
                  <p>
                    Note: It is not a definitive medical diagnosis and should be
                    used to assist healthcare providers in identifying potential
                    issues for further investigation. Clinical assessments and
                    lab tests are required for accurate diagnosis.
                  </p>
                  <br />
                  <br />
                  <p
                    className={styles.disclaimerText}
                    style={{ fontWeight: "bold" }}
                  >
                    This is a computer generate NailysisReport and does not
                    require any signatures.
                  </p>
                </div>

                <div className={styles.divider}></div>

                <section className={styles.section}>
                  <div className={styles.signatures}>
                    <div className={styles.signatureGrid}>
                      <div className={styles.signatureItem}>
                        <p style={{ fontStyle: "italic", color: "#4e4e4e" }}>
                          Dr. Naeem Iqbal
                        </p>
                        <p
                          style={{ fontStyle: "italic", color: "#4e4e4e" }}
                          className={styles.credentials}
                        >
                          MBBS, FCPS
                        </p>
                      </div>
                      <div className={styles.signatureItem}>
                        <p style={{ fontStyle: "italic", color: "#4e4e4e" }}>
                          Dr. Sarah Zafar
                        </p>
                        <p
                          style={{ fontStyle: "italic", color: "#4e4e4e" }}
                          className={styles.credentials}
                        >
                          MBBS, FCPS
                        </p>
                      </div>
                      <div className={styles.signatureItem}>
                        <p
                          style={{ fontStyle: "italic", color: "#4e4e4e" }}
                          className={styles.teamTitle}
                        >
                          The Nailysis Team
                        </p>
                        <p
                          style={{ fontStyle: "italic", color: "#4e4e4e" }}
                          className={styles.credentials}
                        >
                          Software Engineers
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className={styles.actionButtons}>
                <div className={styles.leftButtons}>
                  <button className={styles.downloadButton}>
                    <img
                      className={styles.downloadIcon}
                      src="./download.png"
                      alt=""
                    />
                    Download PDF
                  </button>
                  <button className={styles.shareButton}>
                    <img
                      className={styles.downloadIcon}
                      src="./share.png"
                      alt="share"
                    />
                    Share Report
                  </button>
                </div>
                <button className={styles.appointmentButton}>
                  Book Appointment
                </button>
              </div>

              <div className={styles.feedbackLink}>
                <a href="#">Do you want to submit your feedback?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default NailysisReport;

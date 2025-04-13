import React from "react";
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
import GaugeChartRes from "../../components/ReCharts/guage-chart";

import BoxPlotRes from "../../components/ReCharts/box-plot";
import SankeyRes from "../../components/ReCharts/sankey";
import PieChartVoteRes from "../../components/ReCharts/pie-charts-vote";
import ProgressBarChart from "../../components/ReCharts/progress-bar";
import { calculateAge } from "../../utils/utils";

const NailysisReport = ({ onClose, predictionResult }) => {
  // predictionResult = {
  //   individual_predictions: [
  //     {
  //       top_classes: [
  //         {
  //           class_index: 4,
  //           predicted_class: "koilonychia",
  //           confidence: 0.9999979734420776,
  //         },
  //         {
  //           class_index: 8,
  //           predicted_class: "onychogryphosis",
  //           confidence: 0.00000195485404219653,
  //         },
  //         {
  //           class_index: 10,
  //           predicted_class: "onychomycosis",
  //           confidence: 1.167044416661156e-7,
  //         },
  //       ],
  //     },
  //     {
  //       top_classes: [
  //         {
  //           class_index: 5,
  //           predicted_class: "melanoma",
  //           confidence: 0.9999997615814209,
  //         },
  //         {
  //           class_index: 6,
  //           predicted_class: "muehrckes Lines",
  //           confidence: 1.544823788890426e-7,
  //         },
  //         {
  //           class_index: 1,
  //           predicted_class: "bluish nails",
  //           confidence: 7.614843156034112e-8,
  //         },
  //       ],
  //     },
  //   ],
  //   combined_result: [
  //     {
  //       class_index: 5,
  //       predicted_class: "melanoma",
  //       confidence: 0.9999997615814209,
  //       vote_count: 1,
  //       max_confidence: 0.9999997615814209,
  //     },
  //     {
  //       class_index: 4,
  //       predicted_class: "koilonychia",
  //       confidence: 0.9999979734420776,
  //       vote_count: 1,
  //       max_confidence: 0.9999979734420776,
  //     },
  //     {
  //       class_index: 8,
  //       predicted_class: "onychogryphosis",
  //       confidence: 0.00000195485404219653,
  //       vote_count: 0,
  //       max_confidence: 0.00000195485404219653,
  //     },
  //   ],
  // };

  // ----- POPUPS & NAVIGATION

  const [popupTrigger, setPopupTrigger] = useState(true);
  console.log("predictionResult", predictionResult);
  const patient_details = predictionResult.patient_details;
  const combined = predictionResult.combined_result;
  console.log("combined", combined);
  const diseaseConfidences = {};

  predictionResult.individual_predictions.forEach((prediction) => {
    prediction.top_classes.forEach((classInfo) => {
      if (!diseaseConfidences[classInfo.predicted_class]) {
        diseaseConfidences[classInfo.predicted_class] = [];
      }
      diseaseConfidences[classInfo.predicted_class].push(classInfo.confidence);
    });
  });
  console.log(diseaseConfidences);
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
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.contactInfo}>
                      Contact: 021 12345678
                    </div>
                    <div className={styles.logo}>
                      <img src="nailysis-logo-small.png" alt="logo" />
                    </div>
                  </div>
                </div>
                <div className={styles.divider}></div>

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
                        {calculateAge(patient_details?.date_of_birth) || "N/A"}
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

                <div className={styles.divider}></div>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.dot}></span> Nailysis Disease
                    Detection
                  </h3>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h4>Current Result</h4>
                      <p>Onychomycosis</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Scanned On</h4>
                      <p>10/10/2024 09:30 AM</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Scanned By</h4>
                      <p>Self-scanned</p>
                    </div>
                  </div>

                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h4>Area Affected</h4>
                      <p>Thumb Nails</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Total Conditions Detected</h4>
                      <p>3</p>
                    </div>
                  </div>
                </section>

                <div className={styles.divider}></div>

                <section className={styles.section}>
                  <h4>Uploaded Images</h4>
                  <div className={styles.imagesGrid}>
                    <div className={styles.imageBox}>
                      <img src="right-thumb.png" alt="thumb" />
                    </div>
                    <div className={styles.imageBox}>
                      {" "}
                      <img src="left-thumb.png" alt="thumb" />
                    </div>
                    <div className={styles.imageBox}>
                      <img src="right-fingers.png" alt="fingers" />
                    </div>
                    <div className={styles.imageBox}>
                      <img src="left-fingers.png" alt="fingers" />
                    </div>
                  </div>

                  <h4 className={styles.confidenceTitle}>Confidence Levels</h4>
                  <div className="p-6">
                    <div className={styles.confidenceGrid}>
                      {combined.map((idx) => (
                        <div>
                          <PieChartRes data={idx} />

                          <h1>{idx.predicted_class}</h1>
                          <ProgressBarChart percentage={80} />
                        </div>
                      ))}
                    </div>

                    <h2>PieChartsVote Chart</h2>
                    <PieChartVoteRes data={combined} />
                    <h2>Radar Chart</h2>
                    <RadarChartRes allClassConfidences={combined} />
                    <h2>Sankey Chart</h2>
                    <SankeyRes predictionResult={predictionResult} />
                    <h2>Bar Chart</h2>
                    <BarChartRes data={combined} />

                    <h2>Stacked Bar Chart</h2>
                    <BarChartStackedRes data={combined} />
                  </div>

                  <div className={styles.disclaimer}>
                    <p>
                      Note: It is not a definitive medical diagnosis and should
                      be used to assist healthcare providers in identifying
                      potential issues for further investigation. Clinical
                      assessments and lab tests are required for accurate
                      diagnosis.
                    </p>
                  </div>
                </section>

                <div className={styles.divider}></div>

                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.dot}></span> Symptoms Added
                  </h3>
                  <div className={styles.symptomsText}>
                    <p>
                      I've noticed that my toenails are starting to look
                      discolored and turning yellowish. They've also become
                      thicker and brittle over the past few weeks. It's been
                      harder to trim them, and one of the nails feels like it's
                      separating from the nail bed. I don't have much pain, but
                      sometimes there's a slight discomfort when I put pressure
                      on the nail. There's no bleeding, but the texture feels
                      rough.
                    </p>
                  </div>

                  <div className={styles.signatures}>
                    <p className={styles.disclaimerText}>
                      This is a computer generate NailysisReport and does not
                      require any signatures.
                    </p>

                    <div className={styles.signatureGrid}>
                      <div className={styles.signatureItem}>
                        <p>Dr. Naeem Iqbal</p>
                        <p className={styles.credentials}>MBBS, FCPS</p>
                      </div>
                      <div className={styles.signatureItem}>
                        <p>Dr. Sarah Zafar</p>
                        <p className={styles.credentials}>MBBS, FCPS</p>
                      </div>
                      <div className={styles.signatureItem}>
                        <p className={styles.teamTitle}>The Nailysis Team</p>
                        <p className={styles.credentials}>Software Engineers</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.downloadButton}>
                  <span className={styles.downloadIcon}></span>
                  Download PDF
                </button>
                <button className={styles.shareButton}>
                  <span className={styles.shareIcon}></span>
                  Share Report
                </button>
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

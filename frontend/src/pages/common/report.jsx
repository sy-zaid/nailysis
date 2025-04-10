//report.jsx

import React from "react";
import styles from "./report.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";

const Report = () => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      {/* <div className={styles.navbar}>{/* Navbar content will go here *</div> */}

      <div className={styles.contentWrapper}>
        <Sidebar />
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
                    <h4>Medical Record ID</h4>
                    <p>123456</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4>Patient Name</h4>
                    <p>Ms. Jane Doe</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4>Age</h4>
                    <p>24 years</p>
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h4>Sex</h4>
                    <p>Female</p>
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
                <div className={styles.confidenceGrid}>
                  <div className={styles.confidenceItem}>
                    <div className={styles.confidenceCircle}>
                      <span className={styles.confidenceValue}>98%</span>
                    </div>
                    <p>Onychomycosis</p>
                    <span className={styles.alertIndicator}></span>
                  </div>
                  <div className={styles.confidenceItem}>
                    <div className={styles.confidenceCircle}>
                      <span className={styles.confidenceValue}>73%</span>
                    </div>
                    <p>Beau's Lines</p>
                  </div>
                  <div className={styles.confidenceItem}>
                    <div className={styles.confidenceCircle}>
                      <span className={styles.confidenceValue}>42%</span>
                    </div>
                    <p>Clubbing</p>
                  </div>
                </div>

                <div className={styles.disclaimer}>
                  <p>
                    Note: It is not a definitive medical diagnosis and should be
                    used to assist healthcare providers in identifying potential
                    issues for further investigation. Clinical assessments and
                    lab tests are required for accurate diagnosis.
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
                    sometimes there's a slight discomfort when I put pressure on
                    the nail. There's no bleeding, but the texture feels rough.
                  </p>
                </div>

                <div className={styles.signatures}>
                  <p className={styles.disclaimerText}>
                    This is a computer generate report and does not require any
                    signatures.
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
  );
};

export default Report;

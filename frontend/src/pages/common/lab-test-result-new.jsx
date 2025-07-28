// lab-test-result-new.jsx

import React from "react";
import styles from "./lab-test-result-new.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";

const LabTestResultNew = () => {
  return (
    <div className={styles.pageContainer}>
      

      <div className={styles.contentWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          <div className={styles.reportContainer}>
            <h1 className={styles.reportTitle}>Diagnosis Report</h1>
            <p className={styles.reportSubtitle}>
              View your lab test results, download, or share with doctors and
              technicians
            </p>

            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <div className={styles.headerLeft}>
                  <h2 className={styles.clinicName}>Medical Lab Services</h2>
                  <address className={styles.clinicAddress}>
                    ST-13 Abul Hasan Isphahani Rd, Block 7<br />
                    Gulshan-e-Iqbal, Karachi, Karachi City,
                    <br />
                    Sindh 75300
                    <br />
                    <div className={styles.contactInfo}>
                      Contact: 021 12345678
                    </div>
                  </address>
                </div>
                <div className={styles.headerRight}>
                <div className={styles.logo}>
                    <img src="/nailysis-logo-small.png" alt="logo" />
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
                    <h4>Gender</h4>
                    <p>Female</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4>Test Request</h4>
                    <p>Complete Blood Count</p>
                  </div>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.dot}></span> Test Information
                </h3>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h4>Lab Test</h4>
                    <p>Complete Blood Count</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4>Sample Collected</h4>
                    <p>10/10/2024 09:30 AM</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4>Processed By</h4>
                    <p>Dr. Ahmed Khan</p>
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h4>Sample Type</h4>
                    <p>Blood</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h4>Report Date</h4>
                    <p>10/12/2024</p>
                  </div>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.dot}></span> Test Results
                </h3>

                <div className={styles.testResultsTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Test Parameter</th>
                        <th>Result</th>
                        <th>Normal Range</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Hemoglobin</td>
                        <td>13.5 g/dL</td>
                        <td>12.0-15.5 g/dL</td>
                        <td className={styles.normal}>Normal</td>
                      </tr>
                      <tr>
                        <td>Red Blood Cells</td>
                        <td>4.8 x10^6/μL</td>
                        <td>4.2-5.4 x10^6/μL</td>
                        <td className={styles.normal}>Normal</td>
                      </tr>
                      <tr>
                        <td>White Blood Cells</td>
                        <td>11.2 x10^3/μL</td>
                        <td>4.5-11.0 x10^3/μL</td>
                        <td className={styles.high}>High</td>
                      </tr>
                      <tr>
                        <td>Platelets</td>
                        <td>230 x10^3/μL</td>
                        <td>150-450 x10^3/μL</td>
                        <td className={styles.normal}>Normal</td>
                      </tr>
                      <tr>
                        <td>Hematocrit</td>
                        <td>40%</td>
                        <td>36-46%</td>
                        <td className={styles.normal}>Normal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.disclaimer}>
                  <p>
                    Note: This report is based on laboratory testing and should
                    be interpreted by a healthcare professional. Results may
                    require additional investigation or follow-up testing.
                  </p>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.dot}></span> Result Images
                </h3>
                <div className={styles.imagesGrid}>
                  <div className={styles.imageBox}>
                    <img src="/chest-xray.jpg" alt="Lab Result Image 1" />
                  </div>
                  <div className={styles.imageBox}>
                    <img src="/chest-xray.jpg" alt="Lab Result Image 2" />
                  </div>
                  <div className={styles.imageBox}>
                    <img src="/chest-xray.jpg" alt="Lab Result Image 3" />
                  </div>
                  <div className={styles.imageBox}>
                    <img src="/chest-xray.jpg" alt="Lab Result Image 4" />
                  </div>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.dot}></span> Lab Admin Comments
                </h3>
                <div className={styles.commentsContainer}>
                  <div className={styles.commentBox}>
                    <p className={styles.commentText}>
                      Patient's blood work shows slightly elevated white blood
                      cell count which may indicate an ongoing infection or
                      inflammatory response. All other parameters are within
                      normal ranges. Recommend follow-up CBC in 2 weeks if
                      symptoms persist. No critical values identified requiring
                      immediate attention.
                    </p>
                    <div className={styles.commentMeta}>
                      <p className={styles.commentAuthor}>
                        Dr. Ahmed Khan, Laboratory Director
                      </p>
                      <p className={styles.commentDate}>12/10/2024, 14:30</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <div className={styles.signatures}>
                  <p className={styles.disclaimerText}>
                    This is a computer generated report and requires
                    verification by authorized personnel.
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
                      <p className={styles.teamTitle}>Lab Technician</p>
                      <p className={styles.credentials}>Ahmed Raza, MLT</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.downloadButton}>Download PDF</button>
              <button className={styles.shareButton}>Share Report</button>
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

export default LabTestResultNew;

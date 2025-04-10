import React from 'react';
import Popup from "./Popup.jsx";

const popupEhrCreateConfirm = () => {
  return (
      <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
        <div className={styles.formContainer}>
          <div className={styles.headerSection}>
            <div className={styles.titleSection}>
              <h2>Add New EHR Record</h2>
              <p>Choose a patient from list to add new record</p>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <span>×</span>
            </button>
          </div>
          <hr />
  
          {/* Patient Selection Dropdown */}
          <div className={styles.patientSelectSection}>
            <label>Select Patient</label>
            <div className={styles.dropdown}>
              <Select
                options={patients}
                isSearchable
                onChange={handlePatientChange}
                placeholder="ID: PAT001 | Mr. John Doe"
              />
            </div>
          </div>
  
          {/* Patient Information Section */}
          <div className={styles.infoSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.bullet}></div>
              <h3>Patient Information</h3>
            </div>
  
            <div className={styles.patientInfoGrid}>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}>Patient ID</div>
                <div className={styles.infoValue}>123456</div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}>Patient Name</div>
                <div className={styles.infoValue}>Mr. John Doe</div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}>Age</div>
                <div className={styles.infoValue}>32</div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}>Gender</div>
                <div className={styles.infoValue}>Male</div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.infoLabel}>Phone Number</div>
                <div className={styles.infoValue}>+92 12345678</div>
              </div>
            </div>
  
            <div className={styles.emailSection}>
              <div className={styles.infoLabel}>Email Address</div>
              <div className={styles.infoValue}>patient@gmail.com</div>
            </div>
          </div>
  
          {/* Current Available Records Section */}
          <div className={styles.recordsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.bullet}></div>
              <h3>Current Available Records</h3>
            </div>
  
            <div className={styles.tableContainer}>
              <table className={styles.recordsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Record ID</th>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Category</th>
                    <th>Details/Summary</th>
                    <th>Consultation Notes</th>
                    <th>Consulted By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>123456</td>
                    <td>123456</td>
                    <td>John</td>
                    <td>Lab Test</td>
                    <td>
                      Lorem ipsum è un testo segnaposto utilizzato nel settore...
                    </td>
                    <td>
                      Lorem ipsum è un testo segnaposto utilizzato nel settore...
                    </td>
                    <td>Dr. John Doe</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>123456</td>
                    <td>123456</td>
                    <td>Doe</td>
                    <td>Lab Test</td>
                    <td>
                      Lorem ipsum è un testo segnaposto utilizzato nel settore...
                    </td>
                    <td>
                      Lorem ipsum è un testo segnaposto utilizzato nel settore...
                    </td>
                    <td>Dr. John Doe</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>123456</td>
                    <td>123456</td>
                    <td>Doe</td>
                    <td>Lab Test</td>
                    <td>
                      Lorem ipsum è un testo segnaposto utilizzato nel settore...
                    </td>
                    <td>
                      Lorem ipsum è un testo segnaposto utilizzato nel settore...
                    </td>
                    <td>Dr. John Doe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Continue Button */}
          <div className={styles.actionSection}>
            <button className={styles.continueButton} onClick={handleCreateEHR}>
              Continue
            </button>
          </div>
        </div>
      </Popup>
    );
  };

export default popupEhrCreateConfirm

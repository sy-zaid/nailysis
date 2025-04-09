import React from "react";
import styles from "./all-popups-styles.module.css"; 
import Popup from "./Popup";
import { useState, useEffect  } from "react";
import { getStatusClass } from "../../utils/utils"; 

const PopupInvoiceDetails = ({ invoiceDetailsPopup, setinvoiceDetailsPopup, onProceed }) => {
    
    return (
        
    <Popup trigger={invoiceDetailsPopup} setTrigger={setinvoiceDetailsPopup}>
        <div className={styles.formContainer}>
          
          <div className={styles.headerSection}>

              <div className={styles.titleSection}>
                  <h2>Invoice Details For Patient: John Doe (Invoice ID: 12345)</h2> 
                  <p>Detailed view for the invoice number #123456.</p>
              </div>

          </div>

        <hr />

        <p className={styles.newSubHeading}>
          
            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i class="fa-solid fa-eye"></i> Viewed By: </span>
            <span className={styles.locationValue}>Clinic Admin</span>

            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i className="fa-solid fa-circle-notch" style={{ fontSize: "14px" }}></i> Status: </span>
            <span className={getStatusClass("Paid", styles)} style={{ fontSize: "16px" }}>Paid</span>
          
            <span className={styles.key} style={{margin: "0 0 0 20px"}}> <i class='bx bx-calendar-check' ></i> Issuance Date & Time: </span>
            <span className={styles.locationValue}>10/10/2024 09:30 AM</span>  
        </p>

        <div className={styles.popupBottom}>

            <div className={styles.formSection}>
                <h3><i className="fa-solid fa-circle fa-2xs"></i> Invoice Details</h3>    
                <div className={styles.newFormGroup}>
                      <div>
                        <label>Invoice Number</label>
                        <p className={styles.subHeading}>123456</p>
                      </div>
                      <div>
                        <label>Doctor Name</label>
                        <p className={styles.subHeading}>John Doe</p>
                      </div>
                      <div>
                        <label>Service Type</label>
                        <p className={styles.subHeading}>Consultation</p>
                      </div>
                      <div>
                        <label>Date & Time of Service</label>
                        <p className={styles.subHeading}>12/9/2024 05:30 PM</p>
                      </div>
                      <div>
                        <label>Paid Amount</label>
                        <p className={styles.subHeading}>RS/- 4000</p>
                      </div>

                      <div>
                        <label>Pending Amount</label>
                        <p className={styles.subHeading}>RS/- 1000</p>
                      </div>

                      <div>
                        <label>Service Fee</label>
                        <p className={styles.subHeading}>RS/- 5000</p>
                      </div>
                    </div>
            </div>

            <hr />

            <div className={styles.formSection}>
                <h3><i className="fa-solid fa-circle fa-2xs"></i> Change Summary</h3>
                    
                    <div>
                        <div>
                            <textarea defaultValue="Payment of PKR 5000 received for Invoice ID: INV-98765" disabled></textarea>
                        </div>
                    </div>
            </div>

            <hr />

            <div className={styles.formSection}>
                <h3><i className="fa-solid fa-circle fa-2xs"></i> Comments/Reason</h3>
                <div>
                    <div>
                        <textarea defaultValue="Lorem ipsum dolor sit amet, consectetur" disabled></textarea>
                    </div>
                </div>
            </div>

          <div className={styles.actions}>
            <button className={styles.addButton}>
              Download as PDF File
            </button>
            <button className={styles.addButton}>
              Send to Printer
            </button>
          </div>
          <br />
          
        </div>
      </div>
    </Popup>


  );
};

export default PopupInvoiceDetails;

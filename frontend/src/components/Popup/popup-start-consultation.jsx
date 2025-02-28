import React from "react";
import styles from "../CSS Files/LabTechnician.module.css";
import Popup from "./Popup";
import { useState, useEffect  } from "react";

const PopupStartConsultation = ({ startConsultaionPopup, setstartConsultaionPopup }) => {
    
    // State variables 
    const [timer, setTimer] = useState(0); // Keeps track of elapsed time in seconds
    const [isConsultationStarted, setIsConsultationStarted] = useState(false); // Tracks whether consultation has started
    const [intervalId, setIntervalId] = useState(null); // Stores the timer's interval ID to control it

    // Function to format time in HH:MM:SS format
    const formatTime = (time) => {
        const hours = String(Math.floor(time / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };
 
    // Function to start the timer when consultation begins
    const startTimer = () => {
      setIsConsultationStarted(true);
      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    };
  
    // Function to stop the timer when consultation ends
    const stopTimer = () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };
    
    // Function to determine the CSS class based on status
    const getStatusClass = (status) => {
        switch (status) {
          case "Completed":
            return styles.consulted;
          case "Cancelled":
            return styles.cancelled;
          case "Scheduled":
            return styles.scheduled;
          case "Pending":
            return styles.scheduled;
          case "Urgent":
            return styles.cancelled;
          default:
            return {};
        }    
    }

    // useEffect to reset timer and state when popup opens
    useEffect(() => {
        if (startConsultaionPopup) {
          setTimer(0); // Reset timer when popup opens
          setIsConsultationStarted(false); // Reset consultation status
          if (intervalId) {
            clearInterval(intervalId); // Clear any running timer
            setIntervalId(null); // Reset interval ID
          }
        }
      }, [startConsultaionPopup]); // Runs when the popup state changes
      

    return (

    <Popup trigger={startConsultaionPopup} setTrigger={setstartConsultaionPopup}>
        <div className={styles.formContainer}>
          
          <div className={styles.tophead}>
              <div className={styles.header}>
                <h2>{isConsultationStarted ? "Complete Patient Check-Out" : "Select an Appointment"}</h2>
              </div>

              <div className={styles.subhead}>
                <h5>
                  Is the test sample collected? Confirm details to finalize the process.
                </h5>
                <div>
                  <h2 style={{marginRight: "45px"}}>Time: <span>{formatTime(timer)}</span></h2>
                </div>
              </div>

              <hr />
          </div>
          
          
        <div className={styles.popupBottom}>
          <p className={styles.newSubHeading}>
            <span className={styles.seckey}> <i className="fa-solid fa-circle-notch"></i> Status: </span>
            <span className={getStatusClass("Paid")}>Pending</span>
            <span className={styles.key} style={{margin: "0 0 0 50px"}}> <i className="fa-solid fa-location-dot"></i> Location: </span>
            <span className={styles.locationValue}>Chughtai Lab, North Nazimabad</span>
          </p>

            <div className={styles.formSection}>
              <br />
                    <h3><i className="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Patient Information</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Patient ID</label>
                        <p className={styles.subHeading}>123456</p>
                      </div>
                      <div>
                        <label>Patient Name</label>
                        <p className={styles.subHeading}>Mr. John Doe</p>
                      </div>
                      <div>
                        <label>Age</label>
                        <p className={styles.subHeading}>32</p>
                      </div>
                      <div>
                        <label>Gender</label>
                        <p className={styles.subHeading}>Male</p>
                      </div>
                      <div>
                        <label>Phone Number</label>
                        <p className={styles.subHeading}>+92 12345678</p>
                      </div>

                      <div>
                        <label>Email Address</label>
                        <p className={styles.subHeading}>patient@gmail.com</p>
                      </div>

                    </div>
            </div>

            <hr />

            <div className={styles.formSection}>
                    <h3><i className="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Appointment Details</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Specialization</label>
                        <p className={styles.subHeading}>Technician </p>
                      </div>
                      <div>
                        <label>Technician</label>
                        <p className={styles.subHeading}>Tech. Jane Doe </p>
                      </div>
                      
                      <div>
                        <label>Date & Time (Available)</label>
                        <input type="date" value={new Date().toISOString().split("T")[0]} disabled/>
                      </div>
            </div>
            </div>


            <div className={styles.formSection}>
              <h3><i className="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Requested Test Details</h3>
              <div style={{marginLeft: "25px"}}>
                
                <div className={styles.testType}>
                  {isConsultationStarted && (
                  <span><input type="checkbox" /></span>
                  )}
                  <span style={{marginLeft: "25px"}}>Test Type 1 </span>
                  <span className={styles.testTypeBorder}></span>
                  <span style={{marginRight: "45px"}}>RS/- 2000</span>
                </div>

                <div className={styles.testType}>
                  {isConsultationStarted && (
                  <span><input type="checkbox" /></span>
                  )}
                  <span style={{marginLeft: "25px"}}>Test Type 2</span>
                  <span className={styles.testTypeBorder}></span>
                  <span style={{marginRight: "45px"}}>RS/- 3500</span>
                </div>

                <div className={styles.testType}>
                  {isConsultationStarted && (
                  <span><input type="checkbox" /></span>
                  )}
                  <span style={{marginLeft: "25px"}}>Test Type 3</span>
                  <span className={styles.testTypeBorder}></span>
                  <span style={{marginRight: "45px"}}>RS/- 2500</span>
                </div>
              </div>
            </div>


            {isConsultationStarted && (
          <div className={styles.commentsFormSection}>
            <h3>Comments</h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit"></textarea>
              </div>
            </div>
          </div>
        )}

          <div className={styles.newActions}>
            <button className={styles.cancelButton} onClick={() => setcheckInPopup(false)}>
              Cancel
            </button>
            {!isConsultationStarted ? (
            <button className={styles.addButton} onClick={startTimer}>
              Start Consultation
            </button>
          ) : (
            <button className={styles.addButton} onClick={stopTimer}>
              Complete Appointment
            </button>
          )}
          </div>
          </div>
        </div>
    </Popup>


  );
};

export default PopupStartConsultation;

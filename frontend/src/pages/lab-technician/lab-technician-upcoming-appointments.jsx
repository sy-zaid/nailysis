
import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/LabTechnician.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup.jsx";


const UpcomingAppointments = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const [activeButton, setActiveButton] = useState(0); 

  const [checkInPopup, setcheckInPopup] = useState(false);

  const [timer, setTimer] = useState(0); // Store time in seconds
  const [isConsultationStarted, setIsConsultationStarted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
    
  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
 
    // Start timer function
    const startTimer = () => {
      setIsConsultationStarted(true);
      const id = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    };
  
    // Stop timer function
    const stopTimer = () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };

    useEffect(() => {
      if (checkInPopup) {
        setTimer(0); // Reset timer when popup opens
        setIsConsultationStarted(false); // Reset button state
        if (intervalId) {
          clearInterval(intervalId); // Clear any existing timer
          setIntervalId(null);
        }
      }
    }, [checkInPopup]);


  const handleTableEntryClick = () => {
    setcheckInPopup(true);
  };


  const data = [
    {
        id: 1,
        appointmentID: "123456",
        patientName: "John",
        gender: "Male",
        email: "patient1@gmail.com",
        phone: "+123 456 789",
        appointmentDateTime: "10/10/2024 09:30 AM",
        purpose: "Consultation",
        scheduledAppointments: "Consulted",
    },

    {
        id: 2,
        appointmentID: "123456",
        patientName: "Doe",
        gender: "Male",
        email: "patient2@gmail.com",
        phone: "+123 456 789",
        appointmentDateTime: "10/10/2024 09:30 AM",
        purpose: "Consultation",
        scheduledAppointments: "Cancelled",
    },
    
  ];

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Consulted":
        return styles.consulted;
      case "Cancelled":
        return styles.cancelled;
      default:
        return styles.scheduled;
        }
    }
  
  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5, // Adjust for scroll position
      left: iconRect.left + window.scrollX - 95, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    
    <div className={styles.pageContainer}>


    {/* Check-In Popup */}
    <Popup trigger={checkInPopup} setTrigger={setcheckInPopup}>
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
                  <h2>Time: <span>{formatTime(timer)}</span></h2>
                </div>
              </div>

              <hr />
          </div>
          
          

          <p className={styles.newSubHeading}>
            <span className={styles.seckey}> <i class="fa-solid fa-circle-notch"></i> Status: </span>
            <span className={getStatusClass("Paid")}>Pending</span>
            <span className={styles.key} style={{margin: "0 0 0 50px"}}> <i class="fa-solid fa-location-dot"></i> Location: </span>
            <span className={styles.locationValue}>Chughtai Lab, North Nazimabad</span>
          </p>

            <div className={styles.formSection}>
              <br />
                    <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Patient Information</h3>
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
                    <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Appointment Details</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Specialization</label>
                          <select className={styles.patientSelect}>
                            <option>Technician </option>
                          </select>
                      </div>
                      <div>
                        <label>Technician</label>
                        <select>
                          <option>Tech. Jane Doe</option>
                        </select>
                      </div>
                      <div>
                        <label>Date & Time (Available)</label>
                        <input type="date" />
                      </div>
                      
            </div>
            </div>


            <div className={styles.formSection}>
              <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Requested Test Details</h3>
              <div style={{marginLeft: "25px"}}>
                <p>Test Type 1</p>
                <p>Test Type 1</p>
                <p>Test Type 1</p>
              </div>
            </div>


            {isConsultationStarted && (
          <div className={styles.commentsFormSection}>
            <h3>Comments</h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea>Lorem ipsum dolor sit amet consectetur adipisicing elit</textarea>
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
    </Popup>






      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Appointments'}
            subHeading={'Here you can view all the booked appointments'}
          />
      </div>
      <div className={styles.mainContent}>

        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
          <button
              className={`${styles.filterButton} ${activeButton === 0 ? styles.active : ''}`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 1 ? styles.active : ''}`}
              onClick={() => handleFilterClick(1)}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ''}`}
              onClick={() => handleFilterClick(2)}
            >
              Completed
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ''}`}
              onClick={() => handleFilterClick(3)}
            >
              Cancelled
            </button>
            <p>50 completed, 4 pending</p>
            
            <div className={styles.appointmentButtons}>
                <button className={styles.addButton}>
                    <i class="fa-regular fa-calendar" style={{margin: "0 5px 0 0"}}></i> Manage Availability 
                </button>
            
                <button className={styles.addButton} onClick={handleTableEntryClick}>
                    <i class='bx bx-plus-circle' style={{margin: "0 5px 0 0"}}></i> Add New Appointment
                </button>
            </div>

          </div>
          
          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>
              <select className={styles.sortBy}>
                <option>Sort By: Ordered Today</option>
              </select>
              <input
                className={styles.search}
                type="text"
                placeholder="Search By Patient Name" 
              /> 
            </div>
            <hr />
            <br />
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th >Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointment Date & Time</th>
                  <th>Purpose</th>
                  <th>Scheduled Appointments</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td data-label="#">{row.id}</td>
                    <td data-label="Appointment ID">{row.appointmentID}</td>
                    <td data-label="Patient Name">{row.patientName}</td>
                    <td data-label="Gender">{row.gender}</td>
                    <td data-label="Email" className={styles.emailColumn}>{row.email}</td>
                    <td data-label="Phone">{row.phone}</td>
                    <td data-label="Appointment Date & Time">{row.appointmentDateTime}</td>
                    <td data-label="Purpose">{row.purpose}</td>
                    <td data-label="Scheduled Appointments" className={getStatusClass(row.scheduledAppointments)}>{row.scheduledAppointments}</td>
                 
                    <td style={{ position: "relative" }}>
                      <i
                        className="bx bx-dots-vertical-rounded"
                        style={{ cursor: "pointer"}}
                        onClick={togglePopup}
                      ></i>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupVisible && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            background: "white",
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
         
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="fa-solid fa-pen" style={{margin: "0 5px 0 0"}}></i> Edit Details
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="fa-regular fa-circle-xmark" style={{ color: "red", margin: "0 5px 0 0"}}></i> Delete
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="fa-regular fa-file-pdf" style={{margin: "0 5px 0 0"}}></i> Download as PDF
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="bx bx-qr-scan" style={{margin: "0 5px 0 0"}}></i> Print Code
          </p>

        </div>
      )}
    </div>
    
  );
};

export default UpcomingAppointments;

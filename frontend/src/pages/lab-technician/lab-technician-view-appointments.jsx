
import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/LabTechnician.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar.jsx";
import Header from "../../components/Dashboard/Header/Header.jsx";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.jsx";
import PopupStartConsultation from "../../components/Popup/popup-checking-in-lab-technician.jsx";

const ViewAppointments = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const [selectedStatus, setSelectedStatus] = useState(""); // State to store selected row status

  const [activeButton, setActiveButton] = useState(0); 

  const [startConsultationPopup, setstartConsultationPopup] = useState(false);
    

    {/* Function to handle all popup item clicks and close the popup */}
    const handlePopupItemClick = (callback) => {
      if (callback) callback(); // Execute the provided function (if any)
      setPopupVisible(false); // Close the popup
    };



    const handleStartConsultation = (event) => {
      event.stopPropagation(); // Prevent click propagation issues
      setstartConsultationPopup(true); // Open the popup
      setPopupVisible(false); // Close the options popup
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
        scheduledAppointments: "Pending",
    },

    {
        id: 2,
        appointmentID: "123456",
        patientName: "Henry",
        gender: "Male",
        email: "patient2@gmail.com",
        phone: "+123 456 789",
        appointmentDateTime: "10/10/2024 09:30 AM",
        purpose: "Consultation",
        scheduledAppointments: "Consulted",
    },

    {
        id: 3,
        appointmentID: "123456",
        patientName: "Doe",
        gender: "Male",
        email: "patient3@gmail.com",
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
  
  const togglePopup = (event, status) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5, // Adjust for scroll position
      left: iconRect.left + window.scrollX - 95, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
    setSelectedStatus(status); // Store the selected status
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

      <PopupStartConsultation 
        startConsultationPopup={startConsultationPopup} 
        setstartConsultationPopup={setstartConsultationPopup} 
      />


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
                    <i className="fa-regular fa-calendar" style={{margin: "0 5px 0 0"}}></i> Manage Availability 
                </button>
            
                <button className={styles.addButton}>
                    <i className='bx bx-plus-circle' style={{margin: "0 5px 0 0"}}></i> Add New Appointment
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
                        onClick={(event) => togglePopup(event, row.scheduledAppointments)} // Pass status
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
         
          {/* Show "Start Consultation" only if the status is "Pending" */}
          {selectedStatus === "Pending" && (
            <p
              style={{ margin: "10px 0", cursor: "pointer" }}
              onClick={handleStartConsultation} // Call function properly
            >
              <i className="fa-solid fa-plus" style={{ margin: "0 5px 0 0" }}></i> Start Consultation
            </p>
          )}

          <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handlePopupItemClick(null)}>
            <i className="fa-solid fa-pen" style={{margin: "0 5px 0 0"}}></i> Edit Details
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handlePopupItemClick(null)}>
            <i className="fa-regular fa-circle-xmark" style={{ color: "red", margin: "0 5px 0 0"}}></i> Delete
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handlePopupItemClick(null)}>
            <i className="fa-regular fa-file-pdf" style={{margin: "0 5px 0 0"}}></i> Download as PDF
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handlePopupItemClick(null)}>
            <i className="bx bx-qr-scan" style={{margin: "0 5px 0 0"}}></i> Print Code
          </p>

        </div>
      )}
    </div>
    
  );
};

export default ViewAppointments;

import React from "react";
import PopupFeedbackForm from "../../components/Popup/feedbacks-popups/popup-feedback-form";
import PopupFeedbackResponse from "../../components/Popup/feedbacks-popups/popup-feedback-response";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleOpenPopup, handleClosePopup } from "../../utils/utils";
import Header from "../../components/Dashboard/Header/Header.jsx";
import styles from "./feedbacks.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import { getRole } from "../../utils/utils";


const API_BASE_URL = "http://localhost:8000/api/feedback"; // Update with actual API URL

// My Feedback Screen
const SendFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // Track open action menu
  const [popupContent, setPopupContent] = useState(); // Store popup content
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const curUserRole = getRole(); // Get current user role

  const [activeButton, setActiveButton] = useState(0); 

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  // Static feedback data (2 sample rows)
  const data = [
    {
        id: 1,
        feedbackID: "123456",
        feedbackBy: "John",
        role: "patient",
        dateAndTimeofFeedback: "10/10/2024 09:30 AM",
        category: "Service Issues",
        feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
        response: "xyz lorem ipsum",
        respondedBy: "CA/LA",
        status: "Resolved",
    },

    {
        id: 2,
        feedbackID: "123456",
        feedbackBy: "John",
        role: "patient",
        dateAndTimeofFeedback: "10/10/2024 09:30 AM",
        category: "Technical Issues",
        feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
        response: "N/a",
        respondedBy: "N/a",
        status: "Pending",
    },
  ];


  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return styles.resolved;
      case "In Progress":
        return styles.inProgress;
      case "Pending":
        return styles.pending;
      default:
        return {};
    }    
  }

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

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };
  
  
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/my-feedback`)
      .then((res) => setFeedbackList(res.data));
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
    onClose();
  };

  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5, // Adjust for scroll position
      left: iconRect.left + window.scrollX - 95, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on`, recordDetails);
    setPopupVisible(false); // Close popup after clicking any action
  
    if (action === "Submit Feedback") {
      setPopupContent(<PopupFeedbackForm onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "Respond To Feedback") {
      setPopupContent(<PopupFeedbackResponse onClose={handleClosePopup} />);
      setShowPopup(true);
    }
  };
  

  return (
    <div className="p-5">

      <div className={styles.pageContainer}>
      {showPopup && popupContent}
      <Navbar />

      {/* Page Header */}
      <div className={styles.pageTop}>
          <Header 
            mainHeading={'Feedbacks'}
            subHeading={'View and manage your Feedbacks'}
          />
      </div>


      <div className={styles.mainContent}>
        
        <div className={styles.appointmentsContainer}>
          
          {/* Filter buttons with dynamic active state */}
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
              Filter 1
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ''}`}
              onClick={() => handleFilterClick(2)}
            >
              Filter 2
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ''}`}
              onClick={() => handleFilterClick(3)}
            >
              Filter 3
            </button>
                   
            {/* <p>Total Records: {filteredRecords.length}</p> */}
            <p>Total Records: 50</p>

            <div className={styles.appointmentButtons}>
              
              {/* Show 'Submit New Feedback' for patients, doctors, and lab technicians */}
              {(curUserRole === "patient" || curUserRole === "doctor" || curUserRole === "lab_technician") && (
              <button className={styles.addButton} onClick={() => handleActionClick("Submit Feedback")}>
                Submit New Feedback
              </button>
              )}

              {/* Show 'Respond To Feedback' for lab admins and clinic admins */}
              {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
              <button className={styles.addButton} onClick={() => handleActionClick("Respond To Feedback")}>
                <i className='bx bx-plus-circle'></i> Request New Feedback
              </button>
              )}

            </div>
          </div>


          {/* EHR Table */}
          <div className={styles.tableContainer}>
            
            {/* Sorting and Search Bar */}
            <div className={styles.controls}>
              
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>
              
              {/* Sorting dropdown with dynamic selection */}
              <select className={styles.sortBy} >
                <option value="">Sort By: None</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
              </select>

              {/* Search input with real-time state update */}
              <input
                className={styles.search}
                type="text"
                placeholder="Search..."
              /> 
            </div>
            
            <hr />
            <br />

            <div className={styles.tableWrapper}>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>#</th>
                    <th>Feedback ID</th>
                    <th>Feedback By</th>
                    <th>Role</th>
                    <th>Date & Time Of Feedback</th>
                    <th>Category</th>
                    <th>Feedback Comments</th>
                    <th>Response</th>
                    <th>Responded by</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>         
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input 
                          type="checkbox" 
                        />
                      </td>
                      <td>{row.id}</td>
                      <td>{row.feedbackID}</td>
                      <td>{row.feedbackBy}</td>
                      <td>{row.role}</td>
                      <td>{row.dateAndTimeofFeedback}</td>
                      <td>{row.category}</td>
                      <td>{row.feedbackComments}</td>
                      <td>{row.response}</td>
                      <td>{row.respondedBy}</td>
                      <td className={getStatusClass(row.status)}>{row.status}</td>
                      
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
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          
          <p style={{ margin: "10px 0", cursor: "pointer" }}> 
            <i className="fa-solid fa-repeat" style={{margin: "0 5px 0 0"}}></i> View Details
          </p>

          <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handleActionClick("Respond To Feedback")}>
            <i className="fa-regular fa-file-pdf" style={{margin: "0 5px 0 0"}}></i> Edit Feedback
          </p>
          
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="fa-regular fa-circle-xmark" style={{ color: "red", margin: "0 5px 0 0"}}></i> Delete Feedback
          </p>
          

        </div>
      )}

    </div>

    </div>
  );
};

export default SendFeedback;

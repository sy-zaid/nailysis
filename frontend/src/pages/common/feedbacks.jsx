import { Link } from "react-router-dom"; //  Import Link properly
import React from "react";
import PopupFeedbackForm from "../../components/Popup/feedbacks-popups/feedback-form-popup.jsx";
import PopupFeedbackResponse from "../../components/Popup/feedbacks-popups/feedback-response-popup.jsx";
import PopupFeedbackDetails from "../../components/Popup/feedbacks-popups/feedback-details-popup.jsx";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleOpenPopup, handleClosePopup } from "../../utils/utils";
import Header from "../../components/Dashboard/Header/Header.jsx";
import styles from "./feedbacks.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

// UTILS.JS FUNCTIONS
import {
  getStatusClass, 
  toggleActionMenu,
  getRole,
} from "../../utils/utils";


const API_BASE_URL = "http://localhost:8000/api/feedbacks"; // Update with actual API URL

// My Feedback Screen
const SendFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [popupContent, setPopupContent] = useState(); // Store popup content
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const [selectedRecords, setSelectedRecords] = useState([]);
  const curUserRole = getRole(); // Get current user role
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [activeButton, setActiveButton] = useState(0);

  const handleSelectRecord = (recordId) => {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(recordId)
        ? prevSelected.filter((id) => id !== recordId) //  Remove if already selected
        : [...prevSelected, recordId] //  Add if not selected
    );
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/feedbacks/`, //  Correct API endpoint
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, //  Send authentication token
          },
        }
      );

      setFeedbackList(response.data); //  Update state with API response
      console.log("Response from feedback API", response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };


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
      feedbackBy: "Doe",
      role: "patient",
      dateAndTimeofFeedback: "10/10/2024 09:30 AM",
      category: "Technical Issues",
      feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
      response: "N/a",
      respondedBy: "N/a",
      status: "Pending",
    },
    {
      id: 3,
      feedbackID: "123456",
      feedbackBy: "John",
      role: "doctor",
      dateAndTimeofFeedback: "10/10/2024 09:30 AM",
      category: "Technical Issues",
      feedbackComments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
      response: "N/a",
      respondedBy: "N/a",
      status: "Pending",
    },
  ];

  // USE EFFECTS

  // Close the action menu when clicking outside of it
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  


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
    fetchFeedbacks(); //  Call the function to fetch feedbacks
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

    if (action === "Submit Clinic Feedback") {
      setPopupContent(<PopupFeedbackForm onClose={handleClosePopup} />);
      setShowPopup(true);
    } if (action === "Submit Lab Feedback") {
      setPopupContent(<PopupFeedbackForm onClose={handleClosePopup} />);
      setShowPopup(true);
    } if (action === "View Feedback Details") {
      setPopupContent(<PopupFeedbackDetails onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "Respond To Feedback") {
      setPopupContent(<PopupFeedbackResponse onClose={handleClosePopup} />);
      setShowPopup(true);
    }
  };


  return (
    <div className="p-5">
      {showPopup && popupContent}

      <div className={styles.pageContainer}>
        <Navbar />


        {/* Page Header */}
        <div className={styles.pageTop}>
          <Header
            mainHeading={'Feedback Management'}
            subHeading={'Here you can view and manage all the feedbacks'}
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
                Patients
              </button>
              <button
                className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ''}`}
                onClick={() => handleFilterClick(2)}
              >
                Doctors
              </button>
              <button
                className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ''}`}
                onClick={() => handleFilterClick(3)}
              >
                Technician
              </button>

              {/* <p>Total Records: {filteredRecords.length}</p> */}
              <p>Total Records: 45</p>

              <div className={styles.appointmentButtons}>

                {/* Show 'Submit New Feedback' for patients, doctors, and lab technicians */}
                {(curUserRole === "patient") && (
                  <>
                    <div className={styles.appointmentButtons}>

                      <button className={styles.addButton} onClick={() => handleActionClick("Submit Lab Feedback")}>
                        <i className='bx bx-plus-circle'></i> Submit Lab Feedback
                      </button>

                      <button className={styles.addButton} onClick={() => handleActionClick("Submit Clinic Feedback")}>
                        <i className="bx bx-plus-circle"></i> Submit Clinic Feedback
                      </button>

                    </div>
                  </>
                )}

                {(curUserRole === "doctor") && (
                  <>
                    <button className={styles.addButton}  onClick={() => handleActionClick("Submit Clinic Feedback")}>
                      <i className='bx bx-plus-circle'></i> Submit Clinic Feedback
                    </button>
                  </>
                )}

                {(curUserRole === "lab_technician") && (
                  <>
                    <button className={styles.addButton}  onClick={() => handleActionClick("Submit Lab Feedback")}>
                      <i className='bx bx-plus-circle'></i> Submit Lab Feedback
                    </button>
                  </>
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
                      {/* Select all checkbox with dynamic checked state */}
                      <th>
                        <input type="checkbox" />
                      </th>
                      <th>ID</th>
                      <th>Feedback By</th>
                      {/* {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
                        <th>Role</th>
                      )} */}
                      <th>Submitted at</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Response</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {feedbackList.length > 0 ? (
                      feedbackList.map((f) => (
                        <tr key={f.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRecords.includes(f.id)} //  Now properly defined
                              onChange={() => handleSelectRecord(f.id)}
                            />
                          </td>
                          <td>{f.id}</td>
                          <td>{f.user.role.charAt(0).toUpperCase() + f.user.role.slice(1)// To capitalize the first letter 
                          }</td>
                          <td>{`${new Date(f.date_submitted).toLocaleDateString()} | ${new Date(f.date_submitted).toLocaleTimeString()}`}</td>
                          <td>{f.category}</td>
                          <td>{f.description}</td>
                          <td className={getStatusClass(f.status, styles)}>{f.status}</td>
                          <td>Lorem ipsum dolor sit amet consectetur adipisicing elit.</td>

                          {/* ------------------------- ACTION BUTTONS -------------------------*/}
                      
                          <td>
                          <button
                            onClick={(event) => toggleActionMenu(f.id, menuOpen, setMenuOpen, setMenuPosition, event)}
                            className={styles.moreActionsBtn}
                          >
                            <img src="/icon-three-dots.png" alt="More Actions" className={styles.moreActionsIcon} />
                          </button>

                          {menuOpen && (
                            <div
                              ref={menuRef} id={`menu-${f.id}`}
                              className={styles.menu}
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                position: "absolute",
                              }}
                            >
                              <ul>

                                <li>
                                  <i className="fa-solid fa-eye"></i>View Details
                                </li>

                                {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
                                  <li>
                                    <i className="fa-solid fa-reply"></i>View and Respond
                                  </li>
                                )}

                                {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
                                  <li>
                                    <i className="fa-solid fa-reply"></i>Update Status
                                  </li>
                                )}

                                {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
                                  <li>
                                    <i class="fa-solid fa-trash"></i>Delete Feedback
                                  </li>
                                )}
                              </ul> 
                            </div>
                          )}

                          </td>
                    
                          
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10">No feedbacks available</td> {/*  Show a message if no data */}
                      </tr>
                    )}
                  </tbody>


                </table>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>

  );
};

export default SendFeedback;
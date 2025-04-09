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
import { deleteFeedback } from "../../api/feedbacksApi";
import { getFeedbackResponses } from "../../api/feedbacksApi";

const API_BASE_URL = "http://localhost:8000/api/feedbacks";

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

  // const fetchFeedbacks = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/api/feedbacks/`, // ✅ Correct API endpoint
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access")}`, // ✅ Send authentication token
  //         },
  //       }
  //     );

  //     setFeedbackList(response.data); // ✅ Update state with API response
  //     console.log("Response from feedback API", response.data);
  //   } catch (error) {
  //     console.error("Error fetching feedbacks:", error);
  //   }
  // };

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        // Fetch feedbacks
        const feedbackResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedbacks/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        });

        // Fetch feedback responses
        const feedbackResponsesResponse = await getFeedbackResponses();

        // Map responses to corresponding feedbacks
        const feedbacksWithResponses = feedbackResponse.data.map((feedback) => {
          const response = feedbackResponsesResponse.data.find((resp) => resp.feedback === feedback.id);
          return { ...feedback, response: response || null }; // Attach response if found, else set as null
        });

        setFeedbackList(feedbacksWithResponses); // ✅ Update state with mapped data
        console.log("Mapped Feedbacks:", feedbacksWithResponses);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, []);


  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);


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


  // useEffect(() => {
  //   fetchFeedbacks(); // ✅ Call the function to fetch feedbacks
  // }, []);

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
    onClose();
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const response = await deleteFeedback(feedbackId);
      alert(`Feedback deleted successfully! ${feedbackId}`);
      setFeedbackList((prevList) => prevList.filter((f) => f.id !== feedbackId));
    } catch (error) {
      console.error("Failed to delete feedback:", error.response ? error.response.data : error.message);
      alert(`Failed to delete feedback: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
  };

  const togglePopup = (event, feedback) => { // ✅ Accept feedback details
    setPopupPosition({
      top: event.target.getBoundingClientRect().top + window.scrollY + 5,
      left: event.target.getBoundingClientRect().left + window.scrollX - 95,
    });
    setPopupVisible(!popupVisible);
    setMenuOpen(feedback); // ✅ Store selected feedback details
  };

  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on`, recordDetails);
    setPopupVisible(false); // Close popup after clicking any action

    if (action === "Submit Clinic Feedback") {
      setPopupContent(<PopupFeedbackForm onClose={handleClosePopup} isClinicFeedback={true} />);
      setShowPopup(true);
    } if (action === "Submit Lab Feedback") {
      setPopupContent(<PopupFeedbackForm onClose={handleClosePopup} isClinicFeedback={false} />);
      setShowPopup(true);
    } if (action === "View Feedback Details") {
      setPopupContent(<PopupFeedbackDetails onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "Respond To Feedback") {
      setPopupContent(
        <PopupFeedbackResponse onClose={handleClosePopup} recordDetails={recordDetails} />);
      setShowPopup(true);
    } else if (action === "Delete Feedback") {
      handleDeleteFeedback(recordDetails.id);
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
                    <button className={styles.addButton} onClick={() => handleActionClick("Submit Clinic Feedback")}>
                      <i className='bx bx-plus-circle'></i> Submit Clinic Feedback
                    </button>
                  </>
                )}

              </div>

              {(curUserRole === "doctor") && (
                <>
                  <button className={styles.addButton} onClick={() => handleActionClick("Submit Clinic Feedback")}>
                    <i className='bx bx-plus-circle'></i> Submit Clinic Feedback
                  </button>
                </>
              )}

              {(curUserRole === "lab_technician") && (
                <>
                  <button className={styles.addButton} onClick={() => handleActionClick("Submit Lab Feedback")}>
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
                        <td style={{ position: "relative" }}>
                          <i
                            className="bx bx-dots-vertical-rounded"
                            style={{ cursor: "pointer" }}
                            onClick={(event) => togglePopup(event, f)} // ✅ Fix: Pass feedback data
                          ></i></td>

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

      {/* Popup */}
      {
        popupVisible && (
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

            <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handleActionClick("View Feedback Details")}>
              <i className="fa-solid fa-repeat" style={{ margin: "0 5px 0 0" }}></i> View Details
            </p>

            {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
              <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handleActionClick("Respond To Feedback", menuOpen)}>
                <i className="fa-regular fa-file-pdf" style={{ margin: "0 5px 0 0" }}></i> View and Respond
              </p>
            )}

            {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
              <p style={{ margin: "10px 0", cursor: "pointer" }}>
                <i className="fa-regular fa-file-pdf" style={{ margin: "0 5px 0 0" }}></i> Update Status
              </p>
            )}

            {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
              <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={() => handleActionClick("Delete Feedback", menuOpen)}>
                <i className="fa-regular fa-circle-xmark" style={{ color: "red", margin: "0 5px 0 0" }}></i> Delete Feedback
              </p>
            )}

          </div>
        )
      }

    </div >
  );
};

export default SendFeedback;
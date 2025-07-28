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
import { toast } from "react-toastify";

// UTILS.JS FUNCTIONS
import { getStatusClass, toggleActionMenu, getRole } from "../../utils/utils";
import { deleteFeedback } from "../../api/feedbacksApi";
import { getFeedbackResponses } from "../../api/feedbacksApi";

const API_BASE_URL = "http://localhost:8000/api/feedbacks";

const SendFeedback = () => {
  // ----- TOKENS AND USER INFORMATION
  const curUserRole = getRole();
  console.log("Current user role:", curUserRole);


  // ----- POPUPS AND NAVIGATION
  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);   // Close the action menu when clicking outside of it


  // ----- IMPORTANT DATA
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  // ----- SEARCHING, SORTING & FILTERING STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date_submitted",
    direction: "desc",
  });
  const [activeButton, setActiveButton] = useState(0);

  // ----- HANDLERS
  const handleSelectRecord = (recordId) => {
    setSelectedRecords(
      (prevSelected) =>
        prevSelected.includes(recordId)
          ? prevSelected.filter((id) => id !== recordId) //  Remove if already selected
          : [...prevSelected, recordId] //  Add if not selected
    );
  };

  // Set the active button when clicked
  const handleFilterClick = (index) => {
    setActiveButton(index);
  };

  // Hide the popup when closing
  const handleClosePopup = () => {
    setShowPopup(false);
    onClose();
  };

  /**
   * SORT DROPDOWN HANDLER:
   * - The default sort is by date_submitted (latest first).
   * - When the sort dropdown value is "date-desc",
   * - sort by date descending; "date-asc" will sort ascending.
   */
  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("-");
    setSortConfig({ key, direction });
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;

    try {
      const response = await deleteFeedback(feedbackId);
      // alert(`Feedback deleted successfully! ${feedbackId}`);
      toast.success(`Feedback deleted successfully!`, {
        className: "custom-toast",
      });
      setFeedbackList((prevList) =>
        prevList.filter((f) => f.id !== feedbackId)
      );
    } catch (error) {
      console.error(
        "Failed to delete feedback:",
        error.response ? error.response.data : error.message
      );
      if (error.response) {
        toast.error(error.response.data.error || "Failed to Delete Feedback.", {
          className: "custom-toast",
        });
      } else {
        toast.error("Network error! Please try again.", {
          className: "custom-toast",
        });
      }
    }
  };

  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on`, recordDetails);
    setPopupVisible(false); // Close popup after clicking any action

    if (action === "Submit Clinic Feedback") {
      setPopupContent(
        <PopupFeedbackForm onClose={handleClosePopup} isClinicFeedback={true} />
      );
      setShowPopup(true);
    }
    if (action === "Submit Lab Feedback") {
      setPopupContent(
        <PopupFeedbackForm
          onClose={handleClosePopup}
          isClinicFeedback={false}
        />
      );
      setShowPopup(true);
    }
    if (action === "View Feedback Details") {
      setPopupContent(
        <PopupFeedbackDetails onClose={handleClosePopup} recordDetails={recordDetails} />);
      setShowPopup(true);
    } else if (action === "Respond To Feedback") {
      setPopupContent(
        <PopupFeedbackResponse
          onClose={handleClosePopup}
          recordDetails={recordDetails}
        />
      );
      setShowPopup(true);
    } else if (action === "Delete Feedback") {
      handleDeleteFeedback(recordDetails.id);
    }
  };

  const togglePopup = (event, feedback) => {
    //  Accept feedback details
    setPopupPosition({
      top: event.target.getBoundingClientRect().top + window.scrollY + 5,
      left: event.target.getBoundingClientRect().left + window.scrollX - 95,
    });
    setPopupVisible(!popupVisible);
    setMenuOpen(feedback); //  Store selected feedback details
  };

  // ----- SEARCHING, SORTING & FILTERING LOGIC FUNCTIONS

  /**
   * FILTERING LOGIC:
   * - Use activeButton values:
   * - 0: All, 1: Patients, 2: Doctors, 3: Technician, 4: Pending, 5: Resolved
   * - If value matches then return true, else false
   */
  const filteredFeedback = feedbackList.filter((feedback) => {
    if (activeButton === 1 && feedback.user.role.toLowerCase() !== "patient") {
      return false;
    }
    if (activeButton === 2 && feedback.user.role.toLowerCase() !== "doctor") {
      return false;
    }
    if (
      activeButton === 3 &&
      feedback.user.role.toLowerCase() !== "technician"
    ) {
      return false;
    }
    if (activeButton === 4 && feedback.status.toLowerCase() !== "pending") {
      return false;
    }
    if (activeButton === 5 && feedback.status.toLowerCase() !== "resolved") {
      return false;
    }
    return true;
  });

  // Search filtering: dynamic search by any value in record
  const searchedFeedback = filteredFeedback.filter((feedback) => {
    if (!searchQuery.trim()) return true;
    const searchValue = searchQuery.toLowerCase();
    // Combine some fields into one searchable string
    const combinedFields = `${feedback.id} ${feedback.user.role} ${new Date(
      feedback.date_submitted
    ).toLocaleString()} ${feedback.category} ${feedback.description} ${
      feedback.status
    } ${feedback.response ? feedback.response.description : ""}`;
    return combinedFields.toLowerCase().includes(searchValue);
  });

  // --- SORTING LOGIC ---
  const sortedFeedback = [...searchedFeedback].sort((a, b) => {
    if (!sortConfig.key) return 0;
    // For sorting by date_submitted – parse dates
    const aValue = new Date(a.date_submitted).getTime();
    const bValue = new Date(b.date_submitted).getTime();
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // ----- USE EFFECTS
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        // Fetch feedbacks
        const feedbackResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/feedbacks/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        // Fetch feedback responses
        const feedbackResponsesResponse = await getFeedbackResponses();

        // Map responses to corresponding feedbacks
        const feedbacksWithResponses = feedbackResponse.data.map((feedback) => {
          const response = feedbackResponsesResponse.data.find(
            (resp) => resp.feedback === feedback.id
          );
          return { ...feedback, response: response || null }; // Attach response if found, else set as null
        });

        setFeedbackList(feedbacksWithResponses); //  Update state with mapped data
        console.log("Mapped Feedbacks:", feedbacksWithResponses);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedbackData();
  }, []);

  useEffect(() => {
    const fetchFeedbackResponses = async () => {
      try {
        const response = await getFeedbackResponses();
        console.log("Responses:", response.data);
      } catch (error) {
        console.error("Error fetching feedback responses:", error);
      }
    };

    fetchFeedbackResponses(); //   Call the function inside useEffect
  }, []); //   Empty dependency array ensures it runs once on mount


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


  return (
    <div className="p-5">
      {showPopup && popupContent}

      <div className={styles.pageContainer}>
        

        {/* Page Header */}
        <div className={styles.pageTop}>
          <Header
            mainHeading={"Feedback Management"}
            subHeading={"Here you can view and manage all the feedbacks"}
          />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.appointmentsContainer}>
            {/* Filter buttons with dynamic active state */}
            <div className={styles.filters}>
              <button
                className={`${styles.filterButton} ${activeButton === 0 ? styles.active : ""
                  }`}
                onClick={() => handleFilterClick(0)}
              >
                All
              </button>
              {(curUserRole === "lab_admin" || curUserRole === "clinic_admin") && (
                <button
                  className={`${styles.filterButton} ${activeButton === 1 ? styles.active : ""
                    }`}
                  onClick={() => handleFilterClick(1)}
                >
                  Patients
                </button>
              )}

              {curUserRole === "clinic_admin" && (
                <button
                  className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ""
                    }`}
                  onClick={() => handleFilterClick(2)}
                >
                  Doctors
                </button>
              )}

              {curUserRole === "lab_admin" && (
                <button
                  className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ""
                    }`}
                  onClick={() => handleFilterClick(3)}
                >
                  Technician
                </button>
              )}

              <button
                className={`${styles.filterButton} ${
                  activeButton === 4 ? styles.active : ""
                }`}
                onClick={() => handleFilterClick(4)}
              >
                Pending
              </button>
              <button
                className={`${styles.filterButton} ${
                  activeButton === 5 ? styles.active : ""
                }`}
                onClick={() => handleFilterClick(5)}
              >
                Resolved
              </button>

              <p>
                <p>Total Records: {sortedFeedback.length}</p>
              </p>

              <div className={styles.appointmentButtons}>
                {/* Show 'Submit New Feedback' for patients, doctors, and lab technicians */}
                {curUserRole === "patient" && (
                  <>
                    <div className={styles.appointmentButtons}>
                      <button
                        className={styles.addButton}
                        onClick={() => handleActionClick("Submit Lab Feedback")}
                      >
                        <i className="bx bx-plus-circle"></i> Submit Lab
                        Feedback
                      </button>

                      <button
                        className={styles.addButton}
                        onClick={() =>
                          handleActionClick("Submit Clinic Feedback")
                        }
                      >
                        <i className="bx bx-plus-circle"></i> Submit Clinic
                        Feedback
                      </button>
                    </div>
                  </>
                )}

                {curUserRole === "doctor" && (
                  <>
                    <button
                      className={styles.addButton}
                      onClick={() =>
                        handleActionClick("Submit Clinic Feedback")
                      }
                    >
                      <i className="bx bx-plus-circle"></i> Submit Clinic
                      Feedback
                    </button>
                  </>
                )}

                {curUserRole === "lab_technician" && (
                  <>
                    <button
                      className={styles.addButton}
                      onClick={() => handleActionClick("Submit Lab Feedback")}
                    >
                      <i className="bx bx-plus-circle"></i> Submit Lab Feedback
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Feedbacks Table */}
            <div className={styles.tableContainer}>
              {/* Sorting and Search Bar */}
              <div className={styles.controls}>
                <select className={styles.bulkAction}>
                  <option>Bulk Action: Delete</option>
                </select>

                {/* Sort Dropdown – default is "date-desc" (Latest First) */}
                <select
                  className={styles.sortBy}
                  defaultValue="date-desc"
                  onChange={handleSortChange}
                >
                  <option value="date-desc">
                    Sort By: Submitted At (Latest First)
                  </option>
                  <option value="date-asc">
                    Sort By: Submitted At (Oldest First)
                  </option>
                </select>

                {/* Dynamic Search */}
                <input
                  className={styles.search}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                      {(curUserRole === "lab_admin" ||
                        curUserRole === "clinic_admin") && <th>Feedback By</th>}
                      <th>Submitted at</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Response</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedFeedback.length > 0 ? (
                      sortedFeedback.map((f) => (
                        <tr key={f.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRecords.includes(f.id)} //  Now properly defined
                              onChange={() => handleSelectRecord(f.id)}
                            />
                          </td>
                          <td>{f.id}</td>
                          {(curUserRole === "lab_admin" ||
                            curUserRole === "clinic_admin") && (
                            <td>
                              {
                                f.user.role.charAt(0).toUpperCase() +
                                f.user.role.slice(1) // To capitalize the first letter
                              }
                            </td>
                          )}

                          <td>{`${new Date(
                            f.date_submitted
                          ).toLocaleDateString()} | ${new Date(
                            f.date_submitted
                          ).toLocaleTimeString()}`}</td>
                          <td>{f.category}</td>
                          <td>{f.description}</td>
                          <td className={getStatusClass(f.status, styles)}>
                            {f.status}
                          </td>
                          <td>
                            {f.response?.description || "No response yet"}
                          </td>
                          {/* <td style={{ position: "relative" }}>
                            <i
                              className="bx bx-dots-vertical-rounded"
                              style={{ cursor: "pointer" }}
                              onClick={(event) => togglePopup(event, f)} //  Fix: Pass feedback data
                            ></i>
                          </td> */}

                          {/* ------------------------- ACTION BUTTONS -------------------------*/}

                          <td>
                            <button
                              onClick={(event) => {
                                // Set menu position and open for current feedback
                                setMenuPosition({
                                  top:
                                    event.target.getBoundingClientRect().top +
                                    window.scrollY +
                                    5,
                                  left:
                                    event.target.getBoundingClientRect().left +
                                    window.scrollX -
                                    95,
                                });
                                setMenuOpen(f.id); // Store which menu is open
                              }}
                              className={styles.moreActionsBtn}
                            >
                              <img
                                src="/icon-three-dots.png"
                                alt="More Actions"
                                className={styles.moreActionsIcon}
                              />
                            </button>

                            {menuOpen === f.id && (
                              <div
                                ref={menuRef}
                                className={styles.menu}
                                style={{
                                  top: `${menuPosition.top}px`,
                                  left: `${menuPosition.left}px`,
                                  background: "white",
                                  border: "1px solid #ccc",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                  padding: "10px",
                                  borderRadius: "10px",
                                  fontSize: "14px",
                                  zIndex: 1000,
                                }}
                              >
                                <ul
                                  style={{
                                    listStyle: "none",
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  <li
                                    style={{
                                      padding: "8px 0",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      handleActionClick(
                                        "View Feedback Details",
                                        f
                                      );
                                      setMenuOpen(null);
                                    }}
                                  >
                                    <i
                                      className="fa-solid fa-eye"
                                      style={{ marginRight: "8px" }}
                                    ></i>
                                    View Details
                                  </li>

                                  {(curUserRole === "lab_admin" ||
                                    curUserRole === "clinic_admin") && (
                                      <li
                                        style={{
                                          padding: "8px 0",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          handleActionClick(
                                            "Respond To Feedback",
                                            f
                                          );
                                          setMenuOpen(null);
                                        }}
                                      >
                                        <i
                                          className="fa-solid fa-reply"
                                          style={{ marginRight: "8px" }}
                                        ></i>
                                        View and Respond
                                      </li>
                                    )}

                                  {(curUserRole === "lab_admin" ||
                                    curUserRole === "clinic_admin") && (
                                      <li
                                        style={{
                                          padding: "8px 0",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          // Add your Update Status handler here
                                          setMenuOpen(null);
                                        }}
                                      >
                                        <i
                                          className="fa-solid fa-reply"
                                          style={{ marginRight: "8px" }}
                                        ></i>
                                        Update Status
                                      </li>
                                    )}

                                  {(curUserRole === "lab_admin" ||
                                    curUserRole === "clinic_admin") && (
                                      <li
                                        style={{
                                          padding: "8px 0",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          handleActionClick("Delete Feedback", f);
                                          setMenuOpen(null);
                                        }}
                                      >
                                        <i
                                          className="fa-solid fa-trash"
                                          style={{
                                            color: "red",
                                            marginRight: "8px",
                                          }}
                                        ></i>
                                        Delete Feedback
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
                        <td colSpan="5">No feedbacks available</td> {/*   Show a message if no data */}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Popup */}
        {/* {popupVisible && (
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
            <p
              style={{ margin: "10px 0", cursor: "pointer" }}
              onClick={() => handleActionClick("View Feedback Details")}
            >
              <i
                className="fa-solid fa-repeat"
                style={{ margin: "0 5px 0 0" }}
              ></i>{" "}
              View Details
            </p>

            {(curUserRole === "lab_admin" ||
              curUserRole === "clinic_admin") && (
                <p
                  style={{ margin: "10px 0", cursor: "pointer" }}
                  onClick={() =>
                    handleActionClick("Respond To Feedback", menuOpen)
                  }
                >
                  <i
                    className="fa-regular fa-file-pdf"
                    style={{ margin: "0 5px 0 0" }}
                  ></i>{" "}
                  View and Respond
                </p>
              )}

            {(curUserRole === "lab_admin" ||
              curUserRole === "clinic_admin") && (
                <p style={{ margin: "10px 0", cursor: "pointer" }}>
                  <i
                    className="fa-regular fa-file-pdf"
                    style={{ margin: "0 5px 0 0" }}
                  ></i>{" "}
                  Update Status
                </p>
              )}

            {(curUserRole === "lab_admin" ||
              curUserRole === "clinic_admin") && (
                <p
                  style={{ margin: "10px 0", cursor: "pointer" }}
                  onClick={() => handleActionClick("Delete Feedback", menuOpen)}
                >
                  <i
                    className="fa-regular fa-circle-xmark"
                    style={{ color: "red", margin: "0 5px 0 0" }}
                  ></i>{" "}
                  Delete Feedback
                </p>
              )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SendFeedback;

import React from "react";
import PopupFeedbackForm from "../../components/Popup/feedbacks-popups/popup-feedback-form";
import PopupFeedbackResponse from "../../components/Popup/feedbacks-popups/popup-feedback-response";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleOpenPopup, handleClosePopup } from "../../utils/utils";
import Header from "../../components/Dashboard/Header/Header.jsx";
import styles from "./feedbacks.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

const API_BASE_URL = "http://localhost:8000/api/feedback"; // Update with actual API URL

// My Feedback Screen
const SendFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // Track open action menu
  const [popupContent, setPopupContent] = useState(); // Store popup content
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility

  const [activeButton, setActiveButton] = useState(0); 

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };
  
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/my-feedback`)
      .then((res) => setFeedbackList(res.data));
  }, []);

  const handleActionClick = (action, recordDetails) => {
    console.log(`Performing ${action} on`, recordDetails);
    setMenuOpen(null, menuOpen, setMenuOpen); // Close action menu

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
      {showPopup && popupContent}

      <div className={styles.pageContainer}>
      {showPopup && popupContent}
      <Navbar />

      {showPopup && popupContent}


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
              <button className={styles.addButton} onClick={() => handleActionClick("Submit Feedback")}>
                Submit New Feedback
              </button>
              <button className={styles.addButton} onClick={() => handleActionClick("Respond To Feedback")}>
                Respond To Feedback
              </button>
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
                      <input type="checkbox"  />
                    </th>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>         
                  {feedbackList.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                        />
                      </td>
                      <td>{f.id}</td>
                      <td>{f.category}</td>
                      <td>{f.status}</td>
                      <td>
                        <Link to={`/feedback/${f.id}`} className="text-blue-500">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}                         
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

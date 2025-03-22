
import React, { useState, useRef, useEffect } from 'react';
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";

 
const DiagnosticResults = (props) => {
  // ----- POPUPS & NAVIGATION
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  // ----- IMPORTANT DATA
  const [activeButton, setActiveButton] = useState(0); 

  // ----- SAMPLE DATA
  const data = [
    {
        id: 1,
        testDate: "11/11/2024",
        testType: "CBC",
        technician: "Tech. Jane",
        testResult: "Abnormal",
        comments: "Lorem Ipsum è un testo ...",
        status: "Completed",
        shareReportBtn: "Share Report",
    },

    {
        id: 2,
        testDate: "11/11/2024",
        testType: "X-Ray",
        technician: "Tech. Jane",
        testResult: "Pending",
        comments: "segnaposto utilizzato nel settore ...",
        status: "Cancelled",
        shareReportBtn: "Share Report",
    },
  ];

  // ----- HANDLERS
  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };


  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
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
      left: iconRect.left + window.scrollX, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  // ----- USE-EFFECTS

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

      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Review Diagnostic Results'}
            subHeading={'Here you can view and manage all the diagnostic results from prescribed tests'}
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
            
            <button className={styles.addButton}>
              <i className='bx bx-plus-circle'></i> Book New Test
            </button>

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

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>#</th>
                    <th >Test Date</th>
                    <th>Test Type</th>
                    <th>Technician</th>
                    <th>Test Result</th>
                    <th>Comments</th>
                    <th>Status</th>
                    <th>Share</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td data-label="#">{row.id}</td>
                      <td data-label="Test Date">{row.testDate}</td>
                      <td data-label="Test Type">{row.testType}</td>
                      <td data-label="Technician">{row.technician}</td>
                      <td data-label="Test Result">{row.testResult}</td>
                      <td data-label="Comments">{row.comments}</td>
                      <td data-label="Status" className={getStatusClass(row.status)}>{row.status}</td>
                      <td data-label="Actions"><button className={styles.shareBtn}>{row.shareReportBtn}</button></td>
                      <td style={{ position: "relative" }}>
                        <i
                          className="bx bx-dots-vertical-rounded"
                          style={{ cursor: "pointer" }}
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
            zIndex: 1000,
          }}
        >
          <p style={{ margin: "5px 0", cursor: "pointer" }}>
            📄 Download as PDF
          </p>
          <p style={{ margin: "5px 0", cursor: "pointer" }}>
            🖨️ Send to Printer
          </p>
        </div>
      )}
    </div>
    
  );
};

export default DiagnosticResults;

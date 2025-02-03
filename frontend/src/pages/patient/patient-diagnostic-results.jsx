
import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";


const DiagnosticResults = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const data = [
    {
        id: 1,
        testDate: "11/11/2024",
        testType: "CBC",
        technician: "Tech. Jane",
        testResult: "Abnormal",
        comments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
        status: "Completed",
        shareReportBtn: "Share Report",
    },

    {
        id: 2,
        testDate: "11/11/2024",
        testType: "X-Ray",
        technician: "Tech. Jane",
        testResult: "Pending",
        comments: "Lorem Ipsum è un testo segnaposto utilizzato nel settore ...",
        status: "Cancelled",
        shareReportBtn: "Share Report",
    },
  ];

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

  const downloadAsPDF = () => {
    alert("Downloading as PDF...");
  };

  const sendToPrinter = () => {
    alert("Sending to Printer...");
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

      <div className={styles.pageTop}>
        <Navbar />
        <Header curUserRole="Diagnostic results" />
      </div>
      <div className={styles.mainContent}>

        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <button className={styles.filterButton}>All</button>
            <button className={styles.filterButton}>Pending</button>
            <button className={styles.filterButton}>Completed</button>
            <button className={styles.filterButton}>Cancelled</button>
            <p>50 paid, 4 pending</p>
            
            <button className="_button_1muar_189">
                Book New Test
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
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{row.id}</td>
                    <td>{row.testDate}</td>
                    <td>{row.testType}</td>
                    <td>{row.technician}</td>
                    <td>{row.testResult}</td>
                    <td>{row.comments}</td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
                    <td><button className="_button_1muar_189">{row.shareReportBtn}</button></td>
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
          <p style={{ margin: "5px 0", cursor: "pointer" }} onClick={downloadAsPDF}>
            📄 Download as PDF
          </p>
          <p style={{ margin: "5px 0", cursor: "pointer" }} onClick={sendToPrinter}>
            🖨️ Send to Printer
          </p>
        </div>
      )}
    </div>
  );
};

export default DiagnosticResults;

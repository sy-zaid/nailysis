import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/LabTechnician.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import PopupTestDetails from "../../components/Popup/popup-test-details";


const TestRequests = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const [activeButton, setActiveButton] = useState(0); 

  const [testDetailsPopup, setTestDetailsPopup] = useState(false);

  const handleAddNewTest = () => {
    setTestDetailsPopup(true); // This will now correctly open the popup
  };

  const data = [
    {
        id: 1,
        testID: "123456",
        patientName: "John",
        doctorName: "Dr. Carl",
        testType: "Urinalysis",
        requestDate: "11/11/2024",
        collectedOn: "11/11/2024",
        priority: "Urgent",
        price: "PKR. 500",
        payment: "Bank Al Habib",
        status: "Completed"
    },

    {
        id: 2,
        testID: "123456",
        patientName: "Doe",
        doctorName: "Dr. Carl",
        testType: "CBC",
        requestDate: "11/11/2024",
        collectedOn: "Pending",
        priority: "STAT",
        price: "PKR. 500",
        payment: "Bank Al Habib",
        status: "Cancelled"
    },
  ];


  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

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

      <PopupTestDetails testDetailsPopup={testDetailsPopup} setTestDetailsPopup={setTestDetailsPopup} />

      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Test Requests'}
            subHeading={'Here are all the test requests from doctors'}
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
            
            <button className={styles.addButton} onClick={handleAddNewTest}>
              <i className='bx bx-plus-circle'></i> Add New Test
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th >testID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Test Type</th>
                  <th>Request Date</th>
                  <th>Collected On</th>
                  <th>Priority</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
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
                    <td data-label="Test ID">{row.testID}</td>
                    <td data-label="Patient Name">{row.patientName}</td>
                    <td data-label="Doctor Name">{row.doctorName}</td>
                    <td data-label="Test Type">{row.testType}</td>
                    <td data-label="Request Date">{row.requestDate}</td>
                    <td data-label="Collected On" className={getStatusClass(row.collectedOn)}>{row.collectedOn}</td>
                    <td data-label="Priority" className={getStatusClass(row.priority)}>{row.priority}</td>
                    <td data-label="Price">{row.price}</td>
                    <td data-label="Payment">{row.payment}</td>
                    
                    <td data-label="Status" className={getStatusClass(row.status)}>{row.status}</td>

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
          <p
            style={{ margin: "10px 0", cursor: "pointer" }}
          >
            <i className="fa-solid fa-repeat" style={{margin: "0 5px 0 0"}}></i> Change Priority
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="fa-solid fa-pen" style={{margin: "0 5px 0 0"}}></i> Edit Details
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="fa-regular fa-circle-xmark" style={{ color: "red", margin: "0 5px 0 0"}}></i> Delete
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="fa-regular fa-file-pdf" style={{margin: "0 5px 0 0"}}></i> Download as PDF
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="bx bx-qr-scan" style={{margin: "0 5px 0 0"}}></i> Print Code
          </p>

        </div>
      )}
    </div>
    
  );
};

export default TestRequests;

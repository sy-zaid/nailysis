import React, { useState, useRef, useEffect } from "react";
import styles from "../../components/CSS Files/LabTechnician.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import PopupSelectReportType from "../../components/Popup/popup-select-report-type";
import PopupTestDetails from "../../components/Popup/popup-test-details";
import { getTestOrders } from "../../api/labsApi";

const TestOrders = ({ props }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const [activeButton, setActiveButton] = useState(0);

  const [testDetailsPopup, setTestDetailsPopup] = useState(false);
  const [selectreportTypePopup, setselectreportTypePopup] = useState(false);

  // ------------------------- ZAID'S WORK (OTHER THINGS NEEDS TO BE REVISED) ------------------------- //
  const [testOrders, setTestOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem("access");
  // Get test requests on component mount
  useEffect(() => {
    const fetchTestOrders = async () => {
      try {
        const response = await getTestOrders();
        setTestOrders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    // if (!showPopup) {
    // Fetch only when popup is closed
    fetchTestOrders();
    // }
  }, [token]);
  console.log("TEST REQUESTS RESPONSSE", testOrders);
  // ------------------------ END OF ZAID'S WORK -------------------------- //

  const handleAddNewTest = () => {
    setselectreportTypePopup(true);
  };

  const handleCloseSelectReportAndOpenTestDetails = () => {
    setTestDetailsPopup(true);
    setselectreportTypePopup(false);
  };

  const handleCloseTestDetailsPopup = () => {
    setTestDetailsPopup(false);
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
      status: "Completed",
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
      status: "Cancelled",
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
  };

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
      <PopupSelectReportType
        selectreportTypePopup={selectreportTypePopup}
        setselectreportTypePopup={setselectreportTypePopup}
        onProceed={handleCloseSelectReportAndOpenTestDetails}
      />

      <PopupTestDetails
        testDetailsPopup={testDetailsPopup}
        setTestDetailsPopup={setTestDetailsPopup}
      />

      <div className={styles.pageTop}>
        <Navbar />
        <Header
          mainHeading={"Test Requests"}
          subHeading={"Here are all the test requests from patients"}
        />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${
                activeButton === 0 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 1 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(1)}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 2 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(2)}
            >
              Completed
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 3 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(3)}
            >
              Cancelled
            </button>
            <p>50 completed, 4 pending</p>

            <button className={styles.addButton} onClick={handleAddNewTest}>
              <i className="bx bx-plus-circle"></i> Add New Test
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
                  <th>Order ID</th>
                  <th>Patient Name</th>
                  <th>Technician Name</th>
                  <th>Requested Tests</th>
                  <th>Requested On</th>
                  <th>Collected On</th>
                  <th>Total Price</th>
                  <th>Test Status</th>
                  <th>Results Available</th>
                </tr>
              </thead>
              <tbody>
                {testOrders.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="Order ID">{row.id}</td>
                    <td data-label="Patient Name">
                      {row.lab_technician_appointment?.patient_name}
                    </td>
                    <td data-label="Technician Name">
                      {row.lab_technician_appointment?.technician_name}
                    </td>
                    <td data-label="Requested Tests">
                      {row.test_types.map((test) => test.label).join(", ")}
                    </td>
                    <td data-label="Request Date">
                      {new Date(row.created_at).toLocaleDateString()} |{" "}
                      {new Date(row.created_at).toLocaleTimeString()}
                    </td>
                    <td data-label="Request Date">
                      {row?.lab_technician_appointment?.checkout_datetime
                        ? `${new Date(
                            row.lab_technician_appointment.checkout_datetime
                          ).toLocaleDateString()} | ${new Date(
                            row.lab_technician_appointment.checkout_datetime
                          ).toLocaleTimeString()}`
                        : "Pending"}
                    </td>

                    <td data-label="Price">
                      {row.lab_technician_appointment?.fee}
                    </td>

                    <td
                      data-label="Status"
                      className={getStatusClass(row.test_status)}
                    >
                      {row.test_status}
                    </td>
                    <td
                      data-label="Status"
                      className={getStatusClass(row.test_status)}
                    >
                      {row.results_available ? "Yes" : "No"}
                    </td>
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
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i
              className="fa-solid fa-repeat"
              style={{ margin: "0 5px 0 0" }}
            ></i>{" "}
            Change Priority
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="fa-solid fa-pen" style={{ margin: "0 5px 0 0" }}></i>{" "}
            Edit Details
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i
              className="fa-regular fa-circle-xmark"
              style={{ color: "red", margin: "0 5px 0 0" }}
            ></i>{" "}
            Delete
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i
              className="fa-regular fa-file-pdf"
              style={{ margin: "0 5px 0 0" }}
            ></i>{" "}
            Download as PDF
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i className="bx bx-qr-scan" style={{ margin: "0 5px 0 0" }}></i>{" "}
            Print Code
          </p>
        </div>
      )}
    </div>
  );
};

export default TestOrders;

import React, { useState, useRef, useEffect } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import PopupSelectTestOrder from "../../components/Popup/popups-labs/select-test-order-popup";
import { getTestOrders } from "../../api/labsApi";
import { getStatusClass } from "../../utils/utils";

import {
  convertDjangoDateTime,
  handleClosePopup,
  handleOpenPopup,
  toggleActionMenu,
} from "../../utils/utils";
import useCurrentUserData from "../../useCurrentUserData";

const TestOrders = () => {
  // ----- TOKENS & USER INFORMATION
  const { data: curUser, isLoading, error } = useCurrentUserData();
  const token = localStorage.getItem("access");

  // ----- POPUPS & NAVIGATION
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState();
  const [activeButton, setActiveButton] = useState(0);
  const actionMenuRef = useRef(null);

  // ------------------------- ZAID'S WORK (OTHER THINGS NEEDS TO BE REVISED) ------------------------- //

  // ----- IMPORTANT DATA
  const [testOrders, setTestOrders] = useState([]);

  console.log("TEST REQUESTS RESPONSSE", testOrders);

  // API CALLS, FUNCTIONS FOR DATA, AND MORE
  // Fetch test orders to map the rows on table
  const fetchTestOrders = async () => {
    try {
      const response = await getTestOrders();
      setTestOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ----- HANDLERS
  const handleActionClick = (action, testOrderDetails) => {
    console.log(`Performing ${action} on ID:${testOrderDetails}`);

    if (action === "Process Test Order") {
      setPopupContent(
        <PopupSelectTestOrder
          onClose={() => setShowPopup(false)}
          testOrderDetails={testOrderDetails}
        />
      );
      setShowPopup(true);
    }
  };

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  const handleClickOutside = (event) => {
    if (
      actionMenuRef.current &&
      !actionMenuRef.current.contains(event.target)
    ) {
      setMenuOpen(null); // Ensure state updates to close the menu
    }
  };

  // ----- USE EFFECTS

  // Helps in closing action menu on mouse click (anywhere)
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get test requests on component mount
  useEffect(() => {
    if (!showPopup) {
      // Fetch only when popup is closed
      fetchTestOrders();
    }
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching user data</p>;
  }

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
  


  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}

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
                    <th>Order ID</th>
                    <th>Patient Name</th>
                    <th>Technician Name</th>
                    <th>Requested Tests</th>
                    <th>Requested On</th>
                    <th>Collected On</th>
                    <th>Total Price</th>
                    <th>Appointment Status</th>
                    <th>Test Status</th>
                    <th>Results Available</th>
                    <th>Actions</th>
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
                      <td data-label="Requested On">
                        {convertDjangoDateTime(row.created_at)}
                      </td>
                      <td data-label="Collected On">
                        {row?.lab_technician_appointment?.checkout_datetime
                          ? convertDjangoDateTime(
                              row.lab_technician_appointment.checkout_datetime
                            )
                          : "Not collected yet"}
                      </td>

                      <td data-label="Price">
                        {row.lab_technician_appointment?.fee}
                      </td>
                      <td
                        data-label="Status"
                        className={getStatusClass(row.test_status, styles)}
                      >
                        {row.lab_technician_appointment.status}
                      </td>
                      <td
                        data-label="Status"
                        className={getStatusClass(row.test_status, styles)}
                      >
                        {row.test_status}
                      </td>
                      <td
                        data-label="Status"
                        className={getStatusClass(row.test_status, styles)}
                      >
                        {row.results_available ? "Yes" : "No"}
                      </td>

                      {/* ------------------------- ACTION BUTTONS -------------------------*/}
                      <td>
                        <button
                          onClick={(event) => toggleActionMenu(row.id, menuOpen, setMenuOpen, setMenuPosition, event)}
                          className={styles.moreActionsBtn}
                        >
                          <img
                            src="/icon-three-dots.png"
                            alt="More Actions"
                            className={styles.moreActionsIcon}
                          />
                        </button>

                        {menuOpen && (
                          <div
                            ref={menuRef} id={`menu-${row.id}`}
                            className={styles.menu}
                            style={{
                              top: `${menuPosition.top}px`,
                              left: `${menuPosition.left-20}px`,
                              position: "absolute",
                            }}
                          >
                            <ul>

                            {row.lab_technician_appointment.status === "Completed" && (
                                <li
                                  onClick={() =>
                                    handleActionClick("Process Test Order", row)
                                  }
                                >
                                  <i className="fa-solid fa-repeat"></i> Process
                                  Test Order
                                </li>
                              )}
                              <li
                                onClick={() =>
                                  handleActionClick("Edit Details", row)
                                }
                              >
                                <i className="fa-solid fa-pen"></i> Edit Details
                              </li>
                              <li
                                onClick={() => handleActionClick("Delete", row)}
                              >
                                <i
                                  className="fa-regular fa-circle-xmark"
                                  style={{ color: "red" }}
                                ></i>{" "}
                                Delete
                              </li>
                              <li
                                onClick={() =>
                                  handleActionClick("Download as PDF", row)
                                }
                              >
                                <i className="fa-regular fa-file-pdf"></i>{" "}
                                Download as PDF
                              </li>
                              <li
                                onClick={() =>
                                  handleActionClick("Print Code", row)
                                }
                              >
                                <i className="bx bx-qr-scan"></i> Print Code
                              </li>

                              {curUser[0].role === "lab_technician" &&
                                row.status !== "Completed" && (
                                  <li
                                    onClick={() =>
                                      handleActionClick(
                                        "Action Start Appointment",
                                        row
                                      )
                                    }
                                  >
                                    Start Appointment
                                  </li>
                                )}

                              {(curUser[0].role === "patient" ||
                                curUser[0].role === "lab_technician") && (
                                <li
                                  onClick={() =>
                                    handleActionClick(
                                      "Button Cancellation Request",
                                      row.id
                                    )
                                  }
                                >
                                  Request Cancellation
                                </li>
                              )}

                              {curUser[0].role === "lab_admin" && (
                                <>
                                  <li
                                    onClick={() =>
                                      handleActionClick("Reschedule", row)
                                    }
                                  >
                                    Reschedule
                                  </li>
                                  <li
                                    onClick={() =>
                                      handleActionClick(
                                        "Action Cancel Appointment",
                                        row.id
                                      )
                                    }
                                  >
                                    Cancel Appointment
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        )}

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
  );
};

export default TestOrders;

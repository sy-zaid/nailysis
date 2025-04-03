import React, { useState, useRef, useEffect } from "react";
import styles from "../../components/CSS Files/LabTechnician.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import PopupSelectTestOrder from "../../components/Popup/popups-labs/select-test-order-popup";
import PopupViewTestOrder from "../../components/Popup/popups-labs/view-test-order-popup";
import PopupDeleteTestOrder from "../../components/Popup/popups-labs/delete-test-order-popup";

import { getTestOrders } from "../../api/labsApi";
import { getAccessToken, getStatusClass } from "../../utils/utils";

import {
  convertDjangoDateTime,
  handleClosePopup,
  handleOpenPopup,
  toggleActionMenu,
} from "../../utils/utils";
import useCurrentUserData from "../../useCurrentUserData";

/**
 * TestOrders Component
 *
 * This component manages test orders, allowing users to view, process, and delete test requests.
 * It fetches test orders from the backend, handles user interactions, and manages popups for different actions.
 *
 * Features:
 * - Fetches test orders and displays them in a table.
 * - Provides options to process, view, or delete test orders.
 * - Uses popups for handling test order actions.
 * - Includes filtering and menu interaction handling.
 *
 * @returns {JSX.Element} The rendered TestOrders component.
 */
const TestOrders = () => {
  // ----- TOKENS & USER INFORMATION
  /**
   * Fetches current user data and stores the authentication token.
   */
  const { data: curUser, isLoading, error } = useCurrentUserData();
  const token = getAccessToken();

  // ----- POPUPS & NAVIGATION
  /**
   * Manages UI popups and navigation interactions.
   */
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState();
  const [activeButton, setActiveButton] = useState(0);
  const actionMenuRef = useRef(null);

  // ----- IMPORTANT DATA
  /**
   * Stores test orders fetched from the backend.
   */
  const [testOrders, setTestOrders] = useState([]);
  console.log("TEST REQUESTS RESPONSE", testOrders);

  // ----- MAIN LOGIC FUNCTIONS
  /**
   * Fetches test orders to populate the table rows.
   */
  const fetchTestOrders = async () => {
    try {
      const response = await getTestOrders();
      setTestOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ----- HANDLERS
  /**
   * Handles actions (process, view, delete) for test orders and triggers popups accordingly.
   * @param {string} action - The action to be performed.
   * @param {Object} testOrderDetails - Details of the selected test order.
   */
  const handleActionClick = (action, testOrderDetails) => {
    console.log(`Performing ${action} on ID:${testOrderDetails}`);

    if (action === "Process Test Order") {
      setPopupContent(
        <PopupSelectTestOrder
          onClose={() => setShowPopup(false)}
          testOrderDetails={testOrderDetails}
        />
      );
    } else if (action === "View Test Order") {
      setPopupContent(
        <PopupViewTestOrder
          onClose={() => setShowPopup(false)}
          testOrderDetails={testOrderDetails}
        />
      );
    } else if (action === "Delete Order") {
      setPopupContent(
        <PopupDeleteTestOrder
          onClose={() => setShowPopup(false)}
          testOrderDetails={testOrderDetails}
        />
      );
    }
    setShowPopup(true);
  };

  /**
   * Updates the active filter button state.
   * @param {number} index - Index of the clicked filter button.
   */
  const handleFilterClick = (index) => {
    setActiveButton(index);
  };

  /**
   * Detects clicks outside the action menu to close it.
   * @param {Event} event - Click event.
   */
  const handleClickOutside = (event) => {
    if (
      actionMenuRef.current &&
      !actionMenuRef.current.contains(event.target)
    ) {
      setMenuOpen(null);
    }
  };

  // ----- USE EFFECTS
  /**
   * Adds an event listener to close the action menu when clicking outside.
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Fetches test orders when the component mounts or when the popup closes.
   */
  useEffect(() => {
    if (!showPopup) {
      fetchTestOrders();
    }
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching user data</p>;
  }

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
                        onClick={() =>
                          toggleActionMenu(row.id, menuOpen, setMenuOpen)
                        }
                        className={styles.moreActionsBtn}
                      >
                        <img
                          src="/icon-three-dots.png"
                          alt="More Actions"
                          className={styles.moreActionsIcon}
                        />
                      </button>

                      {menuOpen === row.id && (
                        <div ref={actionMenuRef} className={styles.menu}>
                          <ul>
                            {row.lab_technician_appointment.status ===
                              "Completed" && (
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
                            {curUser[0].role === "lab_admin" && (
                              <li
                                onClick={() =>
                                  handleActionClick("View Test Order", row)
                                }
                              >
                                <i
                                  className="fa-regular fa-circle-xmark"
                                  style={{ color: "red" }}
                                ></i>{" "}
                                View Order
                              </li>
                            )}
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
                                    handleActionClick("Delete Order", row)
                                  }
                                >
                                  <i
                                    className="fa-regular fa-circle-xmark"
                                    style={{ color: "red" }}
                                  ></i>{" "}
                                  Delete Order
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
  );
};

export default TestOrders;

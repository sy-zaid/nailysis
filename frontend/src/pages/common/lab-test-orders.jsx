import React, { useState, useRef, useEffect } from "react";
import styles from "./all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import PopupSelectTestOrder from "../../components/Popup/popups-labs/select-test-order-popup";
import PopupViewTestOrder from "../../components/Popup/popups-labs/view-test-order-popup";
import PopupDeleteTestOrder from "../../components/Popup/popups-labs/delete-test-order-popup";

import { getTestOrders } from "../../api/labsApi";

import {
  getAccessToken,
  getStatusClass, 
  getResultsClass,
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
 * Additionally, it now implements dynamic filtering, searching, and sorting.
 *
 * Filters:
 * 1) Scheduled appointments (from appointment status)
 * 2) Pending tests (from test status)
 * 3) Review required (from test status)
 *
 * Sorting options:
 * 1) Default (Last updated first)
 * 2) Oldest first
 * 3) Price low to high
 * 4) Price high to low
 *
 * @returns {JSX.Element} The rendered TestOrders component.
 */
const TestOrders = () => {
  // ----- TOKENS & USER INFORMATION
  const { data: curUser, isLoading, error } = useCurrentUserData();
  const token = getAccessToken();

  // ----- POPUPS & NAVIGATION
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState();
  // We'll use activeFilter as a string for clarity (e.g., "All", "Scheduled", "Pending", "Review")
  const [activeFilter, setActiveFilter] = useState("All");

  // ----- IMPORTANT DATA
  const [testOrders, setTestOrders] = useState([]);
  const [filteredTestOrders, setFilteredTestOrders] = useState([]); // Data after filtering, searching, sorting
  console.log("TEST REQUESTS RESPONSE", testOrders);

  // ----- SEARCH & SORT STATE
  const [searchQuery, setSearchQuery] = useState("");
  // Sort options: "last-updated" (default), "oldest", "price-asc", "price-desc"
  const [sortOption, setSortOption] = useState("last-updated");


  // ----- MAIN LOGIC FUNCTIONS
  const fetchTestOrders = async () => {
    try {
      const response = await getTestOrders();
      setTestOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ----- HANDLERS

  // Action menu click handler (keeps your original logic)
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

  // Filtering Handler
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Search Handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Sorting Handler
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // ----- USE EFFECTS

  // Close the action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(`.${styles.menu}`) === null) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch test orders on mount or when popup closes
  useEffect(() => {
    if (!showPopup) {
      fetchTestOrders();
    }
  }, [token, showPopup]);

  // Main filtering, searching, and sorting effect:
  // This effect recalculates filteredTestOrders whenever testOrders, activeFilter, searchQuery, or sortOption changes.
  useEffect(() => {
    let data = [...testOrders];

    // Filter based on activeFilter
    if (activeFilter === "Scheduled Appointments") {
      data = data.filter(
        (order) =>
          order.lab_technician_appointment?.status === "Scheduled"
      );
    } else if (activeFilter === "Pending Tests") {
      data = data.filter((order) => order.test_status === "Pending");
    } else if (activeFilter === "Review Required") {
      data = data.filter((order) => order.test_status === "Review Required");
    }
    // "All" shows all orders

    // Search filter (across all fields)
    if (searchQuery) {
      data = data.filter((order) => {
        const firstName = order.lab_technician_appointment?.patient?.user?.first_name || "";
        const lastName = order.lab_technician_appointment?.patient?.user?.last_name || "";
        const fullName = `${firstName} ${lastName}`.toLowerCase();

        const technician = order.lab_technician_appointment?.technician_name?.toLowerCase() || "";
        const orderId = String(order.id);
        const testNames = order.test_types.map((test) => test.label).join(", ").toLowerCase();
        const status = order.lab_technician_appointment?.status?.toLowerCase() || "";
        const testStatus = order.test_status?.toLowerCase() || "";
        const price = String(order.lab_technician_appointment?.fee || "");
        const resultStatus = order.results_available ? "yes" : "no";

        return (
          fullName.includes(searchQuery) ||
          technician.includes(searchQuery) ||
          orderId.includes(searchQuery) ||
          testNames.includes(searchQuery) ||
          status.includes(searchQuery) ||
          testStatus.includes(searchQuery) ||
          price.includes(searchQuery) ||
          resultStatus.includes(searchQuery)
        );
      });
    }


    // Sorting
    if (sortOption === "last-updated") {
      // Latest first (descending by updated_at)
      data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
    } else if (sortOption === "oldest") {
      // Oldest first (ascending by updated_at)
      data.sort(
        (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
      );
    } else if (sortOption === "price-asc") {
      data.sort(
        (a, b) =>
          (a.lab_technician_appointment?.fee || 0) - (b.lab_technician_appointment?.fee || 0)
      );
    } else if (sortOption === "price-desc") {
      data.sort(
        (a, b) =>
          (b.lab_technician_appointment?.fee || 0) - (a.lab_technician_appointment?.fee || 0)
      );
    }

    setFilteredTestOrders(data);
  }, [testOrders, activeFilter, searchQuery, sortOption]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching user data</p>;
  }

  // Close the action menu when clicking outside (menuRef)
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [menuOpen]);

  const inProgressCount = filteredTestOrders.filter(
    order => order.test_status === "In Progress"
  ).length;
  const completedCount = filteredTestOrders.filter(
    order => order.test_status === "Completed"
  ).length;
  

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
          {/* Filters */}
          <div className={styles.filters}>
            {["All", "Scheduled Appointments", "Pending Tests", "Review Required"].map((filter, index) => (
              <button
                key={index}
                className={`${styles.filterButton} ${
                  activeFilter === filter ? styles.active : ""
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
                <p>
                  Total Records: {filteredTestOrders.length} | In-Progress: {inProgressCount} | Completed: {completedCount}
                </p>
          </div>

          {/* Controls: Bulk Action, Sorting and Search */}
          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>
              <select className={styles.sortBy} onChange={handleSortChange} value={sortOption}>
                <option value="last-updated">Sort By: Last Updated</option>
                <option value="oldest">Sort By: Oldest First</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
              <input
                className={styles.search}
                type="text"
                placeholder="Search by Test, Patient Name"
                value={searchQuery}
                onChange={handleSearch}
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
                  {filteredTestOrders.map((row, index) => (
                    <tr key={row.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Order ID">{row.id}</td>
                      <td data-label="Patient Name">
                        {row.lab_technician_appointment?.patient?.user?.first_name}{" "}
                        {row.lab_technician_appointment?.patient?.user?.last_name}
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
                        className={getStatusClass(row.lab_technician_appointment.status, styles)}
                      >
                        {row.lab_technician_appointment.status}
                      </td>
                      <td
                        data-label="Status"
                        className={getStatusClass(row.test_status, styles)}
                      >
                        {row.test_status}
                      </td>
                      <td data-label="Status">
                        <span className={getResultsClass(row.results_available, styles)}>
                          {row.results_available ? "Yes" : "No"}
                        </span>
                      </td>
                      {/* ACTION BUTTONS */}
                      <td>
                        <button
                          onClick={(event) =>
                            toggleActionMenu(row.id, menuOpen, setMenuOpen, setMenuPosition, event)
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
                          <div
                            ref={menuRef}
                            id={`menu-${row.id}`}
                            className={styles.menu}
                            style={{
                              top: `${menuPosition.top}px`,
                              left: `${menuPosition.left - 20}px`,
                              position: "absolute",
                            }} 
                          >
                            <ul>
                              {row.lab_technician_appointment.status === "Completed" && (
                                <li onClick={() => handleActionClick("Process Test Order", row)}>
                                  <i className="fa-solid fa-repeat"></i> Process Test Order
                                </li>
                              )}
                              <li onClick={() => handleActionClick("Edit Details", row)}>
                                <i className="fa-solid fa-pen"></i> Edit Details
                              </li>
                              {curUser[0].role === "lab_admin" && (
                                <>
                                  <li onClick={() => handleActionClick("View Test Order", row)}>
                                    <i className="fa-solid fa-eye"></i>{" "}
                                    View Order
                                  </li>
                                  <li onClick={() => handleActionClick("Download as PDF", row)}>
                                    <i className="fa-regular fa-file-pdf"></i> Download as PDF
                                  </li>
                                  <li onClick={() => handleActionClick("Print Code", row)}>
                                    <i className="bx bx-qr-scan"></i> Print Code
                                  </li>
                                  <li onClick={() => handleActionClick("Delete Order", row)}>
                                    <i class="fa-solid fa-trash"></i>{" "}
                                    Delete Order
                                  </li>
                                </>
                              )}
                              {curUser[0].role !== "lab_admin" && (
                                // If needed, add additional actions for other roles
                                <></>
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

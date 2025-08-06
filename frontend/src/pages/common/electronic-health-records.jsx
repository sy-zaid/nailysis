//  Importing Packages and Dependencies
import React, { useState, useEffect, useRef } from "react";
import styles from "./all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header.jsx";

// Importing Popups for performing actions on EHR Records
import PopupEHREdit from "../../components/Popup/popups-electronic-health-records/popup-ehr-edit";
import PopupEHRDelete from "../../components/Popup/popups-electronic-health-records/popup-ehr-delete";
import PopupEHRCreate from "../../components/Popup/popups-electronic-health-records/popup-ehr-create";
import { toast } from "react-toastify";
// Importing Popups for actions
import PopupAllReportsList from "../../components/Popup/popups-labs/all-reports-list-popup.jsx";

// Importing Utility Functions
import { useEhrUpdatesWS } from "../../sockets/ehrSocket";
import {
  formatEhrRecords,
  toggleActionMenu,
  handleOpenPopup,
  handleClosePopup,
  getAccessToken,
  getRole,
} from "../../utils/utils";
import { getEHR, addEHRToMedicalHistory } from "../../api/ehrApi";
import useCurrentUserData from "../../useCurrentUserData";

/**
 * **ElectronicHealthRecord Component**
 *
 * This component displays a table of Electronic Health Records (EHR) and
 * allows users (doctors) to add, edit, or delete records.
 *
 * - Fetches EHR data from the API on mount.
 * - Uses WebSockets to receive real-time updates.
 * - Provides action buttons for doctors to manage records.
 * - Displays EHR details in a formatted table.
 *
 * @component
 */
const ElectronicHealthRecord = () => {
  // Default sort config: sorted by "last_updated" in descending order (latest first)
  const [sortConfig, setSortConfig] = useState({
    key: "last_updated",
    direction: "desc",
  });

  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [popupContent, setPopupContent] = useState(); // Store popup content
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const [records, setRecords] = useState([]); // Store EHR records
  const curUserRole = getRole(); // Get current user role

  const { data: curUser } = useCurrentUserData(); // Fetch user data;

  const [activeButton, setActiveButton] = useState(0); // Tracks which filter button is active
  const [filteredRecords, setFilteredRecords] = useState([]); // Stores the records after applying filters and search queries.
  const [searchQuery, setSearchQuery] = useState(""); // Stores the current search input to filter records dynamically.
  const [selectAll, setSelectAll] = useState(false); // Tracks whether the "Select All" checkbox is checked.
  const [selectedRecords, setSelectedRecords] = useState([]); // Stores an array of selected record IDs for bulk actions.

  // Initialize WebSocket to receive real-time EHR updates
  useEhrUpdatesWS(setRecords);

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
    onClose();
  };

  // Select or Deselect All Records (using Checkboxes)
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRecords(sortedRecords.map((record) => record.id)); // Select all
    } else {
      setSelectedRecords([]); // Deselect all
    }
  };

  // Toggle Selection for a Single Record
  const handleSelectRecord = (id) => {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((recordId) => recordId !== id)
        : [...prevSelected, id]
    );
  };

  // Filter EHR Records based on selected filter
  const handleFilterClick = (index) => {
    setActiveButton(index);

    if (!records.length) return; // Ensure records exist

    let updatedRecords = [...records];

    if (index === 1) {
      // Abnormal Results should check nail_image_analysis
      updatedRecords = updatedRecords.filter((record) =>
        String(record.nail_image_analysis || "")
          .toLowerCase()
          .includes("abnormal")
      );
    } else if (index === 2) {
      // Emergency Condition should check category field
      updatedRecords = updatedRecords.filter(
        (record) => String(record.category || "").toLowerCase() === "emergency"
      );
    } else if (index === 3 && curUser?.length > 0) {
      const fullName =
        `${curUser[0]?.first_name} ${curUser[0]?.last_name}`.toLowerCase();
      updatedRecords = updatedRecords.filter(
        (record) => record.consulted_by?.toLowerCase() === fullName
      );
    }

    setFilteredRecords(updatedRecords);
  };

  // Function to sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    // console.log(valA, valB);

    if (sortConfig.key === "last_updated") {
      // Replace " | " with a space so the Date object can parse the string correctly.
      valA = valA ? new Date(valA.replace(/\s*\|\s*/, " ")) : new Date(0);
      valB = valB ? new Date(valB.replace(/\s*\|\s*/, " ")) : new Date(0);
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Change Sorting based on user selection
  const handleSortChange = (key) => {
    if (key === "last_updated") {
      // When the default option is selected, sort by last_updated in descending order (latest first)
      setSortConfig({ key, direction: "desc" });
    } else if (key === "oldest") {
      // When "Oldest Record" is selected, sort in ascending order
      setSortConfig({ key: "last_updated", direction: "asc" });
    } else {
      setSortConfig((prev) => ({
        key,
        direction:
          prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    }
  };

  // Fetches EHR data from the backend and formats it.
  const fetchData = async () => {
    let response;
    try {
      if (curUserRole === "patient") {
        if (!curUser || curUser.length === 0) return;
        response = await getEHR(curUser[0].user_id);
      } else {
        response = await getEHR();
      }

      if (!response || !response.data) return;

      const formattedData = formatEhrRecords(response.data, "ehr_create");
      setRecords(formattedData);

      // Ensure filter is applied AFTER setting records
      setTimeout(() => {
        handleFilterClick(activeButton);
      }, 0);
    } catch (error) {
      console.error("Error fetching EHR data:", error);
    }
  };

  // Apply filters and search when records or user data changes
  useEffect(() => {
    let updatedRecords = [...records];

    // Apply filters based on active button selection
    if (activeButton === 1) {
      updatedRecords = updatedRecords.filter((record) =>
        String(record.nail_image_analysis || "")
          .toLowerCase()
          .includes("abnormal")
      );
    } else if (activeButton === 2) {
      updatedRecords = updatedRecords.filter(
        (record) => String(record.category || "").toLowerCase() === "emergency"
      );
    } else if (activeButton === 3 && curUser?.length > 0) {
      const fullName =
        `${curUser[0]?.first_name} ${curUser[0]?.last_name}`.toLowerCase();
      updatedRecords = updatedRecords.filter(
        (record) => (record.consulted_by || "").toLowerCase() === fullName
      );
    }

    // Apply dynamic search filter
    if (searchQuery.trim() !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      updatedRecords = updatedRecords.filter((record) => {
        return Object.keys(record).some((key) => {
          // Ensure value is a string before searching
          const value = record[key];
          return value && String(value).toLowerCase().includes(lowerCaseQuery);
        });
      });
    }

    setFilteredRecords(updatedRecords);
  }, [activeButton, records, curUser, searchQuery]);

  // Fetch data when `curUser` updates
  useEffect(() => {
    if (curUser) {
      fetchData();
    }
  }, [curUser]); // Re-run when `curUser` updates

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

  /**
   * Handles actions on EHR records (Edit, Delete, Add New).
   *
   * @param {string} action - The selected action type (e.g., "Edit", "Delete").
   * @param {object} recordDetails - The full details of the selected record.
   */
  const handleActionClick = (action, recordDetails) => {
    // console.log(`Performing ${action} on`, recordDetails);
    setMenuOpen(null); // Close action menu

    if (action === "Edit") {
      setPopupContent(
        <PopupEHREdit
          onClose={handleClosePopup}
          recordDetails={recordDetails}
        />
      );
      setShowPopup(true);
    } else if (action === "Delete") {
      setPopupContent(
        <PopupEHRDelete
          onClose={handleClosePopup}
          recordDetails={recordDetails}
        />
      );
      setShowPopup(true);
    } else if (action === "AddToMH") {
      // console.log("Sending this to add medical history", recordDetails);
      addEHRToMedicalHistory(recordDetails);

      toast.success("Updated Medical History with Selected Record");
    } else if (action === "Add New Record") {
      setPopupContent(<PopupEHRCreate onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "All Reports List") {
      setPopupContent(
        <PopupAllReportsList
          patient_id={recordDetails?.patient_id}
          onClose={handleClosePopup}
        />
      );
      setShowPopup(true);
    }
  };

  // console.log("Sorted Records:", sortedRecords);

  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}

      {/* Page Header */}
      <div className={styles.pageTop}>
        <Header
          mainHeading={"Electronic Health Records"}
          subHeading={"View and manage patient health records"}
        />
      </div>
      {showPopup && popupContent}
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          {/* Filter buttons with dynamic active state */}
          <div className={styles.filters}>
            {(curUserRole === "doctor" ||
              curUserRole === "clinic_admin" ||
              curUserRole === "patient") && (
              <>
                <button
                  className={`${styles.filterButton} ${
                    activeButton === 0 ? styles.active : ""
                  }`}
                  onClick={() => handleFilterClick(0)}
                >
                  All
                </button>
                {curUserRole === "doctor" && (
                  <button
                    className={`${styles.filterButton} ${
                      activeButton === 3 ? styles.active : ""
                    }`}
                    onClick={() => handleFilterClick(3)}
                  >
                    Your Patients
                  </button>
                )}
                <button
                  className={`${styles.filterButton} ${
                    activeButton === 1 ? styles.active : ""
                  }`}
                  onClick={() => handleFilterClick(1)}
                >
                  Abnormal Results
                </button>
                <button
                  className={`${styles.filterButton} ${
                    activeButton === 2 ? styles.active : ""
                  }`}
                  onClick={() => handleFilterClick(2)}
                >
                  Emergency
                </button>

                <p>
                  Total Records: {filteredRecords.length}{" "}
                  {curUserRole === "doctor" && (
                    <>
                      | Your Patients:{" "}
                      {
                        filteredRecords.filter(
                          (record) =>
                            record.consulted_by?.toLowerCase() ===
                            `${curUser[0]?.first_name.toLowerCase()} ${curUser[0]?.last_name.toLowerCase()}`
                        ).length
                      }
                    </>
                  )}
                </p>
              </>
            )}

            {curUserRole === "doctor" && (
              <button
                className={styles.addButton}
                onClick={() => handleActionClick("Add New Record")}
              >
                + Add New Record
              </button>
            )}
          </div>

          {/* EHR Table */}
          <div className={styles.tableContainer}>
            {/* Sorting and Search Bar */}
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>

              {/* Sort Dropdown */}
              <select
                className={styles.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {/* Default option sorts by last_updated (latest first) */}
                <option value="last_updated">Sort By: Last Updated</option>
                <option value="patient_name">Patient Name (A-Z)</option>
                <option value="consulted_by">Doctor Name (A-Z)</option>
                <option value="category">Category</option>
                {/* Extra option to view the oldest records first */}
                <option value="oldest">Oldest Record</option>
              </select>

              {/* Search input */}
              <input
                className={styles.search}
                type="text"
                placeholder="Search"
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
                    {/* Select all checkbox */}
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>#</th>
                    <th>Record ID</th>
                    {curUserRole !== "patient" && <th>Patient ID</th>}
                    {curUserRole !== "patient" && <th>Patient Name</th>}
                    <th>Consulted By</th>
                    <th>Category</th>
                    <th>Medical Conditions</th>
                    <th>Medications</th>
                    <th>Family History</th>
                    <th>Immunization</th>
                    <th>Consultation Notes</th>
                    <th>Diagnostics</th>
                    <th>Last Updated</th>
                    <th>Test Reports</th>
                    {curUserRole === "doctor" && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {sortedRecords.map((record, index) => (
                    <tr key={record.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{record.id || "No ID"}</td>
                      {curUserRole !== "patient" && (
                        <td>{record.patient_id || "No ID"}</td>
                      )}
                      {curUserRole !== "patient" && (
                        <td>{record.patient_name}</td>
                      )}
                      <td>{record.consulted_by}</td>
                      <td>{record.category}</td>
                      <td>{record?.medical_conditions || "N/A" }</td>
                      <td>{record.medications}</td>
                      <td>{record.family_history}</td>
                      <td>{record.immunization}</td>
                      <td>{record.notes}</td>
                      <td>{record.diagnoses}</td>
                      <td>{record.last_updated}</td>
                      <td>
                        <button
                          className={styles.viewButton}
                          onClick={() =>
                            handleActionClick("All Reports List", record)
                          }
                        >
                          View Reports
                        </button>
                      </td>
                      {/* Action Buttons */}
                      {curUserRole === "doctor" && (
                        <td>
                          <button
                            onClick={(event) =>
                              toggleActionMenu(
                                record.id,
                                menuOpen,
                                setMenuOpen,
                                setMenuPosition,
                                event
                              )
                            }
                            className={styles.moreActionsBtn}
                          >
                            <img
                              src="/icon-three-dots.png"
                              alt="More Actions"
                              className={styles.moreActionsIcon}
                            />
                          </button>

                          {menuOpen === record.id && (
                            <div
                              ref={menuRef}
                              id={`menu-${record.id}`}
                              className={styles.menu}
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                position: "absolute",
                              }}
                            >
                              <ul>
                                <li
                                  onClick={() =>
                                    handleActionClick("Edit", record)
                                  }
                                >
                                  <i className="fa-solid fa-pen"></i>Edit
                                </li>
                                <li
                                  onClick={() =>
                                    handleActionClick("Delete", record)
                                  }
                                >
                                  <i className="fa-solid fa-trash"></i>Delete
                                </li>
                                <li
                                  onClick={() =>
                                    handleActionClick("AddToMH", record.id)
                                  }
                                >
                                  <i className="fa-solid fa-plus"></i>Add to
                                  Medical History
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      )}
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

export default ElectronicHealthRecord;

import React, { useEffect, useState } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";

import CancellationRequestForm from "../lab-technician/cancellation-request-form"; // Import CancellationRequestForm
import PopupManageSlotsLabTechnician from "../../components/Popup/popups-lab-technician-appointments/manage-slots-lab-technician-popup";
import TechnicianAppointmentCheckinPopup from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-checkin-popup";
import TechnicianAppointmentReschedulePopup from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-reschedule-popup";

import useCurrentUserData from "../../useCurrentUserData";
import {
  cancelTechnicianAppointment,
  getLabTechnicianAppointments,
} from "../../api/appointmentsApi";

// UTILS.JS FUNCTIONS
import {
  getAccessToken,
  handleOpenPopup,
  handleClosePopup,
  getStatusClass, 
  toggleActionMenu,
  convertDjangoDateTime,
  getResultsClass,
} from "../../utils/utils";
import PopupBookTechnicianAppointment from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-book-popup";

const AppointmentTechnician = () => {
  // ----- TOKENS AND USER INFORMATION
  const token = getAccessToken();
  const { data: curUser, isLoading, error } = useCurrentUserData(); // Use Logged-in user data from cache.

  // ----- POPUPS & NAVIGATION
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null); // State to track which popup to show
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });


  // ----- IMPORTANT DATA
  const [appointments, setAppointments] = useState([]);

  // Filtering, Searching, Sorting State
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");  
  const [sortOption, setSortOption] = useState("none");

  const [totalRecords, setTotalRecords] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);

  // Checkboxes State
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);


  // ----- HANDLERS

  // Filtering Logic
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  
    let filteredData = appointments;
  
    if (filter === "Scheduled Appointments") {
      filteredData = appointments.filter(app => app.status === "Scheduled");
    } else if (filter === "Pending Tests") {
      filteredData = appointments.filter(app => app.test_orders[0]?.test_status === "Pending");
    } else if (filter === "Today") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD
      filteredData = appointments.filter(app => 
        new Date(app.checkin_datetime).toISOString().split("T")[0] === today
      );
    }
  
    setFilteredAppointments(filteredData);
  };

  // Search Logic
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filteredData = appointments.filter((app) => {
      // Get all searchable fields as a single lowercase string
      const patientName = `${app.patient?.user?.first_name || ""} ${app.patient?.user?.last_name || ""}`.toLowerCase();
      const appointmentId = app.appointment_id?.toString().toLowerCase();
      const gender = app.patient?.gender?.toLowerCase() || "";
      const dateTime = new Date(app.checkin_datetime).toLocaleString().toLowerCase();
      const fee = app.fee?.toString().toLowerCase() || "";
      const testStatus = app.test_orders[0]?.test_status?.toLowerCase() || "";
      const appointmentStatus = app.status?.toLowerCase() || "";
      const technicianName = `${app.lab_technician?.user?.first_name || ""} ${app.lab_technician?.user?.last_name || ""}`.toLowerCase();
      const specialization = app.lab_technician?.specialization?.toLowerCase() || "";
      const resultsAvailable = app.test_orders[0]?.results_available ? "yes" : "no";
      const requestedTests = app.test_orders.flatMap(order => order.test_types.map(test => test.label)).join(" ").toLowerCase();
      const additionalNotes = app.notes?.toLowerCase() || "";

      
      // Convert all fields into one searchable string
      const searchableText = `${patientName} ${appointmentId} ${gender} ${dateTime} ${fee} ${testStatus} ${appointmentStatus} ${technicianName} ${specialization} ${resultsAvailable} ${requestedTests} ${additionalNotes}`;

      return searchableText.includes(query);
    });
  
    setFilteredAppointments(filteredData);
  };
  

  // Sorting Logic
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOption(selectedSort);
  
    let sortedData = [...filteredAppointments]; // Work on a copy of filteredAppointments
  
    if (selectedSort === "fee-asc") {
      sortedData.sort((a, b) => a.fee - b.fee);
    } else if (selectedSort === "fee-desc") {
      sortedData.sort((a, b) => b.fee - a.fee);
    } else if (selectedSort === "date-asc") {
      sortedData.sort((a, b) => new Date(a.checkin_datetime) - new Date(b.checkin_datetime));
    } else if (selectedSort === "date-desc") {
      sortedData.sort((a, b) => new Date(b.checkin_datetime) - new Date(a.checkin_datetime));
    }
  
    setFilteredAppointments(sortedData);
  };
  

  // Handles the action when an item is clicked in the action menu
  const handleActionClick = (action, appointmentId) => {
    console.log(`Action: ${action} on Appointment ID: ${appointmentId}`);
    setMenuOpen(null); // Close the menu after action

    if (action === "Button Cancellation Request") {
      setPopupContent(
        <CancellationRequestForm
          appointmentId={appointmentId}
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true); // Show the Cancellation Request Form popup
    } else if (action === "Action Cancel Appointment") {
      const handleCancellation = async (appointmentId, action) => {
        try {
          console.log(
            "SUBMITTING APPOINTMENT ID FOR CANCELLING",
            appointmentId
          );
          const response = await cancelTechnicianAppointment(appointmentId);
          alert(response.data.message);
          setAppointments();
        } catch (err) {
          console.log("Failed cancellation request.");
        }
      };
      handleCancellation(appointmentId, action);
    } else if (action === "Action Start Appointment") {
      setPopupContent(
        <TechnicianAppointmentCheckinPopup
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    } else if (action === "Button Manage Availability") {
      setPopupContent(
        <PopupManageSlotsLabTechnician
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true);
    } else if (action === "Button Book New Appointment") {
      setPopupContent(
        <PopupBookTechnicianAppointment
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true);
    } else if (action === "Reschedule") {
      setPopupContent(
        <TechnicianAppointmentReschedulePopup
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    }
  };


  // ----- USE EFFECTS
  // Fetch lab appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getLabTechnicianAppointments();
        setAppointments(response.data);
        console.log("Response from technician appointment", response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (!showPopup) {
      fetchAppointments();
    }
  }, [showPopup, token]);


  // Update Total Records and Scheduled Count
  useEffect(() => {
    setTotalRecords(filteredAppointments.length);
    setScheduledCount(filteredAppointments.filter(app => app.status === "Scheduled").length);
  }, [filteredAppointments]);


  // Sort Appointments Based on Selected Criteria
  useEffect(() => {
    let sortedData = [...appointments];
  
    if (sortOption === "none") {
      // Default to sorting by latest first (date-desc)
      sortedData.sort((a, b) => new Date(b.checkin_datetime) - new Date(a.checkin_datetime));
    } else if (sortOption === "fee-asc") {
      sortedData.sort((a, b) => a.fee - b.fee);
    } else if (sortOption === "fee-desc") {
      sortedData.sort((a, b) => b.fee - a.fee);
    } else if (sortOption === "date-asc") {
      sortedData.sort((a, b) => new Date(a.checkin_datetime) - new Date(b.checkin_datetime));
    } else if (sortOption === "date-desc") {
      sortedData.sort((a, b) => new Date(b.checkin_datetime) - new Date(a.checkin_datetime));
    }
  
    setFilteredAppointments(sortedData);
  }, [appointments, sortOption]); 

  // Close the action menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen !== null) {
        const menuElement = document.getElementById(`menu-${menuOpen}`);
        if (!menuElement || !menuElement.contains(event.target)) {
          setMenuOpen(null);
        }
      } 
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  
  

  return (
    <div className={styles.pageContainer}>
      {/* Render the correct popup based on the action */}
      {showPopup && popupContent}{" "}
      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Appointments'}
            subHeading={'Here you can view and manage all the booked appointments'}
        />
      </div>

      <div className={styles.mainContent}>
        
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            {["All", "Scheduled Appointments", "Pending Tests", "Today"].map((filter, index) => (
              <button
                key={index}
                className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}

            <p>Total Records: {totalRecords} | Scheduled: {scheduledCount}</p>

              {curUser[0].role === "lab_technician" && (
                <button
                  onClick={() => {
                    handleActionClick("Button Manage Availability");
                  }}
                  className={styles.addButton}
                >
                  Manage Availability
                </button>
              )}
              {(curUser[0].role === "patient" ||
                curUser[0].role === "lab_admin") && (
                <button
                  className={styles.addButton}
                  onClick={() => {
                    handleActionClick("Button Book New Appointment");
                  }}
                >
                  {curUser[0].role === "patient"
                    ? "Book Lab Appointment"
                    : "New Lab Appointment"}
                </button>
              )}
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>
              
              <select className={styles.sortBy} onChange={handleSortChange} value={sortOption}>
                <option value="none">Sort By: None</option>
                <option value="fee-asc">Fee (Low to High)</option>
                <option value="fee-desc">Fee (High to Low)</option>
                <option value="date-asc">Appointment Date (Oldest First)</option>
                <option value="date-desc">Appointment Date (Latest First)</option>
              </select>

              <input
                className={styles.search}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <hr />
            <br />

            <div className={styles.tableWrapper}>
              <table
                className={styles.table}
              >
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => {
                          setSelectAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedAppointments(filteredAppointments.map((app) => app.appointment_id));
                          } else {
                            setSelectedAppointments([]);
                          }
                        }}
                      />
                    </th>
                    <th>Appointment ID</th>

                    {curUser[0].role !== "patient" && <th>Patient Name</th>}
                    {curUser[0].role !== "patient" && <th>Gender</th>}

                    <th>Date & Time</th>
                    <th>Requested Tests</th>

                    {curUser[0].role !== "lab_technician" && (
                      <th>Technician Name</th>
                    )}
                    {curUser[0].role !== "lab_technician" && (
                      <th>Specialization</th>
                    )}

                    <th>Fee</th>
                    <th>Additional Notes</th>
                    <th>Test Status</th>
                    <th>Appointment Status</th>
                    <th>Results Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>

              <tbody>
                {filteredAppointments.map((row, index) => (
                  <tr
                    key={row.appointment_id}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedAppointments.includes(row.appointment_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAppointments([...selectedAppointments, row.appointment_id]);
                          } else {
                            setSelectedAppointments(selectedAppointments.filter((id) => id !== row.appointment_id));
                          }
                        }}
                      />
                    </td>

                    <td>{row.appointment_id}</td>
                    {curUser[0].role !== "patient" && (
                      <td>
                        {row.patient?.user?.first_name || "No first name"}{" "}
                        {row.patient?.user?.last_name || "No last name"}
                      </td>
                    )}
                    {curUser[0].role !== "patient" && (
                      <td>{row.patient?.gender || "N/A"}</td>
                    )}
                    <td>
                      {row?.checkin_datetime
                        ? convertDjangoDateTime(row.checkin_datetime)
                        : "N/A"}
                    </td>
                    <td>
                      {row.test_orders.length > 0
                        ? row.test_orders[0].test_types.map(test => test.label).join(", ")
                        : "N/A"}
                    </td>

                      {curUser[0].role !== "lab_technician" && (
                        <td>
                          {row.lab_technician?.user?.first_name || "N/A"}{" "}
                          {row.lab_technician?.user?.last_name || "N/A"}
                        </td>
                      )}

                      {curUser[0].role !== "lab_technician" && (
                        <td>{row.lab_technician?.specialization || "N/A"}</td>
                      )}
                      <td>{row.fee}</td>

                      <td>{row.notes || "No additional notes"}</td>

                      <td
                        className={getStatusClass(
                          row.test_orders?.[0]?.test_status || "",
                          styles
                        )}
                      >
                        {row.test_orders?.[0]?.test_status || " "}
                      </td>

                      <td className={getStatusClass(row.status, styles)}>
                        {row.status}
                      </td>

                      <td>
                        <span className={getResultsClass(row.test_orders[0]?.results_available, styles)}>
                          {row.test_orders[0]?.results_available ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* ------------------------- ACTION BUTTONS -------------------------*/}
                      
                      <td>
                      <button
                        onClick={(event) => toggleActionMenu(row.appointment_id, menuOpen, setMenuOpen, setMenuPosition, event)}
                        className={styles.moreActionsBtn}
                      >
                        <img src="/icon-three-dots.png" alt="More Actions" className={styles.moreActionsIcon} />
                      </button>

                      {menuOpen === row.appointment_id && (
                        <div
                          id={`menu-${row.appointment_id}`}
                          className={styles.menu}
                          style={{
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`,
                            position: "absolute",
                          }}
                        >
                          <ul>
                            {curUser[0].role === "lab_technician" && row.status !== "Completed" && (
                              <li onClick={() => handleActionClick("Action Start Appointment", row)}>
                                <i className="fa-solid fa-plus"></i>Start Appointment
                              </li>
                            )}
                            {(curUser[0].role === "patient" || curUser[0].role === "lab_technician") && (
                              <li onClick={() => handleActionClick("Button Cancellation Request", row.appointment_id)}>
                                <i className="fa-solid fa-ban"></i>Request Cancellation
                              </li>
                            )}
                            {curUser[0].role === "lab_admin" && (
                              <li onClick={() => handleActionClick("Reschedule", row)}>
                                <i className="fa-solid fa-calendar-days"></i>Reschedule
                              </li>
                            )}
                            {curUser[0].role === "lab_admin" && (
                              <li onClick={() => handleActionClick("Action Cancel Appointment", row.appointment_id)}>
                                <i className="fa-solid fa-rectangle-xmark"></i>Cancel Appointment
                              </li>
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

export default AppointmentTechnician;

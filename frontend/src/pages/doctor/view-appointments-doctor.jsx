import React, { useEffect, useState, useRef } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import CancellationRequestForm from "./cancellation-request-form"; // Import CancellationRequestForm
import CheckinDoctorAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-checkin-popup";
import PopupManageSlotsDoctor from "../../components/Popup/popups-doctor-appointments/manage-slots-doctor-popup";
import Header from "../../components/Dashboard/Header/Header";

// UTILS.JS FUNCTIONS
import {
  convertDjangoDateTime,
  getStatusClass,
  toggleActionMenu,
} from "../../utils/utils";

// Add at the top of the file:
// First define the component
const AppointmentDoctor = (props) => {
  // ----- TOKENS AND USER INFORMATION
  const token = localStorage.getItem("access");

  // ----- POPUPS & NAVIGATION
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null); // State to track which popup to show
  const [activeButton, setActiveButton] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Filtering, Searching, Sorting State
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  }); // Set default sort to appointment date (latest first)
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState({});

  // ----- HANDLERS
  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  const handleAddAppointment = () => {
    navigate("/add-appointment");
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };

  // Handle the action when an item is clicked in the menu
  const handleActionClick = (action, appointmentId) => {
    console.log(`Action: ${action} on Appointment ID: ${appointmentId}`);
    setMenuOpen(null); // Close the menu after action

    if (action === "Cancel") {
      setPopupContent(
        <CancellationRequestForm
          appointmentId={appointmentId}
          onClose={handleClosePopup}
        />
      );
      setShowPopup(true);
    } else if (action === "Start Appointment") {
      setPopupContent(
        <CheckinDoctorAppointmentPopup
          appointmentDetails={appointmentId}
          onClose={handleClosePopup}
        />
      );
      setShowPopup(true);
    } else if (action === "Manage Availability") {
      setPopupContent(<PopupManageSlotsDoctor onClose={handleClosePopup} />);
      setShowPopup(true);
    }
    // Add logic for other actions like 'Edit' and 'Reschedule' if needed
  };

  // ----- SEARCHING, SORTING & FILTERING LOGIC FUNCTIONS

  // Filtering Logic
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date().toISOString().split("T")[0];

    if (activeFilter === "Scheduled" && appointment.status !== "Scheduled")
      return false;
    if (
      activeFilter === "Emergency Visit" &&
      appointment.appointment_type !== "Emergency Visit"
    )
      return false;
    if (activeFilter === "Today" && appointment.time_slot?.slot_date !== today)
      return false;

    const searchValue = searchQuery.toLowerCase();
    const matchesSearch =
      appointment.appointment_id
        ?.toString()
        .toLowerCase()
        .includes(searchValue) ||
      appointment.doctor?.user?.first_name
        ?.toLowerCase()
        .includes(searchValue) ||
      appointment.doctor?.user?.last_name
        ?.toLowerCase()
        .includes(searchValue) ||
      appointment.doctor?.specialization?.toLowerCase().includes(searchValue) ||
      appointment.time_slot?.slot_date?.toLowerCase().includes(searchValue) ||
      appointment.time_slot?.start_time?.toLowerCase().includes(searchValue) ||
      appointment.time_slot?.end_time?.toLowerCase().includes(searchValue) ||
      appointment.appointment_type?.toLowerCase().includes(searchValue) ||
      appointment.status?.toLowerCase().includes(searchValue) ||
      (appointment.fee &&
        `PKR ${appointment.fee}`.toLowerCase().includes(searchValue)) ||
      (appointment.doctor?.years_of_experience &&
        appointment.doctor?.years_of_experience
          .toString()
          .toLowerCase()
          .includes(searchValue)) ||
      appointment.notes?.toLowerCase().includes(searchValue);

    return matchesSearch;
  });

  // Sorting Logic
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = new Date(a.time_slot?.slot_date).getTime();
    const bValue = new Date(b.time_slot?.slot_date).getTime();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Handles checkbox selection
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedAppointments = {};
    if (newSelectAll) {
      sotedAppointments.forEach((appointment) => {
        newSelectedAppointments[appointment.appointment_id] = true;
      });
    }
    setSelectedAppointments(newSelectedAppointments);
  };

  // Handle individual checkbox click
  const handleSelectOne = (appointmentId) => {
    setSelectedAppointments((prev) => {
      const updated = { ...prev, [appointmentId]: !prev[appointmentId] };

      const allChecked =
        sortedAppointments.length > 0 &&
        sortedAppointments.every((app) => updated[app.appointment_id]);
      setSelectAll(allChecked);

      return updated;
    });
  };

  // ----- USE EFFECTS
  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await api.get(
          `${props.apiUrl}/api/doctor_appointments/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(response.data);
        console.log("Response from doctor appointment", response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, [token, navigate]);

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
      {showPopup && popupContent}{" "}
      {/* Render the correct popup based on the action */}
      <div className={styles.pageTop}>
        <Navbar />
        <Header
          mainHeading={"Appointments"}
          subHeading={
            "Here you can view and manage all the booked appointments"
          }
        />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            {["All", "Scheduled", "Emergency Visit", "Today"].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterButton} ${
                  activeFilter === filter ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}

            <p>
              Total Records: {filteredAppointments.length} | Scheduled:{" "}
              {
                filteredAppointments.filter((app) => app.status === "Scheduled")
                  .length
              }
            </p>

            <button
              className={styles.addButton}
              onClick={() => handleActionClick("Manage Availability")}
            >
              Manage Availability
            </button>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>

              <select
                className={styles.sortBy}
                defaultValue="date-desc"
                onChange={(e) => {
                  const [key, direction] = e.target.value.split("-");
                  setSortConfig({ key, direction });
                }}
              >
                <option value="date-desc">
                  Appointment Date (Latest First)
                </option>
                <option value="date-asc">
                  Appointment Date (Oldest First)
                </option>
              </select>

              <input
                type="text"
                className={styles.search}
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
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Appointment ID</th>
                    <th>Patient Name</th>
                    <th>Gender</th>
                    <th>Appointment Type</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Additional Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedAppointments.map((row, index) => (
                    <tr key={row.appointment_id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!selectedAppointments[row.appointment_id]}
                          onChange={() => handleSelectOne(row.appointment_id)}
                        />
                      </td>
                      <td>{row.appointment_id}</td>
                      <td>
                        {row.patient?.user?.first_name || "No first name"}{" "}
                        {row.patient?.user?.last_name || "No last name"}
                      </td>
                      <td>{row.patient?.gender || "N/A"}</td>
                      <td>{row.appointment_type || "N/A"}</td>
                      <td>
                        {row.time_slot ? (
                          <>
                            {row.time_slot.slot_date} |{" "}
                            {row.time_slot.start_time}
                          </>
                        ) : (
                          convertDjangoDateTime(row.checkin_datetime)
                        )}
                      </td>
                      <td className={getStatusClass(row.status, styles)}>
                        {row.status}
                      </td>
                      <td>{row.notes || "No additional notes"}</td>

                      <td>
                        <button
                          onClick={(event) =>
                            toggleActionMenu(
                              row.appointment_id,
                              menuOpen,
                              setMenuOpen,
                              setMenuPosition,
                              event
                            )
                          }
                          className={styles.moreActionsBtn}
                          id={`action-btn-${row.appointment_id}`} // Add this line
                        >
                          <img
                            src="/icon-three-dots.png"
                            alt="More Actions"
                            className={styles.moreActionsIcon}
                          />
                        </button>
                        {menuOpen === row.appointment_id && ( // Change this condition
                          <div
                            ref={menuRef}
                            id={`menu-${row.appointment_id}`} // Use appointment_id consistently
                            className={styles.menu}
                            style={{
                              top: `${menuPosition.top}px`,
                              left: `${menuPosition.left}px`,
                              position: "absolute",
                            }}
                          >
                            <ul>
                              <li
                                onClick={() => {
                                  handleActionClick(
                                    "Cancel",
                                    row.appointment_id
                                  );
                                }}
                              >
                                Request Cancellation
                              </li>
                              <li
                                onClick={() =>
                                  handleActionClick("Start Appointment", row)
                                }
                              >
                                Start Appointment
                              </li>
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



export default AppointmentDoctor;

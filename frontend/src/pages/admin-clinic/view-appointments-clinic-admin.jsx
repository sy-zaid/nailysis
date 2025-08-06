import React, { act, useEffect, useState, useRef } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupAppointmentBook from "../../components/Popup/popups-doctor-appointments/doctor-appointment-book-popup";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import RescheduleAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-reschedule-popup";
import DeleteAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-delete-popup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";
import Header from "../../components/Dashboard/Header/Header";
import { toast } from "react-toastify";

// UTILS.JS FUNCTIONS
import {
  formatDateRange,
  getStatusClass,
  toggleActionMenu,
} from "../../utils/utils";

const AppointmentClinicAdmin = (onClose) => {
  // ----- TOKENS AND USER INFORMATION
  const token = localStorage.getItem("access");

  // ----- POPUPS AND NAVIGATION
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [activeButton, setActiveButton] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // ----- SEARCHING, SORTING & FILTERING STATES
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Set default sort to appointment date (latest first)
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState({});

  // ----- HANDLERS
  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup when button is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };

  // Handles checkbox selection
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedAppointments = {};
    if (newSelectAll) {
      sortedAppointments.forEach((appointment) => {
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

  // Handle the action when an item is clicked in the menu
  const handleActionClick = (action, appointmentId) => {
    console.log(`Action: ${action} on Appointment ID: ${appointmentId}`);
    setMenuOpen(null); // Close the menu after action

    if (action === "Cancel") {
      // POST the cancellation request
      const handleCancellation = async (appointmentId, action) => {
        try {
          console.log(
            "SUBMITTING APPOINTMENT ID FOR CANCELLING",
            appointmentId
          );
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_URL
            }/api/doctor_appointments/${appointmentId}/cancel_appointment/`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          );
          // alert(response.data.message);
          toast.success(
            response.data.message || "Appointment cancelled successfully",
            {
              className: "custom-toast",
            }
          );

          // Fetch updated appointments after cancellation
          fetchAppointments();
          // Optionally, refetch the cancellation requests list to reflect changes
        } catch (err) {
          console.log("Failed cancellation request.");
          if (err.response) {
            toast.error(
              err.response.data.error || "Failed cancellation request",
              { className: "custom-toast" }
            );
          } else {
            toast.error("Network Error", {
              className: "custom-toast",
            });
          }
        }
      };
      handleCancellation(appointmentId, action);
    } else if (action === "Reschedule") {
      setPopupContent(
        <RescheduleAppointmentPopup
          appointmentDetails={appointmentId}
          onClose={handleClosePopup}
        />
      );
      setShowPopup(true);
    } else if (action === "book_new_appointment") {
      setPopupContent(<PopupAppointmentBook onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "Delete") {
      setPopupContent(
        <DeleteAppointmentPopup
          onClose={handleClosePopup}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    }

    // Add logic for other actions like 'Edit' and 'Reschedule' if needed
  };

  // ----- MAIN LOGIC FUNCTIONS
  const fetchAppointments = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/`,
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

    // Searching Logic
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

    const aValue =
      sortConfig.key === "fee"
        ? a.fee || 0
        : new Date(a.time_slot?.slot_date).getTime();

    const bValue =
      sortConfig.key === "fee"
        ? b.fee || 0
        : new Date(b.time_slot?.slot_date).getTime();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // ----- USE EFFECTS
  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

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
      {showPopup && popupContent}
      {/* {showPopup && <PopupAppointmentBook onClose={handleClosePopup} />} */}
      {/* {showPopup && <RescheduleAppointmentPopup onClose={handleClosePopup} />} */}

      <div className={styles.pageTop}>
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
              onClick={() => handleActionClick("book_new_appointment")}
            >
              Book New Appointment
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
                <option value="fee-asc">Fee (Low to High)</option>
                <option value="fee-desc">Fee (High to Low)</option>
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
                    <th>#</th> {/* Serial Number */}
                    <th>Appointment ID</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Appointment Type</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Fee</th>
                    <th>Additional Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppointments.map((row, index) => (
                    <tr key={row.appointment_id}>
                      <td>{index + 1}</td> {/* Serial Number */}
                      <td>{row.appointment_id}</td> {/* Appointment ID */}
                      <td>
                        {row.patient?.user?.first_name || "No first name"}{" "}
                        {row.patient?.user?.last_name || "No last name"}
                      </td>{" "}
                      {/* Patient's Name */}
                      <td>
                        {row.doctor?.user?.first_name || "No first name"}{" "}
                        {row.doctor?.user?.last_name || "No last name"}
                      </td>{" "}
                      {/* Doctor's Name */}
                      <td>
                        {row.doctor?.specialization || "No specialization"}
                      </td>{" "}
                      {/* Specialization */}
                      <td>{row.appointment_type || "N/A"}</td>{" "}
                      {/* Appointment Type */}
                      <td>
                        {row.time_slot?.slot_date ? (
                          <>
                            {row.time_slot?.slot_date} |{" "}
                            {row.time_slot?.start_time} -{" "}
                            {row.time_slot?.end_time}
                          </>
                        ) : (
                          formatDateRange(
                            row.checkin_datetime,
                            row.checkout_datetime
                          )
                        )}
                      </td>{" "}
                      {/* Date & Time */}
                      <td className={getStatusClass(row.status, styles)}>
                        {row.status}
                      </td>{" "}
                      {/* Status */}
                      <td>
                        {row.fee ? `PKR ${row.fee}` : "Not available"}
                      </td>{" "}
                      {/* Fee */}
                      <td>{row.booking_date || "Not available"}</td>{" "}
                      {/* Additional Notes */}
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
                        >
                          <img
                            src="/icon-three-dots.png"
                            alt="More Actions"
                            className={styles.moreActionsIcon}
                          />
                        </button>

                        {menuOpen === row.appointment_id && (
                          <div
                            ref={menuRef}
                            id={`menu-${row.id}`}
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
                                <i className="fa-solid fa-rectangle-xmark"></i>
                                Cancel Appointment
                              </li>
                              <li
                                onClick={() =>
                                  handleActionClick("Reschedule", row)
                                }
                              >
                                <i className="fa-solid fa-pen"></i>Edit /
                                Reschedule Appointment
                              </li>
                              <li
                                onClick={() => handleActionClick("Delete", row)}
                              >
                                <i className="fa-solid fa-trash"></i>Delete
                                Appointment
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

export default AppointmentClinicAdmin;

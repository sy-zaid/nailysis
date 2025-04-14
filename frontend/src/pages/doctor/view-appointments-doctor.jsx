import React, { useEffect, useState, useRef } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import CancellationRequestForm from "./cancellation-request-form"; // Import CancellationRequestForm
import CheckinDoctorAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-checkin-popup";
import PopupManageSlotsDoctor from "../../components/Popup/popups-doctor-appointments/manage-slots-doctor-popup";

// UTILS.JS FUNCTIONS
import { getStatusClass, toggleActionMenu } from "../../utils/utils";

const AppointmentDoctor = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null); // State to track which popup to show
  const [activeButton, setActiveButton] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

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

    fetchAppointments();
  }, [token, navigate]);

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
          appointmentId={appointment.appointment_id}
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

  1; // Close the action menu when clicking outside of it
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
        <h1>Appointments</h1>
        <p>Here you can view and manage all the booked appointments</p>
        <button
          className={styles.addButton}
          onClick={() => handleActionClick("Manage Availability")}
        >
          Manage Availability
        </button>
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

            <button className={styles.addButton}>Cancel Appointment</button>
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
                    <th>#</th>
                    <th>Appointment ID</th>
                    <th>Patient Name</th>
                    <th>Gender</th>
                    <th>Appointment Type</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Additional Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((row, index) => (
                    <tr key={row.appointment_id}>
                      <td>{index + 1}</td>
                      <td>{row.appointment_id}</td>
                      <td>
                        {row.patient?.user?.first_name || "No first name"}{" "}
                        {row.patient?.user?.last_name || "No last name"}
                      </td>
                      <td>{row.patient?.gender || "N/A"}</td>
                      <td>{row.appointment_type || "N/A"}</td>
                      <td>
                        {row.time_slot?.slot_date} | {row.time_slot?.start_time}{" "}
                        - {row.time_slot?.end_time}
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

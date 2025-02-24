import React, { act, useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupAppointmentBook from "../../components/Popup/popup-appointment-book";
import PopupAppointmentDetails from "../../components/Popup/popup-appointment-details";
import PopupRescheduleAppointment from "../../components/Popup/popup-appointment-reschedule";
import PopupDeleteAppointment from "../../components/Popup/popup-appointment-delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";

const AppointmentClinicAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);
  
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
  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [token, navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Consulted":
        return styles.consulted;
      case "Cancelled":
        return styles.cancelled;
      default:
        return styles.scheduled;
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup when button is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };

  // Function to toggle the menu for a specific appointment
  const toggleMenu = (appointmentId) => {
    setMenuOpen(menuOpen === appointmentId ? null : appointmentId);
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
          alert(response.data.message); // Notify of success

          // Fetch updated appointments after cancellation
          fetchAppointments();
          // Optionally, refetch the cancellation requests list to reflect changes
        } catch (err) {
          console.log("Failed cancellation request.");
        }
      };
      handleCancellation(appointmentId, action);
    }else if (action === "Reschedule") {
      setPopupContent(
        <PopupRescheduleAppointment
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
        <PopupDeleteAppointment
          onClose={handleClosePopup}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    }

    // Add logic for other actions like 'Edit' and 'Reschedule' if needed
  };
  const [menuOpen, setMenuOpen] = useState(null);
  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}
      {/* {showPopup && <PopupAppointmentBook onClose={handleClosePopup} />} */}
      {/* {showPopup && <PopupRescheduleAppointment onClose={handleClosePopup} />} */}
      <PopupAppointmentDetails></PopupAppointmentDetails>

      <div className={styles.pageTop}>
        <Navbar />
        <h1>Appointments</h1>
        <p>Here you can view and manage all the booked appointments</p>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <div className={styles.filterTabs}>
              <button className={styles.filterButton}>All</button>
              <button className={styles.filterButton}>Upcoming</button>
              <button className={styles.filterButton}>Consulted</button>
              <button className={styles.filterButton}>Cancelled</button>
              <p className={styles.statusSummary}>50 completed, 4 upcoming</p>
            </div>
            <button
              className={styles.addButton}
              onClick={() => handleActionClick("book_new_appointment")}
            >
              Book New Appointment
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table
              className={styles.table}
              style={{ borderCollapse: "collapse" }}
            >
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
                  <th>Booking Date</th>
                  <th>Additional Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((row, index) => (
                  <tr
                    key={row.appointment_id}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
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
                      {row.appointment_date} {row.appointment_start_time}
                    </td>{" "}
                    {/* Date & Time */}
                    <td className={getStatusClass(row.status)}>
                      {row.status}
                    </td>{" "}
                    {/* Status */}
                    <td>{row.fee ? `PKR ${row.fee}` : "Not available"}</td>{" "}
                    {/* Fee */}
                    <td>{row.booking_date || "Not available"}</td>{" "}
                    {/* Booking Date */}
                    <td>{row.notes || "No additional notes"}</td>{" "}
                    {/* Additional Notes */}
                    <td>
                      <button
                        onClick={() => toggleMenu(row.appointment_id)}
                        className={styles.moreActionsBtn}
                      >
                        <img
                          src="/icon-three-dots.png"
                          alt="More Actions"
                          className={styles.moreActionsIcon}
                        />
                      </button>
                      {menuOpen === row.appointment_id && (
                        <div className={styles.menu}>
                          <ul>
                            <li
                              onClick={() => {
                                handleActionClick("Cancel", row.appointment_id);
                              }}
                            >
                              Cancel Appointment
                            </li>
                            <li
                              onClick={() =>
                                handleActionClick("Reschedule", row)
                              }
                            >
                              Edit / Reschedule Appointment
                            </li>
                            <li
                              onClick={() => handleActionClick("Delete", row)}
                            >
                              Delete Appointment
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
  );
};

export default AppointmentClinicAdmin;

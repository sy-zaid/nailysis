import React, { act, useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupAppointmentBook from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-book-popup";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import RescheduleAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-reschedule-popup";
import DeleteAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-delete-popup";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import api from "../../api";
import { getStatusClass } from "../../utils/utils";

const AppointmentLabAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [popupContent, setPopupContent] = useState();
  const fetchAppointments = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/api/technician_appointments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(response.data);
      console.log("Response from lab appointments", response.data);
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

  const [showPopup, setShowPopup] = useState(false);
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const toggleMenu = (appointmentId) => {
    setMenuOpen(menuOpen === appointmentId ? null : appointmentId);
  };

  const handleActionClick = (action, appointmentId) => {
    console.log(`Action: ${action} on Appointment ID: ${appointmentId}`);
    setMenuOpen(null);

    if (action === "Cancel") {
      const handleCancellation = async (appointmentId, action) => {
        try {
          console.log(
            "SUBMITTING APPOINTMENT ID FOR CANCELLING",
            appointmentId
          );
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_URL
            }/api/technician_appointments/${appointmentId}/cancel_appointment/`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          );
          alert(response.data.message);
          fetchAppointments();
        } catch (err) {
          console.log("Failed cancellation request.");
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
  };
  const [menuOpen, setMenuOpen] = useState(null);
  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}
      <AppointmentDetailsPopup></AppointmentDetailsPopup>

      <div className={styles.pageTop}>
        
        <h1>Lab Appointments</h1>
        <p>Here you can view and manage all the booked lab appointments</p>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <div className={styles.filterTabs}>
              <button className={styles.filterButton}>All</button>
              <button className={styles.filterButton}>Upcoming</button>
              <button className={styles.filterButton}>Completed</button>
              <button className={styles.filterButton}>Cancelled</button>
              <p className={styles.statusSummary}>30 completed, 5 upcoming</p>
            </div>
            <button
              className={styles.addButton}
              onClick={() => handleActionClick("book_new_appointment")}
            >
              Book New Lab Appointment
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table
              className={styles.table}
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Lab Test</th>
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
                    <td>{index + 1}</td>
                    <td>{row.appointment_id}</td>
                    <td>
                      {row.patient?.user?.first_name || "No first name"}{" "}
                      {row.patient?.user?.last_name || "No last name"}
                    </td>
                    <td>{row.lab_test || "No test specified"}</td>
                    <td>{row.appointment_type || "N/A"}</td>
                    <td>
                      {row.checkin_datetime}
                    </td>
                    <td className={getStatusClass(row.status, styles)}>{row.status}</td>
                    <td>{row.fee ? `PKR ${row.fee}` : "Not available"}</td>
                    <td>{row.booking_date || "Not available"}</td>
                    <td>{row.notes || "No additional notes"}</td>
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
                              onClick={() =>
                                handleActionClick("Cancel", row.appointment_id)
                              }
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

export default AppointmentLabAdmin;

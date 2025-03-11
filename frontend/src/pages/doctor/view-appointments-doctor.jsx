import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupAppointmentDetails from "../../components/Popup/popups-doctor-appointments/popup-doctor-appointment-details";
import { useNavigate } from "react-router-dom";
import api from "../../api";
<<<<<<< HEAD
import CancellationRequestForm from "./cancellation-request-form";
import PopupStartAppointment from "../../components/Popup/popup-appointment-checkin";
=======
import CancellationRequestForm from "./cancellation-request-form"; // Import CancellationRequestForm
import PopupCheckinDoctorAppointment from "../../components/Popup/popups-doctor-appointments/popup-doctor-appointment-checkin";
>>>>>>> 0c6a7d83e0078caedabe34821b0584afde0801e1

const AppointmentDoctor = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

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

  const handleAddAppointment = () => {
    navigate("/add-appointment");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupContent(null);
  };

  // Function to toggle the menu for a specific appointment
  const toggleActionMenu = (appointmentId) => {
    setMenuOpen(menuOpen === appointmentId ? null : appointmentId);
  };

  // Handle the action when an item is clicked in the menu
  const handleActionClick = (action, appointment) => {
    console.log(`Action: ${action} on Appointment ID: ${appointment.appointment_id}`);
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
<<<<<<< HEAD
        <PopupStartAppointment
          appointmentDetails={appointment}
=======
        <PopupCheckinDoctorAppointment
          appointmentDetails={appointmentId}
>>>>>>> 0c6a7d83e0078caedabe34821b0584afde0801e1
          onClose={handleClosePopup}
        />
      );
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}
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
              onClick={handleAddAppointment}
              className={styles.addButton}
            >
              Add New Appointment
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
                  <th>Gender</th>
                  <th>Appointment Type</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Additional Notes</th>
                  <th>Actions</th>
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
                    <td>{row.patient?.gender || "N/A"}</td>
                    <td>{row.appointment_type || "N/A"}</td>
                    <td>
                      {row.appointment_date} {row.start_time}
                    </td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
                    <td>{row.notes || "No additional notes"}</td>
                    <td>
                      <button
                        onClick={() => toggleActionMenu(row.appointment_id)}
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
                                handleActionClick("Cancel", row);
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
  );
};

export default AppointmentDoctor;
import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupAppointmentDetails from "../../components/Popup/popup-appointment-details";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import CancellationRequestForm from "./cancellation-request-form"; // Import CancellationRequestForm

const AppointmentTechnician = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [showPopup, setShowPopup] = useState(false); 
  const [popupContent, setPopupContent] = useState(null); // State to track which popup to show
  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

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
        console.log("Response from technician appointment", response.data);
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

  

  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup when button is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };

  const [menuOpen, setMenuOpen] = useState(null);

  // Function to toggle the menu for a specific appointment
  const toggleMenu = (appointmentId) => {
    setMenuOpen(menuOpen === appointmentId ? null : appointmentId);
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
      setShowPopup(true); // Show the Cancellation Request Form popup
    }
    // Add logic for other actions like 'Edit' and 'Reschedule' if needed
  };

  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}{" "}
      {/* Render the correct popup based on the action */}
      <PopupAppointmentDetails />
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
            <button className={styles.addButton}>Cancel Appointment</button>
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
                  <th>Lab Test Type</th>
                  <th>Date & Time</th>
                  <th>Status</th>
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
                    <td>{row.patient?.gender || "N/A"}</td>
                    <td>{row.lab_test_type || "N/A"}</td>
                    <td>
                      {row.appointment_date} {row.appointment_time}
                    </td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
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
                              onClick={() => {
                                handleActionClick("Cancel", row.appointment_id);
                              }}
                            >
                              Request Cancellation
                            </li>
                            <li
                              onClick={() =>
                                handleActionClick(
                                  "Reschedule",
                                  row.appointment_id
                                )
                              }
                            >
                              Reschedule
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

export default AppointmentTechnician;

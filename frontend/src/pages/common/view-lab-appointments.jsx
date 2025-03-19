import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import CancellationRequestForm from "../lab-technician/cancellation-request-form"; // Import CancellationRequestForm
import PopupManageSlotsLabTechnician from "../../components/Popup/popups-lab-technician-appointments/manage-slots-lab-technician-popup";
import TechnicianAppointmentCheckinPopup from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-checkin-popup";
import { getAccessToken } from "../../utils/utils";
import useCurrentUserData from "../../useCurrentUserData";
import { getLabTechnicianAppointments } from "../../api/appointmentsApi";

const AppointmentTechnician = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = getAccessToken();
  const { data: curUser, isLoading, error } = useCurrentUserData(); // Use Logged-in user data from cache.
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null); // State to track which popup to show

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
    } else if (action === "Start Appointment") {
      setPopupContent(<TechnicianAppointmentCheckinPopup />);
      setShowPopup(true);
    } else if (action === " Appointment") {
      setPopupContent(<TechnicianAppointmentCheckinPopup />);
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}{" "}
      {/* Render the correct popup based on the action */}
      <AppointmentDetailsPopup />
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

            <div className={styles.appointmentButtons}>
              <button
                onClick={() => {
                  handleActionClick("Manage Availability");
                }}
                className={styles.addButton}
              >
                Manage Availability
              </button>
              <button className={styles.addButton}>Cancel Appointment</button>
            </div>
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
                  <th>Date & Time</th>
                  <th>Lab Test Type</th>
                  <th>Technician Name</th>
                  <th>Specialization</th>
                  <th>Test Status</th>
                  <th>Results Available</th>
                  <th>Additional Notes</th>
                  <th>Fee</th>
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
                    <td>
                      {row.time_slot?.slot_date} | {row.time_slot?.start_time} -{" "}
                      {row.time_slot?.end_time}
                    </td>
                    <td>{row.lab_test_type || "N/A"}</td>
                    <td>{row.lab_technician?.user?.first_name || "N/A"} {row.lab_technician?.user?.last_name || "N/A"}</td>
                    <td>{row.lab_technician?.specialization || "N/A"}</td>

                    <td className={getStatusClass(row.status)}>{row.status}</td>
                    <td>{row.results_available}</td>
                    <td>{row.notes || "No additional notes"}</td>
                    <td>{row.fee}</td>
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
                                handleActionClick(
                                  "Start Appointment",
                                  row.appointment_id
                                );
                              }}
                            >
                              Start Appointment
                            </li>
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

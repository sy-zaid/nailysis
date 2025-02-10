import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupBookAppointment from "../../components/Popup/popup-book-appointment";
import PopupAppointmentDetails from "../../components/Popup/popup-appointment-details";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";
import CancellationRequestForm from "./CancellationRequestForm";

const AppointmentDoctor = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");

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

  const [showPopup, setShowPopup] = useState(false);
  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup when button is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };
  return (
    <div className={styles.pageContainer}>
      {showPopup && <PopupBookAppointment onClose={handleClosePopup} />}
      <PopupAppointmentDetails></PopupAppointmentDetails>
      <CancellationRequestForm appointmentId={2} />

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
            <button className={styles.addButton} >
              Cancel Appointment
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
                  <th>Gender</th>
                  <th>Appointment Type</th>
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
                    <td>{index + 1}</td> {/* Serial Number */}
                    <td>{row.appointment_id}</td> {/* Appointment ID */}
                    <td>
                      {row.patient?.user?.first_name || "No first name"}{" "}
                      {row.patient?.user?.last_name || "No last name"}
                    </td>{" "}
                    {/* Patient Name */}
                    <td>{row.patient?.gender || "N/A"}</td>{" "}
                    {/* Patient Gender */}
                    <td>{row.appointment_type || "N/A"}</td>{" "}
                    {/* Appointment Type */}
                    <td>
                      {row.appointment_date} {row.appointment_time}
                    </td>{" "}
                    {/* Date & Time */}
                    <td className={getStatusClass(row.status)}>{row.status}</td> {/* Status */}
                    <td>{row.notes || "No additional notes"}</td>{" "}
                    {/* Additional Notes */}
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

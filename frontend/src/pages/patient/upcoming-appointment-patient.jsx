import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupBookAppointment from "../../components/Popup/popup-book-appointment";
import PopupAppointmentDetails from "../../components/Popup/popup-appointment-details";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";

const AppointmentPatients = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [fee, setFee] = useState("");

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
          "http://127.0.0.1:8000/api/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
        console.log(response.data);
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

  const [showPopup,setShowPopup] = useState(false);
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
            <button className={styles.addButton} onClick={handleOpenPopup}>
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
                  <th>#</th>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointment Date & Time</th>
                  <th>Test Type</th>
                  <th>Status</th>
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
                    <td>{row.patient.gender}</td>
                    <td>{row.patient?.user?.email || "No email"}</td>
                    <td>{row.patient?.user?.phone || "No phone"}</td>
                    <td>
                      {row.appointment_date} {row.appointment_time}
                    </td>
                    <td>{row.test_type || "N/A"}</td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
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

export default AppointmentPatients;

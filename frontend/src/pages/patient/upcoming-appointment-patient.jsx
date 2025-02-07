import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Popup from "../../components/Popup/Popup";
import PopupBookAppointment from "../../components/Popup/popup-book-appointment";
import PopupAppointmentDetails from "../../components/Popup/popup-appointment-details";
import Header from "../../components/Dashboard/Header/Header";
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
  const [consultationFee, setConsultationFee] = useState("");

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

  const handleAddAppointment = (e) => {
    e.preventDefault();

    // Validation
    if (
      !doctorId ||
      !appointmentDate ||
      !appointmentTime ||
      !appointmentType ||
      !specialization ||
      !consultationFee
    ) {
      alert("All fields are required.");
      return;
    }

    const appointmentData = {
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      appointment_type: appointmentType,
      specialization: specialization,
      consultation_fee: consultationFee,
    };

    axios
      .post(
        "http://127.0.0.1:8000/api/doctor_appointments/book_appointment/",
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        alert("Appointment booked successfully");
        setAppointments([...appointments, response.data]); // Add the new appointment to the list
        navigate("/appointments");
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        alert("Failed to book appointment. Please try again.");
      });
  };

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


  return (
    <div className={styles.pageContainer}>
      <PopupBookAppointment></PopupBookAppointment>
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
            <button className={styles.addButton} onClick={handleAddAppointment}>
              Book New Appointment
            </button>
          </div>

          {/* Form for Booking New Appointment */}
          <div className={styles.formContainer}>
            <h2>Book an Appointment</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
              <input
                type="text"
                placeholder="Appointment Type"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
              />
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              <input
                type="number"
                placeholder="Consultation Fee"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
              />
              <button type="button" onClick={handleAddAppointment}>
                Book Appointment
              </button>
            </form>
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

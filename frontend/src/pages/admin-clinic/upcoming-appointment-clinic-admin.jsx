import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/Appointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  // Retrieve token from localStorage
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      console.log("No token found. Redirecting to login...");
      navigate("/login"); // Redirect if no token
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
        setAppointments(response.data); // Store fetched data in state
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [token, navigate]); // Runs when `token` or `navigate` changes

  const handleAddAppointment = () => {
    navigate("/add-appointment");
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
                      {row.patient.first_name} {row.patient.last_name}
                    </td>
                    <td>{row.patient.gender}</td>
                    <td>{row.patient.email}</td>
                    <td>{row.patient.phone}</td>
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

export default Appointment;

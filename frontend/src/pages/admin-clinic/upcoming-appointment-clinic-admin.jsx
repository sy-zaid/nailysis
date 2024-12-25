import React from "react";
import styles from "../../components/CSS Files/Appointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import { useNavigate } from "react-router-dom";

const Appointment = (props) => {
  const navigate = useNavigate();
  const handleAddAppointment = () => {
    navigate("/add-appointment");
  };

  const data = [
    {
      id: 1,
      appointmentId: "123456",
      patientName: "John",
      gender: "Male",
      email: "patient1@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Blood Test",
      status: "Consulted",
    },
    {
      id: 9,
      appointmentId: "123456",
      patientName: "Carl",
      gender: "Female",
      email: "patient9@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "COVID-19",
      status: "Cancelled",
    },
  ];

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
        <Header curUserRole="Appointments" />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <button className={styles.filterButton}>All</button>
            <button className={styles.filterButton}>Upcoming</button>
            <button className={styles.filterButton}>Consulted</button>
            <button className={styles.filterButton}>Cancelled</button>
            <p>50 completed, 4 upcoming</p>
            <button className={styles.addButton} onClick={handleAddAppointment}>
              Add New Appointment
            </button>
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th>Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointment Date & Time</th>
                  <th>Test Type</th>
                  <th>Scheduled Appointment</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{row.id}</td>
                    <td>{row.appointmentId}</td>
                    <td>{row.patientName}</td>
                    <td>{row.gender}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>{row.dateTime}</td>
                    <td>{row.testType}</td>
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../components/CSS Files/Appointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";

const Appointment = () => {
  const navigate = useNavigate();
  const [dropdownId, setDropdownId] = useState(null);

  const handleAddAppointment = () => {
    navigate("/patients");
    navigate("/patient-profile");
  };

  const toggleDropdown = (id) => {
    setDropdownId(dropdownId === id ? null : id);
  };

  const handleDropdownAction = (action, id) => {
    if (action === "View Profile") {
      navigate("/clinic-admin/patient-profile");
    } else {
      console.log(`${action} clicked for appointment ID: ${id}`);
    }
    setDropdownId(null);
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
      id: 2,
      appointmentId: "123456",
      patientName: "Doe",
      gender: "Male",
      email: "patient2@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Blood Test",
      status: "Cancelled",
    },
    {
      id: 3,
      appointmentId: "123456",
      patientName: "Doe",
      gender: "Male",
      email: "patient2@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Blood Test",
      status: "11/11/2024",
    },
    {
      id: 4,
      appointmentId: "123456",
      patientName: "Carl",
      gender: "Female",
      email: "patient4@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Urinalysis",
      status: "11/11/2024",
    },
    {
      id: 5,
      appointmentId: "123456",
      patientName: "Carl",
      gender: "Female",
      email: "patient5@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Urinalysis",
      status: "Consulted",
    },
    {
      id: 6,
      appointmentId: "123456",
      patientName: "Doe",
      gender: "Female",
      email: "patient6@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Urinalysis",
      status: "11/11/2024",
    },
    {
      id: 7,
      appointmentId: "123456",
      patientName: "Carl",
      gender: "Male",
      email: "patient7@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "COVID-19",
      status: "Consulted",
    },
    {
      id: 8,
      appointmentId: "123456",
      patientName: "Carl",
      gender: "Female",
      email: "patient8@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "COVID-19",
      status: "11/11/2024",
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
        <h1>Your Patients</h1>
        <p>Here you can view and manage your patients</p>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
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
                  <th>Scheduled Appointment</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index === 0 ? styles.noHover : ""}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td>{row.id}</td>
                    <td>{row.appointmentId}</td>
                    <td>{row.patientName}</td>
                    <td>{row.gender}</td>
                    <td>{row.email}</td>
                    <td className={styles.phoneColumn}>{row.phone}</td>
                    <td>{row.dateTime}</td>
                    <td>{row.testType}</td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
                    <td
                      className={styles.optionContainer}
                      style={{ position: "relative" }}
                    >
                      <img
                        src="/option.png"
                        alt="Options"
                        className={styles.optionIcon}
                        onClick={() => toggleDropdown(row.id)}
                        style={{ cursor: "pointer" }}
                      />
                      {dropdownId === row.id && (
                        <div className={styles.dropdown}>
                          {[
                            "View Profile",
                            "Edit Details",
                            "Delete",
                            "Download as PDF",
                            "Chat Now",
                          ].map((item, i) => (
                            <button
                              key={i}
                              className={styles.dropdownButton}
                              onClick={() => handleDropdownAction(item, row.id)}
                            >
                              {item}
                            </button>
                          ))}
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

export default Appointment;

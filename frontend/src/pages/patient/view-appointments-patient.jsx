import React, { useState, useRef, useEffect } from "react";
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import PopupDoctorAppointmentBook from "../../components/Popup/popups-doctor-appointments/doctor-appointment-book-popup";
import PopupLabAppointmentBook from "../../components/Popup/popup-lab-appointment-book";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AppointmentPatients = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [activeButton, setActiveButton] = useState(0);

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

  const [showDoctorPopup, setShowDoctorPopup] = useState(false);
  const [showLabPopup, setShowLabPopup] = useState(false);

  const handleOpenDoctorPopup = () => {
    setShowDoctorPopup(true); // Show the popup when button is clicked
  };

  const handleCloseDoctorPopup = () => {
    setShowDoctorPopup(false); // Hide the popup when closing
  };

  const handleOpenLabPopup = () => {
    setShowLabPopup(true); // Show the popup when button is clicked
  };

  const handleCloseLabPopup = () => {
    setShowLabPopup(false); // Hide the popup when closing
  };

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5, // Adjust for scroll position
      left: iconRect.left + window.scrollX - 70, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      {showDoctorPopup && <PopupDoctorAppointmentBook onClose={handleCloseDoctorPopup} />}
      {showLabPopup && <PopupLabAppointmentBook onClose={handleCloseLabPopup} />}

      <AppointmentDetailsPopup></AppointmentDetailsPopup>

      <div className={styles.pageTop}>
        <Navbar />
        <Header
          mainHeading={"Appointments"}
          subHeading={
            "Here you can view all the booked appointments for doctors and lab tests"
          }
        />
      </div>
      <br />
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${
                activeButton === 0 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 1 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(1)}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 2 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(2)}
            >
              Completed
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 3 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(3)}
            >
              Cancelled
            </button>
            <p>50 completed, 4 upcoming</p>

            <div className={styles.appointmentButtons}>
              <button className={styles.addButton}>
                Download Visit Summary
              </button>

              <button className={styles.addButton} onClick={handleOpenDoctorPopup}>
                Book Doctor Appointment
              </button>

              <button className={styles.addButton} onClick={handleOpenLabPopup}>
                Book Lab Technician Appointment
              </button>
            </div>
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

            <hr />
            <br />

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th> {/* Serial Number */}
                  <th>Appointment ID</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Appointment Date & Time</th>
                  <th>Visit Purpose</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Doctor Experience</th>
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
                      {row.doctor?.user?.first_name || "No first name"}{" "}
                      {row.doctor?.user?.last_name || "No last name"}
                    </td>{" "}
                    {/* Doctor's Name */}
                    <td>
                      {row.doctor?.specialization || "No specialization"}
                    </td>{" "}
                    {/* Specialization */}
                    <td>
                    {row.time_slot?.slot_date} | {row.time_slot?.start_time} - {row.time_slot?.end_time}
                    </td>{" "}
                    {/* Date and Time */}
                    <td>{row.appointment_type || "N/A"}</td>{" "}
                    {/* Visit Purpose */}
                    <td>{row.status}</td> {/* Status */}
                    <td>{row.fee ? `PKR ${row.fee}` : "Not available"}</td>{" "}
                    {/* Fee */}
                    <td>
                      {row.doctor?.years_of_experience || "N/A"} years
                    </td>{" "}
                    {/* Doctor Experience */}
                    <td>{row.notes || "No additional notes"}</td>{" "}
                    {/* Additional Notes */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupVisible && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            background: "white",
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <p
            style={{ margin: "10px 0", cursor: "pointer" }}
            onClick={handleTableEntryClick}
          >
            👁️ View Details
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            ✏️ Reschedule Appointment
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            🗑️ Cancel Appointment
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            📄 Download as PDF
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentPatients;

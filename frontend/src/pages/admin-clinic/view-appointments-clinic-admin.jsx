import React, { act, useEffect, useState, useRef } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import PopupAppointmentBook from "../../components/Popup/popups-doctor-appointments/doctor-appointment-book-popup";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import RescheduleAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-reschedule-popup";
import DeleteAppointmentPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-delete-popup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";
// UTILS.JS FUNCTIONS
import { 
  getStatusClass, 
  toggleActionMenu,
} from "../../utils/utils";

const AppointmentClinicAdmin = ( onClose ) => {
  const navigate = useNavigate(); 
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [activeButton, setActiveButton] = useState(0); 
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  
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
  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [token, navigate]);

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  const handleOpenPopup = () => {
    setShowPopup(true); // Show the popup when button is clicked
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };


  // Handle the action when an item is clicked in the menu
  const handleActionClick = (action, appointmentId) => {
    
    console.log(`Action: ${action} on Appointment ID: ${appointmentId}`);
    setMenuOpen(null); // Close the menu after action

    if (action === "Cancel") {
      // POST the cancellation request
      const handleCancellation = async (appointmentId, action) => {
        try {
          console.log(
            "SUBMITTING APPOINTMENT ID FOR CANCELLING",
            appointmentId
          );
          const response = await axios.post(
            `${
              import.meta.env.VITE_API_URL
            }/api/doctor_appointments/${appointmentId}/cancel_appointment/`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`,
              },
            }
          );
          alert(response.data.message); // Notify of success

          // Fetch updated appointments after cancellation
          fetchAppointments();
          // Optionally, refetch the cancellation requests list to reflect changes
        } catch (err) {
          console.log("Failed cancellation request.");
        }
      };
      handleCancellation(appointmentId, action);
    }else if (action === "Reschedule") {
      setPopupContent(
        <RescheduleAppointmentPopup
          appointmentDetails={appointmentId}
          onClose={handleClosePopup}
        />
      );
      setShowPopup(true);
    } else if (action === "book_new_appointment") {
      setPopupContent(<PopupAppointmentBook onClose={handleClosePopup} />);
      setShowPopup(true);
    } else if (action === "Delete") {
      setPopupContent(
        <DeleteAppointmentPopup
          onClose={handleClosePopup}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    }

    // Add logic for other actions like 'Edit' and 'Reschedule' if needed
  };

  // Close the action menu when clicking outside of it
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  


  return (
    <div className={styles.pageContainer}>
      {showPopup && popupContent}
      {/* {showPopup && <PopupAppointmentBook onClose={handleClosePopup} />} */}
      {/* {showPopup && <RescheduleAppointmentPopup onClose={handleClosePopup} />} */}


      <div className={styles.pageTop}>
        <Navbar />
        <h1>Appointments</h1>
        <p>Here you can view and manage all the booked appointments</p>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${activeButton === 0 ? styles.active : ''}`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 1 ? styles.active : ''}`}
              onClick={() => handleFilterClick(1)}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ''}`}
              onClick={() => handleFilterClick(2)}
            >
              Completed
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ''}`}
              onClick={() => handleFilterClick(3)}
            >
              Cancelled
            </button>
            <p>50 completed, 4 pending</p>
            
            <button
              className={styles.addButton}
              onClick={() => handleActionClick("book_new_appointment")}
            >
              Book New Appointment
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
            <hr />
            <br />

            <div className={styles.tableWrapper}>
              <table
                className={styles.table}
              >
                <thead>
                  <tr>
                    <th>#</th> {/* Serial Number */}
                    <th>Appointment ID</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Appointment Type</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Fee</th>
                    
                    <th>Additional Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((row, index) => (
                    <tr
                      key={row.appointment_id}
                    >
                      <td>{index + 1}</td> {/* Serial Number */}
                      <td>{row.appointment_id}</td> {/* Appointment ID */}
                      <td>
                        {row.patient?.user?.first_name || "No first name"}{" "}
                        {row.patient?.user?.last_name || "No last name"}
                      </td>{" "}
                      {/* Patient's Name */}
                      <td>
                        {row.doctor?.user?.first_name || "No first name"}{" "}
                        {row.doctor?.user?.last_name || "No last name"}
                      </td>{" "}
                      {/* Doctor's Name */}
                      <td>
                        {row.doctor?.specialization || "No specialization"}
                      </td>{" "}
                      {/* Specialization */}
                      <td>{row.appointment_type || "N/A"}</td>{" "}
                      {/* Appointment Type */}
                      <td>
                        {row.time_slot?.slot_date} | {row.time_slot?.start_time} - {row.time_slot?.end_time}
                      </td>{" "}
                      {/* Date & Time */}
                      <td className={getStatusClass(row.status, styles)}>
                        {row.status}
                      </td>{" "}
                      {/* Status */}
                      <td>{row.fee ? `PKR ${row.fee}` : "Not available"}</td>{" "}
                      {/* Fee */}
                      <td>{row.booking_date || "Not available"}</td>{" "}
                    
                      {/* Additional Notes */}
                      <td>
                        <button
                        onClick={(event) => toggleActionMenu(row.appointment_id, menuOpen, setMenuOpen, setMenuPosition, event)}
                        className={styles.moreActionsBtn}
                        >
                          <img
                            src="/icon-three-dots.png"
                            alt="More Actions"
                            className={styles.moreActionsIcon}
                          />
                        </button>

                        {menuOpen === row.appointment_id &&  (
                          <div
                            ref={menuRef} id={`menu-${row.id}`}
                            className={styles.menu}
                            style={{
                              top: `${menuPosition.top}px`,
                              left: `${menuPosition.left}px`,
                              position: "absolute",
                            }}
                          >
                            <ul>
                              <li
                                onClick={() => {
                                  handleActionClick("Cancel", row.appointment_id);
                                }}
                              >
                                <i className="fa-solid fa-rectangle-xmark"></i>Cancel Appointment
                              </li>
                              <li
                                onClick={() =>
                                  handleActionClick("Reschedule", row)
                                }
                              >
                                <i className="fa-solid fa-pen"></i>Edit / Reschedule Appointment
                              </li>
                              <li
                                onClick={() => handleActionClick("Delete", row)}
                              >
                                <i className="fa-solid fa-trash"></i>Delete Appointment
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
    </div>
  );
};

export default AppointmentClinicAdmin;

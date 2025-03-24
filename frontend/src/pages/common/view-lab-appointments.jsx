import React, { useEffect, useState } from "react";
import styles from "../common/all-pages-styles.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";

import CancellationRequestForm from "../lab-technician/cancellation-request-form"; // Import CancellationRequestForm
import PopupManageSlotsLabTechnician from "../../components/Popup/popups-lab-technician-appointments/manage-slots-lab-technician-popup";
import TechnicianAppointmentCheckinPopup from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-checkin-popup";
import TechnicianAppointmentReschedulePopup from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-reschedule-popup";

import useCurrentUserData from "../../useCurrentUserData";
import {
  cancelTechnicianAppointment,
  getLabTechnicianAppointments,
} from "../../api/appointmentsApi";

// UTILS.JS FUNCTIONS
import {
  getAccessToken,
  handleOpenPopup,
  handleClosePopup,
  getStatusClass, 
  toggleActionMenu,
} from "../../utils/utils";
import PopupBookTechnicianAppointment from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-book-popup";

const AppointmentTechnician = () => {
  // ----- TOKENS AND USER INFORMATION
  const token = getAccessToken();
  const { data: curUser, isLoading, error } = useCurrentUserData(); // Use Logged-in user data from cache.

  // ----- POPUPS & NAVIGATION
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null); // State to track which popup to show
  const [menuOpen, setMenuOpen] = useState(null);

  // ----- IMPORTANT DATA
  const [appointments, setAppointments] = useState([]);
  const [activeButton, setActiveButton] = useState(0); 

  // ----- HANDLERS
  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };

  // Handles the action when an item is clicked in the action menu
  const handleActionClick = (action, appointmentId) => {
    console.log(`Action: ${action} on Appointment ID: ${appointmentId}`);
    setMenuOpen(null); // Close the menu after action

    if (action === "Button Cancellation Request") {
      setPopupContent(
        <CancellationRequestForm
          appointmentId={appointmentId}
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true); // Show the Cancellation Request Form popup
    } else if (action === "Action Cancel Appointment") {
      const handleCancellation = async (appointmentId, action) => {
        try {
          console.log(
            "SUBMITTING APPOINTMENT ID FOR CANCELLING",
            appointmentId
          );
          const response = await cancelTechnicianAppointment(appointmentId);
          alert(response.data.message);
          fetchAppointments();
        } catch (err) {
          console.log("Failed cancellation request.");
        }
      };
      handleCancellation(appointmentId, action);
    } else if (action === "Action Start Appointment") {
      setPopupContent(
        <TechnicianAppointmentCheckinPopup
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    } else if (action === "Button Manage Availability") {
      setPopupContent(
        <PopupManageSlotsLabTechnician
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true);
    } else if (action === "Button Book New Appointment") {
      setPopupContent(
        <PopupBookTechnicianAppointment
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true);
    } else if (action === "Reschedule") {
      setPopupContent(
        <TechnicianAppointmentReschedulePopup
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
          appointmentDetails={appointmentId}
        />
      );
      setShowPopup(true);
    }
  };

  // ----- USE EFFECTS
  // Fetch lab appointments on component mount
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
    if (!showPopup) {
      // Fetch only when popup is closed
      fetchAppointments();
    }
  }, [showPopup, token]);

  return (
    <div className={styles.pageContainer}>
      {/* Render the correct popup based on the action */}
      {showPopup && popupContent}{" "}
      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Appointments'}
            subHeading={'Here you can view and manage all the booked appointments'}
        />
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
          

              {curUser[0].role === "lab_technician" && (
                <button
                  onClick={() => {
                    handleActionClick("Button Manage Availability");
                  }}
                  className={styles.addButton}
                >
                  Manage Availability
                </button>
              )}
              {(curUser[0].role === "patient" ||
                curUser[0].role === "lab_admin") && (
                <button
                  className={styles.addButton}
                  onClick={() => {
                    handleActionClick("Button Book New Appointment");
                  }}
                >
                  {curUser[0].role === "patient"
                    ? "Book Lab Appointment"
                    : "New Lab Appointment"}
                </button>
              )}
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
                    <th>#</th>
                    <th>Appointment ID</th>

                    {curUser[0].role !== "patient" && <th>Patient Name</th>}
                    {curUser[0].role !== "patient" && <th>Gender</th>}

                    <th>Date & Time</th>
                    <th>Requested Tests</th>

                    {curUser[0].role !== "lab_technician" && (
                      <th>Technician Name</th>
                    )}
                    {curUser[0].role !== "lab_technician" && (
                      <th>Specialization</th>
                    )}

                    <th>Fee</th>
                    <th>Additional Notes</th>
                    <th>Test Status</th>
                    <th>Appointment Status</th>
                    <th>Results Available</th>
                    <th>Actions</th>
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
                    {curUser[0].role !== "patient" && (
                      <td>
                        {row.patient?.user?.first_name || "No first name"}{" "}
                        {row.patient?.user?.last_name || "No last name"}
                      </td>
                    )}
                    {curUser[0].role !== "patient" && (
                      <td>{row.patient?.gender || "N/A"}</td>
                    )}
                    <td>
                      {row?.checkin_datetime
                        ? `${new Date(
                            row.checkin_datetime
                          ).toLocaleDateString()} | ${new Date(
                            row.checkin_datetime
                          ).toLocaleTimeString()}`
                        : "N/A"}
                    </td>
                    <td>
                      <ul>
                        {row.test_orders.length > 0 &&
                          row.test_orders[0].test_types.map((test) => (
                            <li key={test.id}>{test.label}</li>
                          ))}
                      </ul>
                    </td>

                      {curUser[0].role !== "lab_technician" && (
                        <td>
                          {row.lab_technician?.user?.first_name || "N/A"}{" "}
                          {row.lab_technician?.user?.last_name || "N/A"}
                        </td>
                      )}

                      {curUser[0].role !== "lab_technician" && (
                        <td>{row.lab_technician?.specialization || "N/A"}</td>
                      )}
                      <td>{row.fee}</td>

                      <td>{row.notes || "No additional notes"}</td>

                      <td
                        className={getStatusClass(
                          row.test_orders?.[0]?.test_status || "",
                          styles
                        )}
                      >
                        {row.test_orders?.[0]?.test_status || " "}
                      </td>
                      <td className={getStatusClass(row.status, styles)}>
                        {row.status}
                      </td>
                      <td className={getStatusClass(row.status, styles)}>
                        {row.test_orders[0]?.results_available ? "Yes" : "No"}
                      </td>
                      {/* ------------------------- ACTION BUTTONS -------------------------*/}
                      <td>
                        <button
                          onClick={() =>
                            toggleActionMenu(
                              row.appointment_id,
                              menuOpen,
                              setMenuOpen
                            )
                          }
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
                            {curUser[0].role === "lab_technician" &&
                              row.status !== "Completed" && (
                                <li
                                  onClick={() => {
                                    handleActionClick(
                                      "Action Start Appointment",
                                      row
                                    );
                                  }}
                                >
                                  Start Appointment
                                </li>
                              )}

                              {(curUser[0].role === "patient" ||
                                curUser[0].role === "lab_technician") && (
                                <li
                                  onClick={() => {
                                    handleActionClick(
                                      "Button Cancellation Request",
                                      row.appointment_id
                                    );
                                  }}
                                >
                                  Request Cancellation
                                </li>
                              )}

                              {curUser[0].role === "lab_admin" && (
                                <li
                                  onClick={() =>
                                    handleActionClick("Reschedule", row)
                                  }
                                >
                                  Reschedule
                                </li>
                              )}
                              {curUser[0].role === "lab_admin" && (
                                <li
                                  onClick={() =>
                                    handleActionClick(
                                      "Action Cancel Appointment",
                                      row.appointment_id
                                    )
                                  }
                                >
                                  Cancel Appointment
                                </li>
                              )}
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

export default AppointmentTechnician;

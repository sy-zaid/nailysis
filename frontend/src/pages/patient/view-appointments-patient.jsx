import React, { useState, useRef, useEffect } from "react";
import styles from "../common/all-pages-styles.module.css";
import mediaStyles from "../common/media.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import PopupDoctorAppointmentBook from "../../components/Popup/popups-doctor-appointments/doctor-appointment-book-popup";
import PopupTechnicianAppointmentBook from "../../components/Popup/popups-lab-technician-appointments/technician-appointment-book-popup";
import AppointmentDetailsPopup from "../../components/Popup/popups-doctor-appointments/doctor-appointment-details-popup";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { handleClosePopup, handleOpenPopup } from "../../utils/utils";

const AppointmentPatients = () => {
  // ----- POPUPS & NAVIGATION
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const [activeButton, setActiveButton] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [showLabPopup, setShowLabPopup] = useState(false);
  const [popupContent, setPopupContent] = useState();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  // Filtering, Searching, Sorting State
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Set default sort to appointment date (latest first)
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState({});

  // ----- HANDLERS
  const handleFilterClick = (index) => {
    setActiveButton(index);
  };

  // Handles checkbox selection
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedAppointments = {};
    if (newSelectAll) {
      sortedAppointments.forEach((appointment) => {
        newSelectedAppointments[appointment.appointment_id] = true;
      });
    }
    setSelectedAppointments(newSelectedAppointments);
  };

  // Handle individual checkbox click
  const handleSelectOne = (appointmentId) => {
    setSelectedAppointments((prev) => {
      const updated = { ...prev, [appointmentId]: !prev[appointmentId] };

      const allChecked =
        sortedAppointments.length > 0 &&
        sortedAppointments.every((app) => updated[app.appointment_id]);
      setSelectAll(allChecked);

      return updated;
    });
  };

  const handleActionClick = (action) => {
    if (action === "Book Doctor Appointment") {
      setPopupContent(
        <PopupDoctorAppointmentBook
          onClose={() => handleClosePopup(setShowPopup, setPopupContent)}
        />
      );
      setShowPopup(true);
    }
  };
  // ----- MAIN LOGIC FUNCTIONS

  // Filtering Logic
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date().toISOString().split("T")[0];

    if (activeFilter === "Scheduled" && appointment.status !== "Scheduled")
      return false;
    if (
      activeFilter === "Emergency Visit" &&
      appointment.appointment_type !== "Emergency Visit"
    )
      return false;
    if (activeFilter === "Today" && appointment.time_slot?.slot_date !== today)
      return false;

    const searchValue = searchQuery.toLowerCase();
    const matchesSearch =
      appointment.appointment_id
        ?.toString()
        .toLowerCase()
        .includes(searchValue) ||
      appointment.doctor?.user?.first_name
        ?.toLowerCase()
        .includes(searchValue) ||
      appointment.doctor?.user?.last_name
        ?.toLowerCase()
        .includes(searchValue) ||
      appointment.doctor?.specialization?.toLowerCase().includes(searchValue) ||
      appointment.time_slot?.slot_date?.toLowerCase().includes(searchValue) ||
      appointment.time_slot?.start_time?.toLowerCase().includes(searchValue) ||
      appointment.time_slot?.end_time?.toLowerCase().includes(searchValue) ||
      appointment.appointment_type?.toLowerCase().includes(searchValue) ||
      appointment.status?.toLowerCase().includes(searchValue) ||
      (appointment.fee &&
        `PKR ${appointment.fee}`.toLowerCase().includes(searchValue)) ||
      (appointment.doctor?.years_of_experience &&
        appointment.doctor?.years_of_experience
          .toString()
          .toLowerCase()
          .includes(searchValue)) ||
      appointment.notes?.toLowerCase().includes(searchValue);

    return matchesSearch;
  });

  // Sorting Logic
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue =
      sortConfig.key === "experience"
        ? a.doctor?.years_of_experience || 0
        : sortConfig.key === "fee"
        ? a.fee || 0
        : new Date(a.time_slot?.slot_date).getTime();

    const bValue =
      sortConfig.key === "experience"
        ? b.doctor?.years_of_experience || 0
        : sortConfig.key === "fee"
        ? b.fee || 0
        : new Date(b.time_slot?.slot_date).getTime();

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5,
      left: iconRect.left + window.scrollX - 70,
    });
    setPopupVisible(!popupVisible);
  };

  // ----- USE-EFFECTS
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
  }, [token, navigate, showPopup]);

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
      {showPopup && popupContent}

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
            {["All", "Scheduled", "Emergency Visit", "Today"].map((filter) => (
              <button
                key={filter}
                className={`${styles.filterButton} ${
                  activeFilter === filter ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
            <p>
              Total Records: {filteredAppointments.length} | Scheduled:{" "}
              {
                filteredAppointments.filter((app) => app.status === "Scheduled")
                  .length
              }
            </p>

            <div className={styles.appointmentButtons}>
              <button
                className={styles.addButton}
                onClick={() => handleActionClick("Book Doctor Appointment")}
              >
                <i className="bx bx-plus-circle"></i> Book Doctor Appointment
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>

              <select
                className={styles.sortBy}
                defaultValue="date-desc"
                onChange={(e) => {
                  const [key, direction] = e.target.value.split("-");
                  setSortConfig({ key, direction });
                }}
              >
                <option value="">Sort By: None</option>
                <option value="experience-asc">
                  Doctor Experience (Low to High)
                </option>
                <option value="experience-desc">
                  Doctor Experience (High to Low)
                </option>
                <option value="fee-asc">Fee (Low to High)</option>
                <option value="fee-desc">Fee (High to Low)</option>
                <option value="date-asc">
                  Appointment Date (Oldest First)
                </option>
                <option value="date-desc">
                  Appointment Date (Latest First)
                </option>
              </select>

              <input
                type="text"
                className={styles.search}
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <hr />
            <br />

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
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
                  {sortedAppointments.map((row, index) => (
                    <tr key={row.appointment_id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!selectedAppointments[row.appointment_id]}
                          onChange={() => handleSelectOne(row.appointment_id)}
                        />
                      </td>
                      <td>{row.appointment_id}</td>
                      <td>
                        {row.doctor?.user?.first_name || "No first name"}{" "}
                        {row.doctor?.user?.last_name || "No last name"}
                      </td>
                      <td>
                        {row.doctor?.specialization || "No specialization"}
                      </td>
                      <td>
                        {row.time_slot?.slot_date} | {row.time_slot?.start_time}{" "}
                        - {row.time_slot?.end_time}
                      </td>
                      <td>{row.appointment_type || "N/A"}</td>
                      <td>{row.status}</td>
                      <td>{row.fee ? `PKR ${row.fee}` : "Not available"}</td>
                      <td>{row.doctor?.years_of_experience || "N/A"} years</td>
                      <td>{row.notes || "No additional notes"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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

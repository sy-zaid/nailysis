import React, { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ userRole, setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Toggle dropdown visibility
  };

  const menuItems = {
    clinic_admin: [
      { icon: "test-results.jpg", label: "Test Results", subItems: [] },
      {
        icon: "diagnostic-results.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "appointments.jpg",
        label: "Appointments",
        subItems: [
          { label: "Upcoming Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "billing.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "feedback.jpg", label: "Feedbacks", subItems: [] },
      { icon: "test-request.jpg", label: "Test Requests", subItems: [] },
    ],
    doctor: [
      { icon: "test-results.jpg", label: "Test Results", subItems: [] },
      {
        icon: "diagnostic-results.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "appointments.jpg",
        label: "Appointments",
        subItems: [
          { label: "Upcoming Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "billing.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "feedback.jpg", label: "Feedbacks", subItems: [] },
      { icon: "test-request.jpg", label: "Test Requests", subItems: [] },
    ],
    patient: [
      { icon: "test-results.jpg", label: "Test Results", subItems: [] },
      {
        icon: "diagnostic-results.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "appointments.jpg",
        label: "Appointments",
        subItems: [
          { label: "Upcoming Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "billing.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "feedback.jpg", label: "Feedbacks", subItems: [] },
      { icon: "test-request.jpg", label: "Test Requests", subItems: [] },
    ],
    lab_admin: [
      { icon: "test-results.jpg", label: "Test Results", subItems: [] },
      {
        icon: "diagnostic-results.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "appointments.jpg",
        label: "Appointments",
        subItems: [
          { label: "Upcoming Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "billing.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "feedback.jpg", label: "Feedbacks", subItems: [] },
      { icon: "test-request.jpg", label: "Test Requests", subItems: [] },
    ],
    lab_technician: [
      { icon: "test-results.jpg", label: "Test Results", subItems: [] },
      {
        icon: "diagnostic-results.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "appointments.jpg",
        label: "Appointments",
        subItems: [
          { label: "Upcoming Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "billing.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "feedback.jpg", label: "Feedbacks", subItems: [] },
      { icon: "test-request.jpg", label: "Test Requests", subItems: [] },
    ],
  };

  const currentMenu = menuItems[userRole] || [];

  return (
    <div>
      {/* Toggle Button */}
      <button
        className={`${styles.toggleButton} ${isOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
      >
        <img src={"menu.png"} alt={"menu button"} />
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidePanel} ${isOpen ? styles.open : ""}`}>
        {/* Section 1 */}
        <div className={styles.sectionOne}>
          <div>
            {isOpen && (
              <button className={styles.closeButton} onClick={toggleSidebar}>
                <img src="close.jpg" alt="close button" />
              </button>
            )}
          </div>
          <div className={styles.secOneImg}>
            <img src="nailysis-logo-small.png" alt="" />
            <h2>
              Nailysis
              <br />
              <span
                style={{
                  fontSize: "14px",
                  color: "#4e4e4e",
                  fontWeight: "600",
                }}
              >
                Clinical Application
              </span>
            </h2>
          </div>
        </div>
        {/* Section 2 */}
        <div className={styles.sectionTwo}>
          <button className={styles.sideButton}>
            <img src="dashboard.jpg" alt="dashboard icon" />
            <h3 className={styles.textMedium}>Dashboard</h3>
          </button>
          <button
            className={styles.sideButton}
            onClick={() => setView("appointments")}
          >
            <img src="analytics.jpg" alt="analytics icon" />
            <h3 className={styles.textMedium}>Reports & Analytics</h3>
          </button>
        </div>

        
        {/* Section 3 */}
        <div className={styles.sectionThree}>
          {currentMenu.map((item, index) => (
            <div key={index}>
              <button
                className={styles.sideButton}
                onClick={() => {
                  toggleDropdown(index); // Toggle the dropdown for this item
                  setView(item.label); // Set the view dynamically
                }}
              >
                <img src={item.icon} alt={`${item.label} icon`} />
                <h3 className={styles.textMedium}>{item.label}</h3>
              </button>

              {/* Dropdown items */}
              {item.subItems && openDropdown === index && (
                <div className={styles.dropdown}>
                  {item.subItems.map((subItem, subIndex) => (
                    <button key={subIndex} className={styles.subButton}>
                      <h3 className={styles.textMedium}>{subItem.label}</h3>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section 4 */}
        <div className={styles.sectionFour}>
          <div className={styles.profSection}>
            <img src="profile-pic.jpg" alt="" />
            <h2>
              Mr. John Doe
              <br />
              <span
                style={{
                  fontSize: "14px",
                  color: "#4e4e4e",
                  fontWeight: "400",
                }}
              >
                johndoe@gmail.com
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

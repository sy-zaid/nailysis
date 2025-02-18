import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import useCurrentUserData from "../../../useCurrentUserData";

const Sidebar = ({ userRole, setView, isOpen, toggleSidebar }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const { data: curUser } = useCurrentUserData(); // Fetch patient data

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Toggle dropdown visibility
  };

  const menuItems = {
    clinic_admin: [
      {
        icon: "icon-test-results-black.jpg",
        label: "Electronic Health Records",
        subItems: [
          { label: "Patient Records" },
          { label: "Medical History & Notes" },
        ],
      },
      {
        icon: "icon-diagnostic-results-black.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },
    ],
    doctor: [
      {
        icon: "icon-test-results-black.jpg",
        label: "Test Results",
        subItems: [],
      },
      {
        icon: "icon-diagnostic-results-black.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },
    ],
    patient: [
      {
        icon: "icon-test-results-black.jpg",
        label: "Test Results",
        subItems: [],
      },
      {
        icon: "icon-diagnostic-results-black.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Billing History" },
        ],
      },
      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },
    ],
    lab_admin: [
      {
        icon: "icon-test-results-black.jpg",
        label: "Test Results",
        subItems: [],
      },
      {
        icon: "icon-diagnostic-results-black.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },
    ],
    lab_technician: [
      {
        icon: "icon-test-results-black.jpg",
        label: "Test Results",
        subItems: [],
      },
      {
        icon: "icon-diagnostic-results-black.jpg",
        label: "Diagnostic Results",
        subItems: [],
      },
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointment History" },
        ],
      },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },
    ],
  };

  const currentMenu = menuItems[userRole] || [];

  return (
    <div>
      {/* Toggle Button (hide when sidebar is open) */}
      {!isOpen && (
        <>
          <button className={`${styles.toggleButton}`} onClick={toggleSidebar}>
            <img src={"icon-menu-black.png"} alt={"menu button"} />
          </button>
          <div className={styles.floatingButtons}>
            <div className={styles.floatingCircle}>
              <img src="icon-dashboard-black.png" alt="" />
            </div>
            <div className={styles.floatingCircle}>
              <img src="icon-test-results-black.png" alt="" />
            </div>
            <div className={styles.floatingCircle}>
              <img src="icon-diagnostic-results-black.png" alt="" />
            </div>
            <div className={styles.floatingCircle}>
              <img src="icon-appointments-black.png" alt="" />
            </div>
            <div className={styles.floatingCircle}>
              <img src="icon-billing-black.png" alt="" />
            </div>
            <div className={styles.floatingCircle}>
              <img src="icon-feedback-black.png" alt="" />
            </div>
          </div>
        </>
      )}

      {/* Sidebar */}
      <div className={`${styles.sidePanel} ${isOpen ? styles.open : ""}`}>
        {/* Section 1 */}
        <div className={styles.sectionOne}>
          <div>
            {isOpen && (
              <button className={styles.closeButton} onClick={toggleSidebar}>
                <img src="icon-close-black.jpg" alt="close button" />
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
          <button className={styles.sideButton} onClick={() => setView("")}>
            <img src="icon-dashboard-black.jpg" alt="dashboard icon" />
            <h3 className={styles.textMedium}>Dashboard</h3>
          </button>
          <button
            className={styles.sideButton}
            onClick={() => setView("Analytics")}
          >
            <img src="icon-analytics-black.jpg" alt="analytics icon" />
            <h3 className={styles.textMedium}>Reports & Analytics</h3>
          </button>
        </div>

        {/* Section 3 */}
        <div className={`${styles.sectionThree} `}>
          <div
            className={`${styles.sectionThreeSecondDiv} ${styles.secThreeCustomScrollBar}`}
          >
            {currentMenu.map((item, index) => (
              <div key={index}>
                {/* Main Item */}
                <button
                  className={styles.sideButton}
                  onClick={() => {
                    if (item.subItems.length === 0) {
                      // If no sub-items, set the view based on the main item label
                      setView(item.label);
                    } else {
                      // If there are sub-items, toggle the dropdown visibility
                      toggleDropdown(index);
                    }
                  }}
                >
                  <img src={item.icon} alt={`${item.label} icon`} />
                  <h3 className={styles.textMedium}>{item.label}</h3>
                </button>

                {/* Dropdown items */}
                {item.subItems.length > 0 && (
                  <div
                    className={`${styles.sbdropdown} ${
                      openDropdown === index ? styles.sbdropdownopen : ""
                    }`}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        className={styles.sbsubButton}
                        onClick={() => {
                          setView(`${subItem.label}`);
                        }}
                      >
                        <h3 className={styles.sbtextMedium}>{subItem.label}</h3>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 */}
        <div className={styles.sectionFour}>
          {(curUser || []).map((item, index) => (
            <div className={styles.profSection} key={index}>
              {/* <div > */}
              <img
                src={item.profile_picture || "profile-pic.jpg"}
                alt="Profile"
              />
              <h2>
                {item.first_name} {item.last_name}
                <br />
                <span>{item.email}</span>
              </h2>
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

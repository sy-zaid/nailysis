import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import useCurrentUserData from "../../../useCurrentUserData";
import PopupEditProfile from "../../Popup/patient-edit-profile-popup";
import { handleLogout } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ userRole, setView, isOpen, toggleSidebar }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(1); // Track which dropdown is open
  const { data: curUser } = useCurrentUserData(); // Fetch patient data

  const [popupContent, setPopupContent] = useState();
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Toggle dropdown visibility
  };

  const menuItems = {
    clinic_admin: [
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointments History" },
          { label: "Cancellation Requests" },
        ],
      },
      {
        icon: "icon-ehr-black.svg",
        label: "Electronic Health Records",
        subItems: [
          { label: "All Patients Records" },
          { label: "All Medical Histories" },
        ],
      },
      {
        icon: "icon-test-results-black.jpg",
        label: "Test Results",
        subItems: [],
      },
      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
    ],
    doctor: [
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "My Appointments" },
          { label: "Appointments History" },
          { label: "Manage Availability" },
          { label: "My Cancellation Requests" },
        ],
      },
      {
        icon: "icon-ehr-black.svg",
        label: "Electronic Health Records",
        subItems: [
          { label: "All Patients Records" },
          { label: "All Medical Histories" },
        ],
      },

      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
    ],
    patient: [
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "Clinic Appointments" },
          { label: "Lab Appointments" },
          { label: "Appointments History" },
          // { label: "My Clinic Cancellation Requests" },
          // { label: "My Lab Cancellation Requests" },
        ],
      },
      {
        icon: "icon-ehr-black.svg",
        label: "Electronic Health Records",
        subItems: [{ label: "My Records" }, { label: "My Medical History" }],
      },
      {
        icon: "icon-test-results-black.jpg",
        label: "Test Results",
        subItems: [],
      },

      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Billing History" },
        ],
      },
    ],
    lab_admin: [
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointments History" },
          { label: "Cancellation Requests" },
        ],
      },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },
      {
        icon: "icon-ehr-black.svg",
        label: "Electronic Health Records",
        subItems: [
          { label: "All Patients Records" },
          { label: "All Medical Histories" },
        ],
      },
      // {
      //   icon: "icon-test-results-black.jpg",
      //   label: "Test Results",
      //   subItems: [],
      // },

      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
    ],
    lab_technician: [
      {
        icon: "icon-appointments-black.jpg",
        label: "Appointments",
        subItems: [
          { label: "View Appointments" },
          { label: "Appointments History" },
          { label: "Manage Availability" },
          { label: "My Cancellation Requests" },
        ],
      },
      {
        icon: "icon-test-request-black.jpg",
        label: "Test Requests",
        subItems: [],
      },

      {
        icon: "icon-ehr-black.svg",
        label: "Electronic Health Records",
        subItems: [
          { label: "All Patients Records" },
          { label: "All Medical Histories" },
        ],
      },
      // {
      //   icon: "icon-test-results-black.jpg",
      //   label: "Test Results",
      //   subItems: [],
      // },

      { icon: "icon-feedback-black.jpg", label: "Feedbacks", subItems: [] },
      {
        icon: "icon-billing-black.jpg",
        label: "Billing & Invoice",
        subItems: [
          { label: "Generate Invoice" },
          { label: "View Payment History" },
        ],
      },
    ],
  };

  const currentMenu = menuItems[userRole] || [];

  // Handlers

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup when closing
  };

  const handleActionClick = (action) => {
    console.log(`Action: ${action}`);

    if (action === "Edit Profile") {
      setPopupContent(<PopupEditProfile onClose={handleClosePopup} />);
      setShowPopup(true);
    }
  };

  return (
    <div>
      {showPopup && popupContent}
      {/* Toggle Button (hide when sidebar is open) */}
      {!isOpen && (
        <>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <img src="icon-menu-black.png" alt="menu button" />
          </button>

          <div className={styles.floatingButtons}>
            <div
              className={styles.floatingCircle}
              onClick={() => setView("")}
              title="Dashboard"
            >
              <img
                src="icon-dashboard-black.svg"
                alt="Dashboard"
                className={styles.iconDefault}
              />
              <img
                src="icon-dashboard-white.svg"
                alt="Dashboard"
                className={styles.iconHover}
              />
            </div>

            <div
              className={styles.floatingCircle}
              onClick={() => setView("My Records")}
              title="Electronic Health Records"
            >
              <img
                src="icon-ehr-black.svg"
                alt="Electronic Health Records"
                className={styles.iconDefault}
              />
              <img
                src="icon-ehr-white.svg"
                alt="Electronic Health Records"
                className={styles.iconHover}
              />
            </div>

            <div
              className={styles.floatingCircle}
              onClick={() => setView("Diagnostic Results")}
              title="Diagnostic Results"
            >
              <img
                src="icon-test-requests-black.svg"
                alt="Diagnostic Results"
                className={styles.iconDefault}
              />
              <img
                src="icon-test-requests-white.svg"
                alt="Diagnostic Results"
                className={styles.iconHover}
              />
            </div>

            <div
              className={styles.floatingCircle}
              onClick={() => setView("Appointments")}
              title="Appointments"
            >
              <img
                src="icon-appointments-black.svg"
                alt="Appointments"
                className={styles.iconDefault}
              />
              <img
                src="icon-appointments-white.svg"
                alt="Appointments"
                className={styles.iconHover}
              />
            </div>

            <div
              className={styles.floatingCircle}
              onClick={() => setView("Billing & Invoice")}
              title="Billing & Invoice"
            >
              <img
                src="icon-billing-black.svg"
                alt="Billing & Invoice"
                className={styles.iconDefault}
              />
              <img
                src="icon-billing-white.svg"
                alt="Billing & Invoice"
                className={styles.iconHover}
              />
            </div>

            <div
              className={styles.floatingCircle}
              onClick={() => setView("Feedbacks")}
              title="Feedbacks"
            >
              <img
                src="icon-feedbacks-black.svg"
                alt="Feedbacks"
                className={styles.iconDefault}
              />
              <img
                src="icon-feedbacks-white.svg"
                alt="Feedbacks"
                className={styles.iconHover}
              />
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
            <div>
              <h2>
                Nailysis
                <br />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#7f7f7fff",
                    fontWeight: "600",
                  }}
                >
                  Clinical Application
                </span>
              </h2>
            </div>
          </div>
        </div>
        {/* Section 2 */}
        <div className={styles.sectionTwo}>
          <button className={styles.sideButton} onClick={() => setView("")}>
            <div className={styles.buttonContent}>
              <img src="icon-dashboard-black.jpg" alt="dashboard icon" />
              <h3 className={styles.textMedium}>Dashboard</h3>
            </div>
          </button>
          <button
            className={styles.sideButton}
            onClick={() => setView("Analytics")}
          >
            <div className={styles.buttonContent}>
              <img src="icon-analytics-black.jpg" alt="analytics icon" />
              <h3 className={styles.textMedium}>Reports & Analytics</h3>
            </div>
          </button>
        </div>

        {/* Section 3 */}
        <div className={`${styles.sectionThree}`}>
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
                      setView(item.label);
                    } else {
                      toggleDropdown(index);
                    }
                  }}
                >
                  <div className={styles.buttonContent}>
                    <img src={item.icon} alt={`${item.label} icon`} />
                    <h3 className={styles.textMedium}>{item.label}</h3>
                  </div>
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
                        <div className={styles.buttonContent}>
                          <h3 className={styles.sbtextMedium}>
                            {subItem.label}
                          </h3>
                        </div>
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
              <h2 className={styles.profileInfo}>
                {item.first_name} {item.last_name}
                <br />
                <span>{item.email}</span>
              </h2>

              {/* Links (hidden by default, shown on hover) */}
              <div className={styles.hiddenLinks}>
                <span className={styles.editProfileLink}>
                  <i class="fa-solid fa-pen"></i>
                  <a onClick={() => handleActionClick("Edit Profile")}>
                    Edit Profile
                  </a>
                </span>
                <span
                  className={styles.logoutLink}
                  onClick={() => handleLogout(navigate)}
                >
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <a>Logout</a>
                </span>
              </div>
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

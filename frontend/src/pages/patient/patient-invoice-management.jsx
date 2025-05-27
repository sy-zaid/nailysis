
import React, { useState, useRef, useEffect } from 'react';
import styles from "../common/all-pages-styles.module.css";
import mediaStyles from "../common/media.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup.jsx";
import PopupInvoiceDetails from '../../components/Popup/invoice-details-popup.jsx';

// UTILS.JS FUNCTIONS 
import {
  getStatusClass, 
  toggleActionMenu,
} from "../../utils/utils";


const InvoiceManagement = (props) => {
  // ----- POPUPS & NAVIGATION
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);
  const [invoiceDetailsPopup, setinvoiceDetailsPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // ----- IMPORTANT DATA
  const [activeButton, setActiveButton] = useState(0); 

  // ----- SAMPLE DATA
  const data = [
    {
        id: 1,
        invoiceNo: "123456",
        doctorName: "John",
        serviceType: "Consultation",
        serviceDateTime: "10/10/2024 09:30 AM",
        totalAmount: "RS/- 5000",
        paidAmount: "RS/- 5000",
        pendingAmount: "RS/- 0",
        paymentStatus: "Paid",
    },

    {
        id: 2,
        invoiceNo: "123456",
        doctorName: "Doe",
        serviceType: "Procedure",
        serviceDateTime: "10/10/2024 09:30 AM",
        totalAmount: "RS/- 6000",
        paidAmount: "RS/- 5000",
        pendingAmount: "RS/- 1000",
        paymentStatus: "Overdue",
    },
  ];

  // ----- HANDLERS
  const handleOpenInvoicePopup = () => {
    setinvoiceDetailsPopup(true);
    setPopupVisible(false);
  };

  const handleCloseInvoiceDetails = () => {
    setinvoiceDetailsPopup(false);
  };

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };
  
  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height - 30, // Adjust for scroll position
      left: iconRect.left + window.scrollX - 75, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  const handleOptionClick = (option) => {
    alert(`${option} clicked`);
    setPopupVisible(false); // Hide popup after clicking
  };

  // ----- USE-EFFECTS

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
    
    <div className={`${styles.pageContainer} ${mediaStyles.pageContainer}`}>

      <PopupInvoiceDetails
        invoiceDetailsPopup={invoiceDetailsPopup} 
        setinvoiceDetailsPopup={setinvoiceDetailsPopup} 
        onProceed={handleCloseInvoiceDetails}
      />

      <div className={`${styles.pageTop} ${mediaStyles.pageTop}`}>
        <Navbar />
        <Header 
            mainHeading={'Invoice Management'}
            subHeading={'Here you can view & manage all the invoices of the patients'}
          />
      </div>
      <div className={`${styles.mainContent} ${mediaStyles.mainContent}`}>

        <div className={styles.appointmentsContainer}>
          <div className={`${styles.filters} ${mediaStyles.filters}`}>
          <button
              className={`${styles.filterButton} ${mediaStyles.filterButton} ${activeButton === 0 ? styles.active : ''}`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${mediaStyles.filterButton} ${activeButton === 1 ? styles.active : ''}`}
              onClick={() => handleFilterClick(1)}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${mediaStyles.filterButton} ${activeButton === 2 ? styles.active : ''}`}
              onClick={() => handleFilterClick(2)}
            >
              Completed
            </button>
            <button
              className={`${styles.filterButton} ${mediaStyles.filterButton} ${activeButton === 3 ? styles.active : ''}`}
              onClick={() => handleFilterClick(3)}
            >
              Cancelled
            </button>
            <p>50 paid, 4 pending</p>
            
            <button className={`${styles.addButton} ${mediaStyles.addButton}`}>
              <i className='bx bx-plus-circle'></i> Add New Invoice
            </button>

          </div>
          <div className={styles.tableContainer}>
            <div className={`${styles.controls} ${mediaStyles.controls}`}>
              <select className={`${styles.bulkAction} ${mediaStyles.bulkAction}`}>
                <option>Bulk Action: Delete</option>
              </select>
              <select className={`${styles.sortBy} ${mediaStyles.sortBy}`}>
                <option>Sort By: Ordered Today</option>
              </select>
              <input
                className={`${styles.search} ${mediaStyles.search}`}
                type="text"
                placeholder="Search By Doctor Name"
              />
            </div>

            <hr />
            <br />

            <div className={`${styles.tableWrapper} ${mediaStyles.tableWrapper}`}>
              <table className={`${styles.table} ${mediaStyles.table}`}>
                <thead>
                <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>#</th>
                    <th >Invoice No.</th>
                    <th>Doctor Name</th>
                    <th>Service Type</th>
                    <th>Date and Time of Service</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Pending Amount</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{row.id}</td>
                    <td>{row.invoiceNo}</td>
                    <td>{row.doctorName}</td>
                    <td>{row.serviceType}</td>
                    <td>{row.serviceDateTime}</td>
                    <td>{row.totalAmount}</td>
                    <td>{row.paidAmount}</td>
                    <td>{row.pendingAmount}</td>
                    <td className={getStatusClass(row.paymentStatus, styles)}>{row.paymentStatus}</td>
                    
                    {/* ------------------------- ACTION BUTTONS -------------------------*/}
                      
                    <td>
                      <button
                        onClick={(event) => toggleActionMenu(row.id, menuOpen, setMenuOpen, setMenuPosition, event)}
                        className={styles.moreActionsBtn}
                      >
                        <img src="/icon-three-dots.png" alt="More Actions" className={styles.moreActionsIcon} />
                      </button>

                      {menuOpen && (
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

                            <li onClick={handleOpenInvoicePopup}>
                              <i className="fa-solid fa-eye"></i>View Details
                            </li>
                            <li>
                              <i className="fa-solid fa-pen"></i>Edit Details
                            </li>
                            <li>
                              <i className="fa-solid fa-trash"></i>Delete Invoice
                            </li>
                            <li>
                              <i className="fa-solid fa-download"></i>Download as PDF
                            </li>
                            <li>
                              <i className="fa-solid fa-print"></i> Print Invoice
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

export default InvoiceManagement; 

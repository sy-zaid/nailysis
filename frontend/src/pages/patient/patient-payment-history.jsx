
import React, { useState, useRef, useEffect } from 'react';
import styles from "../common/all-pages-styles.module.css";
import mediaStyles from "../common/media.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";

// UTILS.JS FUNCTIONS
import {
  getStatusClass, 
  toggleActionMenu,
} from "../../utils/utils";


const PaymentHistory = (props) => {
  const [activeButton, setActiveButton] = useState(0); 
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // ----- SAMPLE DATA
  const data = [
    {
        id: 1,
        invoiceNo: "123456",
        doctorName: "John",
        serviceType: "Consultation",
        paymentDateTime: "10/10/2024 09:30 AM",
        dueDate: "10/10/2024",
        pendingAmount: "RS/- 0",
        totalAmount: "RS/- 5000",
        paymentStatus: "Paid",
    },

    {
        id: 2,
        invoiceNo: "123456",
        doctorName: "Doe",
        serviceType: "Procedure",
        paymentDateTime: "10/10/2024 09:30 AM",
        dueDate: "10/10/2024",
        pendingAmount: "RS/- 1000",
        totalAmount: "RS/- 6000",
        paymentStatus: "Overdue",
      },
  ];

  // ----- HANDLERS
  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
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
    
    <div className={styles.pageContainer}>

      <div className={styles.pageTop}>
        
        <Header 
            mainHeading={'Billing History'}
            subHeading={'Here you can view all the billing details'}
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
            <p>50 paid, 4 pending</p>
            
            <button className={styles.addButton}>
              <i className='bx bx-plus-circle'></i> Book New Appointment
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
                placeholder="Search By Doctor Name"
              />
            </div>

            <hr />
            <br />

            <div className={styles.tableWrapper}>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>#</th>
                    <th >Invoice No.</th>
                    <th>Doctor Name</th>
                    <th>Service Type</th>
                    <th>Payment Date and Time</th>
                    <th>Due Date</th>
                    <th>Pending Amount</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th> </th>
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
                      <td>{row.paymentDateTime}</td>
                      <td>{row.dueDate}</td>
                      <td>{row.pendingAmount}</td>
                      <td>{row.totalAmount}</td>
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

                              <li>
                                <i className="fa-solid fa-eye"></i>View Details
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

export default PaymentHistory;

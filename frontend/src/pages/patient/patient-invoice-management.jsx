
import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup.jsx";


const InvoiceManagement = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const [activeButton, setActiveButton] = useState(0); 

  const [invoiceDetailsPopup, setinvoiceDetailsPopup] = useState(false);
  
  const handleTableEntryClick = () => {
      setinvoiceDetailsPopup(true);
  };

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

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return styles.consulted;
      case "Overdue":
        return styles.cancelled;
      default: // Pending
        return styles.scheduled;
    }
  }

  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };
  
  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5, // Adjust for scroll position
      left: iconRect.left + window.scrollX, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  const handleOptionClick = (option) => {
    alert(`${option} clicked`);
    setPopupVisible(false); // Hide popup after clicking
  };

  // Close popup when clicking outside
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


    {/* Invoice Details Popup */}
    <Popup trigger={invoiceDetailsPopup} setTrigger={setinvoiceDetailsPopup}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2>Invoice Details For Patient: John Doe (Invoice ID: 12345)</h2>
          </div>

          <h5 className={styles.subhead}>
            Detailed view for the invoice number #123456.
          </h5>
          <hr />

          <p className={styles.newSubHeading}>
            <span className={styles.key}> Viewed By: </span>
            <span className={styles.locationValue}>Clinic Admin</span>
            <span className={styles.secKey}> Status: </span>
            <span className={getStatusClass("Paid")}>Paid</span>
          </p>

          <p className={styles.newSubHeading}>
            <span className={styles.key}> Issuance Date & Time: </span>
            <span className={styles.locationValue}>10/10/2024 09:30 AM</span>
          </p>

            <div className={styles.formSection}>
              <br />
                    <h3>Invoice Details</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Invoice Number</label>
                        <p className={styles.subHeading}>123456</p>
                      </div>
                      <div>
                        <label>Doctor Name</label>
                        <p className={styles.subHeading}>John Doe</p>
                      </div>
                      <div>
                        <label>Service Type</label>
                        <p className={styles.subHeading}>Consultation</p>
                      </div>
                      <div>
                        <label>Date & Time of Service</label>
                        <p className={styles.subHeading}>12/9/2024 05:30 PM</p>
                      </div>
                      <div>
                        <label>Paid Amount</label>
                        <p className={styles.subHeading}>RS/- 4000</p>
                      </div>

                      <div>
                        <label>Pending Amount</label>
                        <p className={styles.subHeading}>RS/- 1000</p>
                      </div>

                      <div>
                        <label>Service Fee</label>
                        <p className={styles.subHeading}>RS/- 5000</p>
                      </div>
                    </div>
            </div>

            <div className={styles.formSection}>
                    <h3>Change Summary</h3>
                    <div className={styles.documentFormGroup}>
                      <div>
                        <p className={styles.subHeading}>Payment of PKR 5000 received for Invoice ID "INV-98765"</p>
                      </div>
                    
                    </div>
            </div>


            <div className={styles.formSection}>
                    <h3>Comments/Reason</h3>
                    <div className={styles.documentFormGroup}>
                      <div>
                        <p className={styles.subHeading}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque provident commodi, sapiente, totam veritatis odio ad sequi eius quod inventore dicta saepe. Nisi, accusamus.</p>
                      </div>
                    
                    </div>
            </div>

          <div className={styles.newActions}>
            <button className={styles.addButton}>
              Download as PDF File
            </button>
            <button className={styles.addButton}>
              Send to Printer
            </button>
          </div>
        </div>
    </Popup>



      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Invoice Management'}
            subHeading={'Here you can view & manage all the invoices of the patients'}
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
                Add New Invoice
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
                  <th>Date and Time of Service</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Pending Amount</th>
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
                  <td>{row.serviceDateTime}</td>
                  <td>{row.totalAmount}</td>
                  <td>{row.paidAmount}</td>
                  <td>{row.pendingAmount}</td>
                  <td className={getStatusClass(row.paymentStatus)}>{row.paymentStatus}</td>
                  <td style={{ position: "relative" }}>
                      <i
                        className="bx bx-dots-vertical-rounded"
                        style={{ cursor: "pointer" }}
                        onClick={togglePopup}
                      ></i>
                    </td>
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
            padding: "0",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <p style={{ margin: "5px 0", cursor: "pointer" }} onClick={handleTableEntryClick}>
            👁️ View Details
          </p>
          <p style={{ margin: "5px 0", cursor: "pointer" }}>
            ✏️ Edit Details
          </p>
          <p style={{ margin: "5px 0", cursor: "pointer" }}>
            🗑️ Delete Invoice
          </p>
          <p style={{ margin: "5px 0", cursor: "pointer" }}>
            📄 Download as PDF
          </p>
          <p style={{ margin: "5px 0", cursor: "pointer" }}>
            🖨️ Print Invoice
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;

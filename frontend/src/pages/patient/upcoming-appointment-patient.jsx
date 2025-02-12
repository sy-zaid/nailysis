import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup.jsx";


const Appointment = (props) => {
  const [activeButton, setActiveButton] = useState(0); 

  const data = [
    {
      id: 1,
      appointmentId: "123456",
      doctorOrTechnician: "Dr. John",
      speciality: "Dermatologist",
      appointmentDateTime: "10/10/2024 09:30 AM",
      purpose: "Consultation",
      status: "Consulted",
    },

    {
      id: 9,
      appointmentId: "123456",
      doctorOrTechnician: "Dr. Doe",
      speciality: "Dermatologist",
      appointmentDateTime: "10/10/2024 09:30 AM",
      purpose: "Consultation",
      status: "Cancelled",
    },
  ];

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

  const [firstPopup, setFirstPopup] = useState(false);
  const [secondPopup, setSecondPopup] = useState(false);

  const handleTableEntryClick = () => {
    setSecondPopup(true);
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

      {/* Book New Appointment Popup */}

      <Popup trigger={firstPopup} setTrigger={setFirstPopup}>
                <div className={styles.formContainer}>
                  <div className={styles.header}>
                    <h2>Schedule Your Appointment</h2>
                  </div>

                  <h5 className={styles.subhead}>Choose your customized appointment timings and other details</h5>

                  <hr /> 

                  <p className={styles.subHeading}>
                    <span className={styles.icons}><i className='bx bx-loader-alt'></i></span>
                    <span className={styles.key}>Status: </span>
                    <span className={styles.statusValue}>Upcoming</span>
                    <span className={styles.icons}><i className='bx bx-map' ></i></span> 
                    <span className={styles.key}>Location: </span> 
                    <span className={styles.locationValue}>Lifeline Hospital, North Nazimabad</span>
                  </p>

                  <div className={styles.formSection}>
                    <h3>Patient Information</h3>
                    <div className={styles.formGroup}>
                      <div>
                        <label>Name</label>
                        <input type="text" placeholder="John Doe" />
                      </div>
                      <div>
                        <label>Age</label>
                        <input type="number" placeholder="21" />
                      </div>
                      <div>
                        <label>Gender</label>
                        <input type="text" placeholder="Male" />
                      </div>
                      <div>
                        <label>Phone Number</label>
                        <input type="tel" placeholder="+92 12345678" />
                      </div>
                      <div>
                        <label>Email Address</label>
                        <input type="tel" placeholder="patient@gmail.com" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h3>Appointment Details</h3>
                    <div className={styles.formGroup}>
                      <div>
                        <label>Specification</label>
                        <select>
                          <option>Dermatologist</option>
                        </select>
                      </div>
                      <div>
                        <label>Doctor/Provider</label>
                        <select>
                          <option>Dr. Jane Doe</option>
                        </select>
                      </div>
                      <div>
                        <label>Date & Time (Available)</label>
                        <input type="datetime-local" />
                      </div>
                      
                      <div>
                        <label>Visit Purpose</label>
                        <select>
                          <option>Consultation</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <h3>Payment Details</h3>
                    <div className={styles.formGroup}>
                      <div>
                        <label>Discount Code</label>
                        <select>
                          <option>No Discount</option>
                        </select>
                      </div>
                      <div>
                        <label>Service Fee</label>
                        <p className={styles.subHeading}>RS/- 5000</p>
                      </div>
                      <div>
                        <label>Sales Tax</label>
                        <p className={styles.subHeading}>RS/- 5.0</p>
                      </div>

                    </div>
                    
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={() => setFirstPopup(false)}>Cancel</button>
                    <button className={styles.confirmButton}>Continue to Next Step</button>
                  </div>
                </div>
      </Popup>


      {/* Appointment Details Popup */}

      <Popup trigger={secondPopup} setTrigger={setSecondPopup}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2>Appointment Details: John Doe (Appointment ID: 123456)</h2>
          </div>

          <h5 className={styles.subhead}>
            Detailed view for the appointment #123456.
          </h5>
          <hr />

          <p className={styles.newSubHeading}>
            <span className={styles.icons}><i class='bx bx-plus-medical'></i></span>
            <span className={styles.key}> Doctor/Technician: </span>
            <span className={styles.locationValue}>Dr. John Doe</span>
            <span className={styles.statusIcon}><i className='bx bx-loader-alt'></i></span>
            <span className={styles.key}>Status: </span>
            <span className={styles.statusValue}>Upcoming</span>
          </p>

          <p className={styles.newSubHeading}>
            <span className={styles.icons}><i class='bx bx-calendar'></i></span>
            <span className={styles.key}> Date & Time: </span>
            <span className={styles.locationValue}>10/10/2024 09:30 AM</span>
            <span className={styles.icons}><i className='bx bx-map' ></i></span> 
            <span className={styles.key}>Location: </span> 
            <span className={styles.locationValue}>Lifeline Hospital, North Nazimabad</span>
          </p>

            <div className={styles.formSection}>
              <br />
                    <h3>Doctor/Technician Details</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Speciality</label>
                        <p className={styles.subHeading}>Dermatologist</p>
                      </div>
                      <div>
                        <label>Visit Purpose</label>
                        <p className={styles.subHeading}>Consultation</p>
                      </div>
                      <div>
                        <label>Next Follow Up</label>
                        <p className={styles.subHeading}>10/10/2024</p>
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
                        <label>Total Amount</label>
                        <p className={styles.subHeading}>RS/- 5000</p>
                      </div>
                    </div>
            </div>

            <div className={styles.formSection}>
                    <h3>Attached Documents</h3>
                    <div className={styles.documentFormGroup}>
                      <div>
                        <p className={styles.subHeading}>Upload and attach any test report in PDF or directly from the Test Results.</p>
                      </div>
                    
                      <div>
                        <button className={styles.uploadDocBtn}>Upload Document</button>
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
          </div>
        </div>
      </Popup>



      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Appointments'}
            subHeading={'Here you can view all the booked appointments for doctors and lab tests'}
          />
      </div>
      <br />
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
            <p>50 completed, 4 upcoming</p>
            
            <div className={styles.appointmentButtons}>
              <button className={styles.addButton}>
                  Download Visit Summary
              </button>

              <button onClick={() => setFirstPopup(true)} className={styles.addButton}>
                  Book New Appointment
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
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th >Appointment ID</th>
                  <th>Doctor/Technician</th>
                  <th>Speciality</th>
                  <th>Appointment Date & Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
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
                    <td>{row.appointmentId}</td>
                    <td>{row.doctorOrTechnician}</td>
                    <td>{row.speciality}</td>
                    <td>{row.appointmentDateTime}</td>
                    <td>{row.purpose}</td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
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
            padding: "10px",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <p style={{ margin: "10px 0", cursor: "pointer" }} onClick={handleTableEntryClick}>
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

export default Appointment;

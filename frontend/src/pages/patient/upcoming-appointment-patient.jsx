import React, { useState } from 'react';
import styles from "../../components/CSS Files/PatientAppointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup.jsx";


const Appointment = (props) => {
  const data = [
    {
      id: 1,
      appointmentId: "123456",
      patientName: "John",
      gender: "Male",
      email: "patient1@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "Blood Test",
      status: "Consulted",
    },

    {
      id: 9,
      appointmentId: "123456",
      patientName: "Carl",
      gender: "Female",
      email: "patient9@gmail.com",
      phone: "+123 456 789",
      dateTime: "10/10/2024 09:30 AM",
      testType: "COVID-19",
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



  return (
    
    <div className={styles.pageContainer}>

      {/* First Popup */}

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


      {/* Second Popup */}

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
            <button className={styles.confirmButton}>
              Download as PDF File
            </button>
          </div>
        </div>
      </Popup>



      <div className={styles.pageTop}>
        <Navbar />
        <Header curUserRole="Appointments" />
      </div>
      <div className={styles.mainContent}>

        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <button className={styles.filterButton}>All</button>
            <button className={styles.filterButton}>Upcoming</button>
            <button className={styles.filterButton}>Consulted</button>
            <button className={styles.filterButton}>Cancelled</button>
            <p>50 completed, 4 upcoming</p>
            
            <button onClick={() => setFirstPopup(true)} className="btn book-appointment">
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th >Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointment Date & Time</th>
                  <th>Test Type</th>
                  <th>Scheduled Appointment</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} onClick={handleTableEntryClick}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{row.id}</td>
                    <td>{row.appointmentId}</td>
                    <td>{row.patientName}</td>
                    <td>{row.gender}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>{row.dateTime}</td>
                    <td>{row.testType}</td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Appointment;

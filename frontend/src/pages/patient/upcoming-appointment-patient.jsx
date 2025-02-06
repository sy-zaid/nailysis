import React, { useEffect, useState } from "react";
import styles from "../../components/CSS Files/Appointment.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api";

const AppointmentPatients = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [consultationFee, setConsultationFee] = useState('');

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      console.log("No token found, Redirecting to login");
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await api.get("http://127.0.0.1:8000/api/appointments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointments();
  }, [token, navigate]);

  const handleAddAppointment = () => {
    // Handle form submission to book a new appointment
    const appointmentData = {
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      appointment_type: appointmentType,
      specialization: specialization,
      consultation_fee: consultationFee,
    };

    axios
      .post(
        "http://127.0.0.1:8000/api/appointments/book_appointment/",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert("Appointment booked successfully");
        // Optionally, navigate to the appointment page or refresh the list
        navigate("/appointments");
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
      });
  };

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
        <h1>Appointments</h1>
        <p>Here you can view and manage all the booked appointments</p>
      </div>
      <div className={styles.mainContent}>

        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
            <div className={styles.filterTabs}>
              <button className={styles.filterButton}>All</button>
              <button className={styles.filterButton}>Upcoming</button>
              <button className={styles.filterButton}>Consulted</button>
              <button className={styles.filterButton}>Cancelled</button>
              <p className={styles.statusSummary}>50 completed, 4 upcoming</p>
            </div>
            <button className={styles.addButton} onClick={handleAddAppointment}>
              Book New Appointment
            </button>
          </div>

          {/* Form for Booking New Appointment */}
          <div className={styles.formContainer}>
            <h2>Book an Appointment</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
              <input
                type="text"
                placeholder="Appointment Type"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
              />
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              <input
                type="number"
                placeholder="Consultation Fee"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
              />
              <button type="submit" onClick={handleAddAppointment}>
                Book Appointment
              </button>
            </form>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table} style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th >Appointment ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointment Date & Time</th>
                  <th>Test Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((row, index) => (
                  <tr key={row.appointment_id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td>{index + 1}</td>
                    <td>{row.appointment_id}</td>
                    <td>
                      {row.patient?.user?.first_name || "No first name"}{" "}
                      {row.patient?.user?.last_name || "No last name"}
                    </td>
                    <td>{row.patient.gender}</td>
                    <td>{row.patient?.user?.email || "No email"}</td>
                    <td>{row.patient?.user?.phone || "No phone"}</td>
                    <td>{row.appointment_date} {row.appointment_time}</td>
                    <td>{row.test_type || "N/A"}</td>
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

export default AppointmentPatients;

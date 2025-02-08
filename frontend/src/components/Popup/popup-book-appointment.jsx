import React, { useState, useEffect } from "react";
import styles from "./popup-book-appointment.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    gender: "Male",
    phone: "+92 12345678",
    email: "johndoe@gmail.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 30,
    gender: "Female",
    phone: "+92 87654321",
    email: "janesmith@gmail.com",
  },
];

const visitPurposes = [
  "Consultation",
  "Follow-up",
  "Routine Checkup",
  "Emergency Visit",
  "Prescription Refill",
];

const PopupBookAppointment = (userRole) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  // State for appointment details
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  // State for current signed-in user
  const [currentUser, setCurrentUser] = useState(dummyUsers[0]); // Assume first user is logged in

  //Get the current userrole from localstorage
  const curUserRole = localStorage.getItem("role");

  // Autofill function (if user changes)
  useEffect(() => {
    setCurrentUser(dummyUsers[0]); // Assume user is John Doe for now
  }, []);

  const handleAddAppointment = (e) => {
    e.preventDefault();

    const appointmentData = {
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      appointment_type: appointmentType,
      specialization: specialization,
      consultation_fee: consultationFee,
      patient_name: currentUser.name,
      patient_age: currentUser.age,
      patient_gender: currentUser.gender,
      patient_phone: currentUser.phone,
      patient_email: currentUser.email,
    };

    axios
      .post("link", appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert("Appointment Booked Successfully");
        setAppointments([...appointments, response.data]);
        navigate("/");
      })
      .catch((error) => {
        alert("Failed to book appointment");
        console.log(error);
      });
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Schedule Your Appointment</h2>
        </div>

        <h5 className={styles.subhead}>
          Choose your customized appointment timings and other details
        </h5>
        <hr />

        <form onSubmit={handleAddAppointment}>
          {/* Patient Information Autofilled */}

          {/* CONDITION | Only editable profile section if the user is not a patient */}
          {/* Patient Information - Always visible, but editable only for doctors */}
          <div className={styles.formSection}>
            <h3>Patient Information</h3>
            <div className={styles.formGroup}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Age</label>
                <input
                  type="number"
                  placeholder="21"
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Gender</label>
                <input
                  type="text"
                  placeholder="Male"
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+92 12345678"
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="patient@gmail.com"
                  disabled={curUserRole === "patient"}
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className={styles.formSection}>
            <h3>Appointment Details</h3>
            <div className={styles.formGroup}>
              <div>
                <label>Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option>Dermatologist</option>
                </select>
              </div>
              <div>
                <label>Doctor/Provider</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                >
                  <option>Dr. Jane Doe</option>
                </select>
              </div>
              <div>
                <label>Date & Time (Available)</label>
                <input
                  type="datetime-local"
                  value={`${appointmentDate}T${appointmentTime}`}
                  onChange={(e) => {
                    const [date, time] = e.target.value.split("T");
                    setAppointmentDate(date);
                    setAppointmentTime(time);
                  }}
                />
              </div>
              <div>
                <label>Visit Purpose</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  {visitPurposes.map((purpose, index) => (
                    <option key={index} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment Details */}
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
                <p className={styles.subHeading}>RS/- {consultationFee}</p>
              </div>
              <div>
                <label>Sales Tax</label>
                <p className={styles.subHeading}>RS/- 5.0</p>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              onClick={() => setPopupTrigger(false)}
            >
              Cancel
            </button>
            <button className={styles.confirmButton} type="submit">
              Continue to Next Step
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupBookAppointment;

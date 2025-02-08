import React, { useState, useEffect } from "react";
import styles from "./popup-book-appointment.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const visitPurposes = [
  "Consultation",
  "Follow-up",
  "Routine Checkup",
  "Emergency Visit",
  "Prescription Refill",
];

const PopupBookAppointment = ({ userRole }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  // State for appointment details
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  // Get the current userrole from localstorage
  const curUserRole = localStorage.getItem("role");

  // For holding specializations and doctors fetched from API
  const [specializations, setSpecializations] = useState([]);
  const [curSpecialization, setCurSpecialization] = useState();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/doctors/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Check the response structure here
        setSpecializations(response.data); // Set the specializations array directly
      })
      .catch((error) => {
        console.error("Failed to fetch doctors and specializations", error);
      });
  }, []);

  useEffect(() => {
    if (specialization) {
      axios
        .get(
          `http://127.0.0.1:8000/api/doctors/?specialization=${specialization}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("Doctors Response:", response.data);

          // Extract required doctor details
          const formattedDoctors = response.data.map((doc) => ({
            id: doc.user.id, // Use user.id as the doctor ID
            name: `${doc.user.first_name} ${doc.user.last_name}`, // Full name
            fee: doc.consultation_fee, // Fee details
          }));

          setDoctors(formattedDoctors); // Update doctors state
        })
        .catch((error) => {
          console.error("Failed to fetch doctors", error);
        });
    }
  }, [specialization]); // Run when specialization changes

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
          {/* Specialization Dropdown */}
          <div className={styles.formGroup}>
            <label>Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">Select Specialization</option>
              {specializations.length > 0 ? (
                specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))
              ) : (
                <option disabled>Loading specializations...</option>
              )}
            </select>
          </div>

          {/* Doctor Dropdown */}
          <div className={styles.formGroup}>
            <label>Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Date & Time */}
          <div className={styles.formGroup}>
            <label>Date & Time</label>
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

          {/* Visit Purpose Dropdown */}
          <div className={styles.formGroup}>
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

          {/* Consultation Fee */}
          <div className={styles.formGroup}>
            <label>Consultation Fee</label>
            <p className={styles.subHeading}>RS/- {consultationFee}</p>
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

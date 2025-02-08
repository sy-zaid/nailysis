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

const PopupBookAppointment = () => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");

  // State for appointment details
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "",
    specialization: "",
    fee: "0.00",
  });

  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (e) => {
    const [date, time] = e.target.value.split("T");
    setFormData((prev) => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: time || "",
    }));
  };

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/doctors/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpecializations(response.data);
      } catch (error) {
        console.error("Failed to fetch specializations", error);
      }
    };

    fetchSpecializations();
  }, [token]);

  // Fetch doctors based on selected specialization
  useEffect(() => {
    const fetchDoctors = async () => {
      if (formData.specialization) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/doctors/?specialization=${formData.specialization}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const formattedDoctors = response.data.map((doc) => ({
            id: doc.user.id,
            name: `${doc.user.first_name} ${doc.user.last_name}`,
          }));
          setDoctors(formattedDoctors);
        } catch (error) {
          console.error("Failed to fetch doctors", error);
        }
      }
    };

    fetchDoctors();
  }, [formData.specialization, token]);

  // Fetch fee based on appointment type
  useEffect(() => {
    const fetchFee = async () => {
      if (formData.appointmentType) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/doctor_fees/get_fees`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const filteredFee = response.data.find(
            (item) => item.appointment_type === formData.appointmentType
          );
          setFormData((prev) => ({
            ...prev,
            fee: filteredFee ? filteredFee.fee : null,
          }));
        } catch (error) {
          console.error("Failed to fetch fees", error);
        }
      }
    };

    fetchFee();
  }, [formData.appointmentType, token]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      doctor_id: formData.doctorId,
      appointment_date: formData.appointmentDate,
      appointment_time: formData.appointmentTime,
      appointment_type: formData.appointmentType,
      specialization: formData.specialization,
      fee: formData.fee,
      patient_name: curUserRole.name,
      patient_age: curUserRole.age,
      patient_gender: curUserRole.gender,
      patient_phone: curUserRole.phone,
      patient_email: curUserRole.email,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/doctor_appointments/book_appointment/",
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment Booked Successfully");
      setAppointments([...appointments, response.data]);
      navigate("/");
    } catch (error) {
      alert("Failed to book appointment");
      console.error(error);
    }
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

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Patient Information */}
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
          <div className={styles.formGroup}>
            <label>Specialization</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="appointmentDateTime"
              value={
                formData.appointmentDate && formData.appointmentTime
                  ? `${formData.appointmentDate}T${formData.appointmentTime}`
                  : ""
              }
              onChange={handleDateTimeChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Visit Purpose</label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleInputChange}
            >
              {visitPurposes.map((purpose, index) => (
                <option key={index} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Fee</label>
            <p className={styles.subHeading}>RS/- {formData.fee}</p>
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
                <p className={styles.subHeading}>RS/- {formData.fee}</p>
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
            <button
              className={styles.confirmButton}
              type="submit"
              onClick={handleAddAppointment}
            >
              Continue to Next Step
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupBookAppointment;

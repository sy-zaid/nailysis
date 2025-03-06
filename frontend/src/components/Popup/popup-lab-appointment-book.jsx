import React, { useState, useEffect } from "react";
import styles from "./popup-lab-appointment-book.module.css";
import Popup from "./Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// import { QueryClientProvider } from "@tanstack/react-query"; // Import React Query Client Provider
// import { queryClient } from "./queryClient"; // Import the client
import usePatientData from "../../useCurrentUserData.jsx";
import { calculateAge } from "../../utils/utils.js";

const visitPurposes = [
  "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Hemoglobin A1c (HbA1c)",
    "Testosterone Test",
    "PCR Test",
    "BRCA Gene Test",
];

const PopupBookLabAppointment = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const { data: curUser, isLoading, isError, error } = usePatientData(); // Fetch patient data
  console.log("CURRUSER", curUser);
  const [patient, setPatient] = useState([]); // Initialize patient state

  useEffect(() => {
    if (curUserRole == "patient" && curUser && curUser.length > 0) {
      setPatient([curUser[0].patient.user, curUser[0].patient]); // Set patient data if available
      // console.log("Patient's Data: ",patient[0],patient[1]);
    } else if (curUserRole == "lab_admin") {
      setPatient([]);
    } else {
      console.log("No patient data available");
    }
  }, [curUser]); // Triggered whenever `curUser` changes

  // State for appointment details
  const [formData, setFormData] = useState({
    labTechnicianId: "",
    appointmentDate: "",
    appointmentTime: "",
    LabTestType: "",
    fee: "0.00",
    patientFirstName: "",
    patientLastName: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [specializations, setSpecializations] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);

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
        const response = await axios.get("http://127.0.0.1:8000/api/lab_technicians/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpecializations(response.data);
      } catch (error) {
        console.error("Failed to fetch specializations", error);
      }
    };

    fetchSpecializations();
  }, [token]);

  // Fetch labTechnicians based on selected specialization
  useEffect(() => {
    const fetchlabTechnicians = async () => {
      if (formData.specialization) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/lab_technicians/?specialization=${formData.specialization}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const formattedlabTechnicians = response.data.map((tech) => ({
            id: tech.user.user_id,
            name: `${tech.user.first_name} ${tech.user.last_name}`,
          }));
          setLabTechnicians(formattedlabTechnicians);
          console.log("Formatted Docs", labTechnicians);
        } catch (error) {
          console.error("Failed to fetch labTechnicians", error);
        }
      }
    };

    fetchlabTechnicians();
  }, [formData.specialization, token]);

  // Fetch fee based on appointment type
  useEffect(() => {
    const fetchFee = async () => {
      if (formData.labTestType) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/lab_technician_fees/get_fees`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("response fee",response)
          const filteredFee = response.data.find(
            (item) => item.lab_test_type === formData.labTestType
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
  }, [formData.labTestType, token]);

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      lab_technician_id: formData.labTechnicianId,
      appointment_date: formData.appointmentDate,
      appointment_time: formData.appointmentTime,
      lab_test_type: formData.labTestType,
      specialization: formData.specialization,
      fee: formData.fee,
      patient_first_name:
        patient?.first_name || formData.patientFirstName || "",
      patient_last_name: patient?.last_name || formData.patientLast || "",
      patient_age: patient?.age || formData.date_of_birth || "",
      patient_gender: patient?.gender || formData.gender || "",
      patient_phone: patient?.phone || formData.phone || "",
      patient_email: patient?.email || formData.email || "",
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/lab_technician_appointments/book_lab_appointment/",
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment Booked Successfully");
      setAppointments([...appointments, response.data]);
      console.log("Sending this to book:", appointmentData);
      navigate("");
    } catch (error) {
      alert("Failed to book appointment");
      console.log("Sending this to book:", appointmentData);
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
                <label>First Name</label>
                <input
                  type="text"
                  name="patientFirstName"
                  value={formData.patientFirstName}
                  onChange={handleInputChange}
                  placeholder={
                    curUserRole === "patient"
                      ? patient[0]?.first_name || ""
                      : "Enter First"
                  }
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="patientLastName"
                  value={formData.patientLastName}
                  onChange={handleInputChange}
                  placeholder={
                    curUserRole === "patient"
                      ? patient[0]?.last_name || ""
                      : "Enter Last"
                  }
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder={
                    curUserRole === "patient"
                      ? calculateAge(patient[1]?.date_of_birth) || ""
                      : "Enter Age"
                  }
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  placeholder={
                    curUserRole === "patient"
                      ? patient[1]?.gender || ""
                      : "Enter gender"
                  }
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={
                    curUserRole === "patient"
                      ? patient[0]?.phone || ""
                      : "Enter phone number"
                  }
                  disabled={curUserRole === "patient"}
                />
              </div>
              <div>
                <label>Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={
                    curUserRole === "patient"
                      ? patient[0]?.email || ""
                      : "Enter email address"
                  }
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
            <label>Lab Technician</label>
            <select
              name="labTechnicianId"
              value={formData.labTechnicianId}
              onChange={handleInputChange}
            >
              <option value="">Select Lab Technician</option>
              {labTechnicians.length > 0 ? (
                labTechnicians.map((labTechnician) => (
                  <option key={labTechnician.id} value={labTechnician.id}>
                    {labTechnician.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading labTechnicians...</option>
              )}
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
              name="labTestType"
              value={formData.labTestType}
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
            <button className={styles.cancelButton} onClick={onClose}>
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

export default PopupBookLabAppointment;

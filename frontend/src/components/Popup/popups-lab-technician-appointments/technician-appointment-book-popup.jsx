import React, { useState, useEffect } from "react";
import styles from "./technician-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../../useCurrentUserData.jsx";
import {
  calculateAge,
  handleInputChange,
  technicianVisitPurposes,
} from "../../../utils/utils.js";
import {
  getAvailableSlots,
  getTechFeeByType,
  getTechnicianFromSpecialization,
  getTechnicianSpecializations,
} from "../../../api/appointmentsApi.js";

const PopupBookLabAppointment = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);
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
    slotId: "",
    specialization: "",
    LabTestType: technicianVisitPurposes[0],
    fee: "0.00",
    patientFirstName: "",
    patientLastName: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
  });

  const onInputChange = handleInputChange(setFormData);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await getTechnicianSpecializations();
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
          const response = await getTechnicianFromSpecialization(
            formData.specialization
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
          const response = await getTechFeeByType(formData.LabTestType);

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

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      lab_technician_id: formData.labTechnicianId,
      slot_id: formData.slotId,
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

  // Fetch Available Slots On Chosen Date
  useEffect(() => {
    console.log("Updated Technician ID:", formData.labTechnicianId);
    console.log("Updated Appointment Date:", formData.appointmentDate);
    if (formData.labTechnicianId && formData.appointmentDate) {
      fetchAvailableSlots(formData.labTechnicianId,formData.appointmentDate);
    }
  }, [formData.labTechnicianId, formData.appointmentDate]);

  const fetchAvailableSlots = async (technicianId, appointmentDate) => {
    try {
      console.log("Fetching slots for:", technicianId, appointmentDate);
      const response = await getAvailableSlots(
        null,
        technicianId,
        appointmentDate
      );
      console.log("Fetched slots:", response);
      setAvailableSlots(response);
    } catch (error) {
      console.error("Failed to fetch available slots", error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={onInputChange}
            />
          </div>
          {/* Available Slots Selection */}
          <div className={styles.formGroup}>
            <label>Available Slots</label>
            <select
              name="slotId"
              value={formData.slotId}
              onChange={onInputChange}
              disabled={availableSlots.length === 0}
            >
              <option value="">
                {availableSlots.length ? "Select a Slot" : "No slots available"}
              </option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot.id}>
                  {slot.slot_id} - {slot.end_time}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Visit Purpose</label>
            <select
              name="labTestType"
              value={formData.labTestType}
              onChange={onInputChange}
            >
              {technicianVisitPurposes.map((purpose, index) => (
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
              onClick={handleBookAppointment}
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

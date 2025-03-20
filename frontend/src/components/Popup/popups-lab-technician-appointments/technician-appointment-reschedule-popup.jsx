import React, { useState, useEffect } from "react";
import styles from "./technician-appointment-book-popup.module.css";
import Select from "react-select";
import Popup from "../Popup.jsx";

import axios from "axios";

import { handleInputChange, handleSelectChange } from "../../../utils/utils.js";
import { getAvailableLabTests, getAvailableSlots } from "../../../api/appointmentsApi.js";

const PopupRescheduleTechnicianAppointment = ({
  onClose,
  appointmentDetails,
}) => {
  const [popupTrigger, setPopupTrigger] = useState(true);

  const token = localStorage.getItem("access");

  const [patient, setPatient] = useState([]); // Initialize patient state
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    patientName: appointmentDetails.patient.user.patient_name || "",
    age: appointmentDetails.patient.user.age || "",
    phone: appointmentDetails.patient.user.phone || "",
    email: appointmentDetails.patient.user.email || "",
    appointmentDate: appointmentDetails.appointmentDate || "",
    appointmentTime: appointmentDetails.appointmentTime || "",
    appointmentType: appointmentDetails.appointmentType || "",
  });

  const [labTechnicians, setLabTechnicians] = useState([]);

  // Fetch lab technicians based on selected specialization
  useEffect(() => {
    const fetchLabTechnicians = async () => {
      if (formData.specialization) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/lab_technicians/?specialization=${formData.specialization}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Response", response.data);
          const formattedLabTechnicians = response.data.map((doc) => ({
            id: doc.user.user_id,
            name: `${doc.user.first_name} ${doc.user.last_name}`,
          }));
          console.log("fetch lab technician", formattedLabTechnicians);
          setLabTechnicians(formattedLabTechnicians);
        } catch (error) {
          console.error("Failed to fetch lab technicians", error);
        }
      }
    };

    fetchLabTechnicians();
  }, [formData.specialization, token]);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/lab_technicians/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSpecializations(response.data);
      } catch (error) {
        console.error("Failed to fetch specializations", error);
      }
    };

    fetchSpecializations();
  }, [token]);

  const handleRescheduleAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      user_id: formData.user_id,
      appointment_date: formData.appointmentDate,
      start_time: formData.appointmentTime,
      appointment_type: formData.appointmentType,
      specialization: formData.specialization,
    };

    try {
      console.log("Sending this to update", appointmentData);
      const response = await axios.put(
        `http://127.0.0.1:8000/api/lab_technician_appointments/${appointmentDetails.appointment_id}/`,
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Appointment Rescheduled Successfully");
      navigate("");
    } catch (error) {
      alert("Failed to reschedule appointment");
      console.error(error);
    }
  };
  const onInputChange = handleInputChange(setFormData);
  const onSelectChange = handleSelectChange(setFormData)
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableLabTests, setAvailableLabTests] = useState([]);

  // Fetch available tests on component mount
    useEffect(() => {
      const fetchLabTests = async () => {
        try {
          const response = await getAvailableLabTests(); // Replace with your actual API endpoint
          const transformedData = response.data.map((test) => ({
            value: test.id, // This id is also sent to formData
            label: test.label + " | " + test.price + " PKR", // Set label + price for a test
          }));
          setAvailableLabTests(transformedData);
        } catch (error) {
          console.error("Error fetching lab tests:", error);
        }
      };
  
      fetchLabTests();
    }, []);
  // Fetch Available Slots On Chosen Date
  useEffect(() => {
    console.log("Updated Technician ID:", formData.labTechnicianId);
    console.log("Updated Appointment Date:", formData.appointmentDate);
    if (formData.labTechnicianId && formData.appointmentDate) {
      fetchAvailableSlots(formData.labTechnicianId, formData.appointmentDate);
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
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Reschedule Your Appointment</h2>
        </div>

        <h5 className={styles.subhead}>
          Select a new time for your appointment
        </h5>
        <hr />

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Patient Information (Read-Only) */}
          <div className={styles.formSection}>
            <h3>Patient Information</h3>
            <div className={styles.formGroup}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={
                    patient[0]?.first_name + " " + patient[0]?.last_name || ""
                  }
                  disabled
                />
              </div>
              <div>
                <label>Age</label>
                <input
                  type="text"
                  name="age"
                  value={patient[1]?.age || ""}
                  disabled
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={patient[0]?.phone || ""}
                  disabled
                />
              </div>
              <div>
                <label>Email Address</label>
                <input
                  type="text"
                  name="email"
                  value={patient[0]?.email || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Reschedule Appointment Details */}

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
            <div className={styles.infoLabel}>Required Lab Tests</div>
            <div>
              <Select
                isMulti
                options={availableLabTests}
                placeholder="Select required lab tests"
                onChange={(selected) =>
                  onSelectChange("requestedLabTests", selected)
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    borderBottom: "2px solid #1E68F8",
                    borderRadius: "none",
                    padding: "0",
                    outline: "none",

                    width: "80%",
                  }),
                  option: (base, state) => ({
                    ...base,
                    color: state.isSelected ? "white" : "black", // Change text color
                    cursor: "pointer",
                    outline: "none",
                    padding: "5px",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "80%", // Set dropdown width
                  }),
                }}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.confirmButton}
              type="submit"
              onClick={handleRescheduleAppointment}
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupRescheduleTechnicianAppointment;

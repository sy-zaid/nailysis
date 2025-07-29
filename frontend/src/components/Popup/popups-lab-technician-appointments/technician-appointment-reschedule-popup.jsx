import React, { useState, useEffect } from "react";
import styles from "../all-popups-styles.module.css";
import Select from "react-select";
import Popup from "../Popup.jsx";
import { toast } from "react-toastify";

import axios from "axios";

import {
  handleInputChange,
  handleSelectChange,
  getTodayDate,
  calculateAge,
} from "../../../utils/utils.js";
import {
  getAvailableSlots,
  rescheduleTechnicianAppointment,
} from "../../../api/appointmentsApi.js";
import { getAvailableLabTests } from "../../../api/labsApi.js";

const PopupRescheduleTechnicianAppointment = ({
  onClose,
  appointmentDetails,
}) => {
  // TOKENS & USER INFORMATION
  const token = localStorage.getItem("access");
  console.log("APDET", appointmentDetails);
  // POPUPS & NAVIGATION
  const [popupTrigger, setPopupTrigger] = useState(true);

  // IMPORTANT DATA
  const [patient, setPatient] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableLabTests, setAvailableLabTests] = useState([]);

  // APPOINTMENT FORM STATE
  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    labTechnicianId: "",
    slotId: "",
    requestedLabTests: [],
    fee: "0.00",
    patientName: appointmentDetails.patient.user.patient_name || "",
    age: appointmentDetails.patient.user.age || "",
    phone: appointmentDetails.patient.user.phone || "",
    email: appointmentDetails.patient.user.email || "",
    appointmentDate: appointmentDetails.appointmentDate || "",
    appointmentTime: appointmentDetails.appointmentTime || "",
    appointmentType: appointmentDetails.appointmentType || "",
  });

  //  HANDLERS (Event & Input Handlers)
  const onInputChange = handleInputChange(setFormData);
  const onSelectChange = handleSelectChange(setFormData);

  const handleRescheduleAppointment = async (e) => {
    e.preventDefault();

    if (!formData.specialization) {
      toast.warning("Please select specialization");
      return;
    }

    if (!formData.labTechnicianId) {
      toast.warning("Please select lab technician");
      return;
    }

    if (!formData.appointmentDate) {
      toast.warning("Please select date");
      return;
    }

    if (!formData.slotId) {
      toast.warning("Please select appointment slot");
      return;
    }

    if (
      !formData.requestedLabTests ||
      formData.requestedLabTests.length === 0
    ) {
      toast.warning("Please select required lab test");
      return;
    }

    const payload = {
      lab_technician_id: formData.labTechnicianId,
      slot_id: formData.slotId,
      requested_lab_tests: formData.requestedLabTests,
      fee: formData.fee,
    };

    try {
      console.log("Sending this to update", payload);
      // Store the API response in a variable
      const response = await rescheduleTechnicianAppointment(
        appointmentDetails.appointment_id,
        payload
      );

      // Check for success status (e.g. 200)
      if (response.status === 200) {
        toast.success("Appointment Rescheduled Successfully!", {
          className: "custom-toast",
        });
        onClose(); // Close the popup
      } else {
        toast.error("Failed to reschedule appointment", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(
          error.response.data.error || "Failed to reschedule appointment",
          { className: "custom-toast" }
        );
      } else {
        toast.error("Network Error", {
          className: "custom-toast",
        });
      }
    }
  };

  // ----- MAIN LOGIC FUNCTIONS (API Calls, Data Processing)
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

  // ----- USE-EFFECTS (Data Fetching, Side Effects)

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
          setLabTechnicians(
            response.data.map((tech) => ({
              id: tech.user.user_id,
              name: `${tech.user.first_name} ${tech.user.last_name}`,
            }))
          );
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

  // Fetch available lab tests on component mount
  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        const response = await getAvailableLabTests();
        setAvailableLabTests(
          response.data.map((test) => ({
            value: test.id,
            label: `${test.label} | ${test.price} PKR`,
          }))
        );
      } catch (error) {
        console.error("Error fetching lab tests:", error);
      }
    };
    fetchLabTests();
  }, []);

  // Fetch Available Slots On Chosen Date
  useEffect(() => {
    if (formData.labTechnicianId && formData.appointmentDate) {
      fetchAvailableSlots(formData.labTechnicianId, formData.appointmentDate);
    }
  }, [formData.labTechnicianId, formData.appointmentDate]);

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.headerSection}>
          <div className={styles.titleSection}>
            <h2>Reschedule Your Appointment</h2>
            <p>
              Select a new appointment time and adjust other relevant details as
              needed.
            </p>
          </div>
        </div>

        <hr />

        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.popupBottom}>
            {/* Patient Information (Read-Only) */}
            <div className={styles.formSection}>
              <h3>
                <i className="fa-solid fa-circle fa-2xs"></i> Patient
                Information
              </h3>
              <div className={styles.newFormGroup}>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={
                      appointmentDetails?.patient?.user?.first_name +
                        " " +
                        appointmentDetails?.patient?.user?.last_name || ""
                    }
                    disabled
                  />
                </div>
                <div>
                  <label>Age</label>
                  <input
                    type="text"
                    name="age"
                    value={
                      calculateAge(appointmentDetails.patient?.date_of_birth) ||
                      ""
                    }
                    disabled
                  />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={appointmentDetails.patient?.user?.phone || "N/A"}
                    disabled
                  />
                </div>
                <div>
                  <label>Email Address</label>
                  <input
                    type="text"
                    name="email"
                    value={appointmentDetails.patient?.user?.email || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Reschedule Appointment Details */}

            {/* Appointment Details */}
            <div className={styles.formSection}>
              <h3>
                <i className="fa-solid fa-circle fa-2xs"></i> Appointment
                Details
              </h3>

              <div className={styles.formGroup}>
                <div>
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

                <div>
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

                <div>
                  <label>Date & Time</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={onInputChange}
                    min={getTodayDate()}
                  />
                </div>

                {/* Available Slots Selection */}
                <div>
                  <label>Available Slots</label>
                  <select
                    name="slotId"
                    value={formData.slotId}
                    onChange={onInputChange}
                    disabled={availableSlots.length === 0}
                  >
                    <option value="">
                      {availableSlots.length
                        ? "Select a Slot"
                        : "Select Date First"}
                    </option>
                    {availableSlots.map((slot, index) => (
                      <option key={index} value={slot.id}>
                        {slot.start_time} - {slot.end_time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
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
                        indicatorSeparator: () => ({ display: "none" }), // Hide vertical separator
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <br />
            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button
                className={styles.addButton}
                type="submit"
                onClick={handleRescheduleAppointment}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupRescheduleTechnicianAppointment;

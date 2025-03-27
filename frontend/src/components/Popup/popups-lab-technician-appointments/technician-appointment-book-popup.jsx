import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "../all-popups-styles.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../../useCurrentUserData.jsx";
import {
  calculateAge,
  calculateTotalFee,
  handleInputChange,
  handleSelectChange,
} from "../../../utils/utils.js";
import {
  bookTechnicianAppointment,
  getAvailableLabTests,
  getAvailableSlots,
  getTechnicianFromSpecialization,
  getTechnicianSpecializations,
} from "../../../api/appointmentsApi.js";

const PopupBookTechnicianAppointment = ({ onClose }) => {
  // ----- TOKENS AND USER INFORMATION
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const { data: curUser, isLoading, isError, error } = usePatientData(); // Fetch user data

  // ----- POPUPS & NAVIGATION
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();

  // ----- IMPORTANT DATA
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const [availableLabTests, setAvailableLabTests] = useState([]);
  const [availableTestPrices, setAvailableTestPrices] = useState([]);
  const [patient, setPatient] = useState([]);

  // ----- APPOINTMENT FORM STATE
  const [formData, setFormData] = useState({
    labTechnicianId: "",
    appointmentDate: "",
    slotId: "",
    specialization: "",
    requestedLabTests: [],
    fee: "0.00",
    notes: "",
    patientFirstName: "",
    patientLastName: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
  });

  // ----- HANDLERS
  const onInputChange = handleInputChange(setFormData);
  const handleTestSelection = (selectedTests) => {
    const totalFee = calculateTotalFee(selectedTests, availableTestPrices);
    setFormData((prevData) => ({
      ...prevData,
      requestedLabTests: selectedTests,
      fee: totalFee,
    }));
  };
  // Handles sending payload to backend and booking appointment
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    // Transform requestedLabTests to an array of test IDs
    const requestedLabTestIds = formData.requestedLabTests.map(
      (test) => test.value
    );
    const payload = {
      lab_technician_id: formData.labTechnicianId,
      slot_id: formData.slotId,
      requested_lab_tests: requestedLabTestIds,
      specialization: formData.specialization,
      fee: formData.fee,
      notes: formData.notes,
      patient_first_name:
        patient?.first_name || formData.patientFirstName || "",
      patient_last_name: patient?.last_name || formData.patientLast || "",
      patient_age: patient?.age || formData.date_of_birth || "",
      patient_gender: patient?.gender || formData.gender || "",
      patient_phone: patient?.phone || formData.phone || "",
      patient_email: patient?.email || formData.email || "",
    };

    try {
      const response = await bookTechnicianAppointment(payload);
      alert("Appointment Booked Successfully");
      setAppointments([...appointments, response.data]);
      console.log("Sending this to book:", payload);
      navigate("");
    } catch (error) {
      alert("Failed to book appointment");
      console.log("Sending this to book:", payload);
      console.error(error);
    }
  };

  // ----- MAIN LOGIC FUNCTIONS
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

  // ----- USE-EFFECTS
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
        const prices = response.data.map((test) => ({
          id: test.id,
          price: test.price,
        }));
        setAvailableTestPrices(prices);
        console.log("AVTP", availableTestPrices);
      } catch (error) {
        console.error("Error fetching lab tests:", error);
      }
    };

    fetchLabTests();
  }, []);

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

  // Fetch available slots on chosen date
  useEffect(() => {
    console.log("Updated Technician ID:", formData.labTechnicianId);
    console.log("Updated Appointment Date:", formData.appointmentDate);
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
            <h2 style={{ marginLeft: "20px" }}>Schedule Your Appointment</h2> 
            <p style={{ marginLeft: "20px" }}>Choose your customized appointment timings and other details</p>
          </div>
        </div>

        <hr />

        <form onSubmit={(e) => e.preventDefault()}>

          <div className={styles.popupBottom}>
          {/* Patient Information */}
          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Patient Information</h3>
            <div className={styles.newFormGroup}>
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
              <div className={styles.phoneField}>
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
                  style={{ height: "20px" }}
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

          <hr />

          {/* Appointment Details */}
          <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Appointment Details</h3>
            
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
                  {availableSlots.length ? "Select a Slot" : "No slots available"}
                </option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot.id}>
                    {slot.slot_id} - {slot.start_time} to {slot.end_time}
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
                onChange={handleTestSelection}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    borderBottom: "2px solid #1E68F8",
                    borderRadius: "none",
                    padding: "0",
                    outline: "none",
                    width: "80%",
                    fontSize: "14px",
                  }),
                  option: (base, state) => ({
                    ...base,
                    color: state.isSelected ? "white" : "black",
                    cursor: "pointer",
                    outline: "none",
                    fontSize: "14px",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "80%",
                    fontSize: "14px",
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    transform: "scale(0.9)",
                  }),
                  indicatorSeparator: () => ({ display: "none" }), // Hide vertical separator
                }}
              />

              </div>
            

            <div className={styles.additionalNotes}>
              <label>Additional Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={onInputChange}
                placeholder={"Enter notes"}
              />
            </div>
            </div>

            <div>
              <label>Calculated Fee (PKR)</label>
              <input
                type="text"
                value={formData.fee}
                readOnly
                className={styles.feeInput}
              />
            </div>
          
          </div>
          </div>
        
        <hr />

        {/* Payment Details */}
        <div className={styles.formSection}>
            <h3><i className="fa-solid fa-circle fa-2xs"></i> Payment Details</h3>
            <div className={styles.newFormGroup}>
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
              className={styles.addButton}
              type="submit"
              onClick={handleBookAppointment}
            >
              Continue to Next Step
            </button>
          </div>

          </div>
        </form>

        </div>
    </Popup>
  );
};

export default PopupBookTechnicianAppointment;

import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./technician-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../../useCurrentUserData.jsx";
import {
  calculateAge,
  handleInputChange,
  handleSelectChange,
} from "../../../utils/utils.js";
import {
  getAvailableLabTests,
  getAvailableSlots,
  getTechnicianFromSpecialization,
  getTechnicianSpecializations,
} from "../../../api/appointmentsApi.js";

const PopupBookTechnicianAppointment = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const [availableLabTests, setAvailableLabTests] = useState([]);
  const [availableTestPrices, setAvailableTestPrices] = useState([]);
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const { data: curUser, isLoading, isError, error } = usePatientData(); // Fetch patient data
  // State for appointment details
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

  const onSelectChange = handleSelectChange(setFormData);
  const onInputChange = handleInputChange(setFormData);

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

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    const payload = {
      lab_technician_id: formData.labTechnicianId,
      slot_id: formData.slotId,
      requested_lab_tests: formData.requestedLabTests,
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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/lab_technician_appointments/book_appointment/",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  useEffect(() => {
    const total = formData.requestedLabTests?.reduce((sum, test) => {
      const testPrice =
        availableTestPrices.find((t) => t.id === test.value)?.price || 0;
      return sum + parseFloat(testPrice);
    }, 0);
    setFormData((prevData) => ({ ...prevData, fee: total.toFixed(2) }));
  }, [formData.requestedLabTests, availableTestPrices]);

  const updateFee = (selectedTests) => {
    const total = selectedTests.reduce((sum, test) => {
      const testPrice =
        availableTestPrices.find((t) => t.id === test.value)?.price || 0;
      return sum + parseFloat(testPrice);
    }, 0);

    setFormData((prevData) => ({ ...prevData, fee: total.toFixed(2) }));
  };

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
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
                  {slot.slot_id} - {slot.start_time} to {slot.end_time}
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
                onChange={(selected) => {
                  updateFee(selected);
                  onSelectChange("requestedLabTests", selected);
                }}
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

          <div>
            <label>Additional Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={onInputChange}
              placeholder={"Enter notes"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Calculated Fee (PKR)</label>
            <input
              type="text"
              value={formData.fee}
              readOnly
              className={styles.feeInput}
            />
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

export default PopupBookTechnicianAppointment;

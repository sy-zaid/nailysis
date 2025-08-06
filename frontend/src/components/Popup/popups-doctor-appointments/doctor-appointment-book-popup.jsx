import React, { useState, useEffect } from "react";
import styles from "./doctor-appointment-book-popup.module.css";
import Popup from "../Popup.jsx";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import { toast } from "react-toastify";
import {
  calculateAge,
  visitPurposes,
  getAccessToken,
  getRole,
  handleInputChange,
  getTodayDate,
} from "../../../utils/utils.js";
import {
  bookAppointment,
  getDoctorFromSpecialization,
  getDoctorSpecializations,
  getDocFeeByType,
  getAvailableSlots,
} from "../../../api/appointmentsApi.js";

const BookDoctorAppointmentPopup = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const token = getAccessToken();
  const curUserRole = getRole();
  const { data: curUser, isLoading, isError, error } = useCurrentUserData(); // Fetch user data
  const [patient, setPatient] = useState([]); // Initialize patient state
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  // State for appointment details
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    slotId: "",
    appointmentType: visitPurposes[0],
    specialization: "",
    fee: "",
    patientFirstName: "",
    patientLastName: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    if (curUserRole == "patient" && curUser && curUser.length > 0) {
      setPatient([curUser[0].patient.user, curUser[0].patient]); // Set patient data if available
      // console.log("Patient's Data: ",patient[0],patient[1]);
    } else if (curUserRole == "clinic_admin") {
      setPatient([]);
    } else {
      // console.log("No patient data available");
    }
  }, [curUser]); // Triggered whenever `curUser` changes

  const onInputChange = handleInputChange(setFormData);

  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await getDoctorSpecializations();
        setSpecializations(response.data);
      } catch (error) {
        console.error("Failed to fetch specializations", error);
        throw error;
      }
    };

    fetchSpecializations();
  }, [token]);

  // Fetch doctors based on selected specialization
  useEffect(() => {
    const fetchDoctors = async () => {
      if (formData.specialization) {
        try {
          const response = await getDoctorFromSpecialization(
            formData.specialization
          );
          const formattedDoctors = response.data.map((doc) => ({
            id: doc.user?.user_id,
            name: `${doc.user?.first_name} ${doc.user?.last_name}`,
          }));
          setDoctors(formattedDoctors);
        } catch (error) {
          console.error("Failed to fetch doctors", error);
          throw error;
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
          const response = await getDocFeeByType();
          const filteredFee = response.data.find(
            (item) => item.appointment_type === formData.appointmentType
          );
          setFormData((prev) => ({
            ...prev,
            fee: filteredFee ? filteredFee.fee : null,
          }));
        } catch (error) {
          console.error("Failed to fetch fees", error);
          throw error;
        }
      }
    };

    fetchFee();
  }, [formData.appointmentType, token]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    // Validate patient info ONLY IF editable (i.e., clinic_admin)
    if (curUserRole === "clinic_admin") {
      if (!formData.patientFirstName.trim()) {
        toast.warning("Please enter patient's first name");
        return;
      }
      if (!formData.patientLastName.trim()) {
        toast.warning("Please enter patient's last name");
        return;
      }
      if (!formData.age.trim()) {
        toast.warning("Please enter patient's age");
        return;
      }
      if (!formData.gender.trim()) {
        toast.warning("Please enter patient's gender");
        return;
      }
      if (!formData.phone.trim()) {
        toast.warning("Please enter patient's phone number");
        return;
      }
      if (!formData.email.trim()) {
        toast.warning("Please enter patient's email");
        return;
      }
    }

    if (!formData.specialization) {
      toast.warning("Please Select Doctor Specialization");
      return;
    }

    if (!formData.doctorId) {
      toast.warning("Please Select Doctor");
      return;
    }

    if (!formData.appointmentDate) {
      toast.warning("Please Select Date");
      return;
    }

    if (!formData.slotId) {
      toast.warning("Please Select Appointment Slot");
      return;
    }

    if (!formData.appointmentType) {
      toast.warning("Please Select A Visit Purpose");
      return;
    }

    const appointmentData = {
      doctor_id: formData.doctorId,
      slot_id: formData.slotId,
      appointment_type: formData.appointmentType,
      specialization: formData.specialization,
      notes: formData.notes,
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
      const response = await bookAppointment(appointmentData);
      if (response.status === 200) {
        toast.success("Appointment Booked Successfully!", {
          className: "custom-toast",
        });
        onClose(); // Close the popup
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to book appointment", {
          className: "custom-toast",
        });
      }
    }
  };
  // Fetch Available Slots On Chosen Date
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.appointmentDate]);
  const fetchAvailableSlots = async () => {
    try {
      // console.log(
      //   "SENDING THIS TO FETCH DOCID AND DATE",
      //   formData.doctorId,
      //   formData.appointmentDate
      // );
      const response = await getAvailableSlots(
        formData.doctorId,
        null,
        formData.appointmentDate
      );
      // console.log("FETCHING SLOTS", response);
      setAvailableSlots(response);
    } catch (error) {
      // console.log("Failed to fetch available slots", error);
      throw error;
    }
  };

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.headerSection}>
          <div className={styles.titleSection}>
            <h2>Schedule Your Appointment</h2>
            <p>Choose your customized appointment timings and other details</p>
          </div>
        </div>
        <hr />

        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.popupBottom}>
            {/* Patient Information */}
            <div className={styles.formSection}>
              <h3>
                <i
                  className="fa-solid fa-circle fa-2xs"
                  style={{ color: "#007bff", marginRight: "10px" }}
                ></i>{" "}
                Patient Information
              </h3>
              <div className={styles.formGroup}>
                <div>
                  <label>First Name</label>
                  <input
                    className={styles.inputField}
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
                    className={styles.inputField}
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
                    className={styles.inputField}
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={onInputChange}
                    placeholder={
                      curUserRole === "patient"
                        ? calculateAge(patient[1]?.date_of_birth) || ""
                        : "Enter Age"
                    }
                    disabled={curUserRole === "patient"}
                    style={{ outline: "none" }}
                  />
                </div>
                <div>
                  <label>Gender</label>
                  <input
                    className={styles.inputField}
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
                    className={styles.inputField}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder={
                      curUserRole === "patient"
                        ? patient[0]?.phone || "N/A"
                        : "Enter phone number"
                    }
                    disabled={curUserRole === "patient"}
                  />
                </div>
                <div>
                  <label>Email Address</label>
                  <input
                    className={styles.inputField}
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
              <h3>
                <i
                  className="fa-solid fa-circle fa-2xs"
                  style={{ color: "#007bff", marginRight: "10px" }}
                ></i>{" "}
                Appointment Details
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
                  <label>Doctor</label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={onInputChange}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading doctors...</option>
                    )}
                  </select>
                </div>

                <div>
                  <label>Date & Time</label>
                  <input
                    className={styles.inputField}
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={onInputChange}
                    min={getTodayDate()} // Prevent past date selection
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
                  <label>Visit Purpose</label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={onInputChange}
                  >
                    {visitPurposes.map((purpose, index) => (
                      <option key={index} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Fee</label>
                  <p className={styles.subHeading}>RS/- {formData.fee}</p>
                </div>
              </div>
              <div className={styles.additionalNotes}>
                <label>Additional Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={onInputChange}
                  placeholder={"Enter Any Additional Notes"}
                />
              </div>
            </div>

            <hr />

            {/* Payment Details */}
            <div className={styles.formSection}>
              <h3>
                <i
                  className="fa-solid fa-circle fa-2xs"
                  style={{ color: "#007bff", marginRight: "10px" }}
                ></i>{" "}
                Payment Details
              </h3>
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
                className={styles.addButton}
                type="submit"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default BookDoctorAppointmentPopup;

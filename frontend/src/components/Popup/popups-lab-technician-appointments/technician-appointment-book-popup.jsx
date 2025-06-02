import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "../all-popups-styles.module.css";
import Popup from "../Popup.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePatientData from "../../../useCurrentUserData.jsx";
import { toast } from "react-toastify";
import {
  calculateAge,
  calculateTotalFee,
  handleInputChange,
  handleSelectChange,
  getTodayDate,
} from "../../../utils/utils.js";
import {
  bookTechnicianAppointment,
  getAvailableSlots,
  getTechnicianFromSpecialization,
  getTechnicianSpecializations,
  getRecommendedTests,
} from "../../../api/appointmentsApi.js";
import { getAvailableLabTests } from "../../../api/labsApi.js";

const PopupBookTechnicianAppointment = ({ onClose }) => {
  // ----- TOKENS AND USER INFORMATION
  const token = localStorage.getItem("access");
  const curUserRole = localStorage.getItem("role");
  const { data: curUser, isLoading, isError, error } = usePatientData();

  // ----- POPUPS & NAVIGATION
  const [popupTrigger, setPopupTrigger] = useState(true);
  const navigate = useNavigate();

  // ----- LOADING STATES AND ERRORS
  const [loadingStates, setLoadingStates] = useState({
    labTests: true,
    recommendedTests: false,
    slots: false,
    specializations: false,
    technicians: false
  });
  const [apiErrors, setApiErrors] = useState({
    labTests: null,
    recommendedTests: null,
    specializations: null,
    technicians: null
  });

  // ----- IMPORTANT DATA
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const [recommendedTests, setRecommendedTests] = useState([]);
  const [availableLabTests, setAvailableLabTests] = useState([]);
  const [availableTestPrices, setAvailableTestPrices] = useState([]);
  const [patient, setPatient] = useState([]);
  const [includeRecommended, setIncludeRecommended] = useState(false);

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

  // Simple cache for lab tests
  const labTestsCache = {
    data: null,
    timestamp: null,
    isValid: () => labTestsCache.data && Date.now() - labTestsCache.timestamp < 300000 // 5 minute cache
  };

  // ----- API FETCHING FUNCTIONS
  const fetchLabTests = async () => {
    setLoadingStates(prev => ({...prev, labTests: true}));
    setApiErrors(prev => ({...prev, labTests: null}));

    try {
      // Return cached data if valid
      if (labTestsCache.isValid()) {
        setAvailableLabTests(labTestsCache.data);
        setAvailableTestPrices(labTestsCache.data.map(test => ({
          id: test.value,
          price: parseFloat(test.label.split("|")[1].trim().split(" ")[0])
        })));
        return;
      }

      const response = await axios.get(`${API_URL}/api/lab_tests`, {
        ...getHeaders(),
        timeout: 10000
      });

      if (!response?.data) {
        throw new Error("No data received from API");
      }

      const testsData = Array.isArray(response.data) ? response.data : [];
      const transformedData = testsData.map(test => ({
        value: test.id,
        label: `${test.label} | ${test.price} PKR`
      }));

      // Update cache
      labTestsCache.data = transformedData;
      labTestsCache.timestamp = Date.now();

      setAvailableLabTests(transformedData);
      setAvailableTestPrices(testsData.map(test => ({
        id: test.id,
        price: test.price
      })));
    } catch (error) {
      console.error("Error fetching lab tests:", error);
      setApiErrors(prev => ({...prev, labTests: error.message}));
      setAvailableLabTests([]);
      setAvailableTestPrices([]);
    } finally {
      setLoadingStates(prev => ({...prev, labTests: false}));
    }
  };

  const fetchRecommendedTests = async () => {
    setLoadingStates(prev => ({...prev, recommendedTests: true}));
    setApiErrors(prev => ({...prev, recommendedTests: null}));

    try {
      let response;
      if (curUser[0].role === "lab_admin") {
        response = await getRecommendedTests(formData.email, "lab_admin");
      } else {
        response = await getRecommendedTests(curUser?.[0]?.user_id, "patient");
      }

      const data = response?.data || [];
      setRecommendedTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching recommended tests:", error);
      setApiErrors(prev => ({...prev, recommendedTests: error.message}));
      setRecommendedTests([]);
    } finally {
      setLoadingStates(prev => ({...prev, recommendedTests: false}));
    }
  };

  const fetchSpecializations = async () => {
    setLoadingStates(prev => ({...prev, specializations: true}));
    setApiErrors(prev => ({...prev, specializations: null}));

    try {
      const response = await getTechnicianSpecializations();
      setSpecializations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch specializations", error);
      setApiErrors(prev => ({...prev, specializations: error.message}));
      setSpecializations([]);
    } finally {
      setLoadingStates(prev => ({...prev, specializations: false}));
    }
  };

  const fetchLabTechnicians = async () => {
    if (!formData.specialization) return;

    setLoadingStates(prev => ({...prev, technicians: true}));
    setApiErrors(prev => ({...prev, technicians: null}));

    try {
      const response = await getTechnicianFromSpecialization(formData.specialization);
      const formattedTechnicians = Array.isArray(response.data) 
        ? response.data.map(tech => ({
            id: tech.user.user_id,
            name: `${tech.user.first_name} ${tech.user.last_name}`
          }))
        : [];
      setLabTechnicians(formattedTechnicians);
    } catch (error) {
      console.error("Failed to fetch labTechnicians", error);
      setApiErrors(prev => ({...prev, technicians: error.message}));
      setLabTechnicians([]);
    } finally {
      setLoadingStates(prev => ({...prev, technicians: false}));
    }
  };

  const fetchAvailableSlots = async (technicianId, appointmentDate) => {
    if (!technicianId || !appointmentDate) return;

    setLoadingStates(prev => ({...prev, slots: true}));
    
    try {
      const response = await getAvailableSlots(null, technicianId, appointmentDate);
      setAvailableSlots(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch available slots", error);
      setAvailableSlots([]);
    } finally {
      setLoadingStates(prev => ({...prev, slots: false}));
    }
  };

  // ----- USE-EFFECTS
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      if (curUserRole === "patient" && curUser && curUser.length > 0) {
        setPatient([curUser[0].patient.user, curUser[0].patient]);
      } else if (curUserRole === "lab_admin") {
        setPatient([]);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [curUser, curUserRole]);

  useEffect(() => {
    fetchLabTests();
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (formData.email || (curUser?.[0]?.user_id && curUser?.[0]?.role === "patient")) {
      fetchRecommendedTests();
    }
  }, [formData.email, curUser]);

  useEffect(() => {
    fetchLabTechnicians();
  }, [formData.specialization, token]);

  useEffect(() => {
    if (formData.labTechnicianId && formData.appointmentDate) {
      fetchAvailableSlots(formData.labTechnicianId, formData.appointmentDate);
    }
  }, [formData.labTechnicianId, formData.appointmentDate]);

  // ----- HANDLERS
  const onInputChange = handleInputChange(setFormData);

  const getRecommendedTestOptions = () => {
    try {
      if (!Array.isArray(recommendedTests) || !Array.isArray(availableLabTests)) return [];
      if (recommendedTests.length === 0 || availableLabTests.length === 0) return [];

      const testMap = new Map();
      availableLabTests.forEach(test => {
        const testName = test.label.split(" | ")[0].trim().toLowerCase();
        testMap.set(testName, test);
      });

      return recommendedTests
        .map(testName => {
          const normalizedTestName = testName.toLowerCase().trim();
          return testMap.get(normalizedTestName);
        })
        .filter(Boolean)
        .filter((test, index, self) => 
          index === self.findIndex(t => t.value === test.value)
        );
    } catch (error) {
      console.error("Error in getRecommendedTestOptions:", error);
      return [];
    }
  };

  const handleTestSelection = (selectedTests) => {
    const safeSelectedTests = Array.isArray(selectedTests) ? selectedTests : [];
    const totalFee = calculateTotalFee(safeSelectedTests, availableTestPrices);
    setFormData(prev => ({
      ...prev,
      requestedLabTests: safeSelectedTests,
      fee: totalFee.toFixed(2),
    }));
  };

  const handleRecommendedCheckbox = (e) => {
    const isChecked = e.target.checked;
    setIncludeRecommended(isChecked);

    const recommendedOptions = getRecommendedTestOptions();

    if (isChecked) {
      const combinedTests = [
        ...formData.requestedLabTests,
        ...recommendedOptions.filter(
          recTest => !formData.requestedLabTests.some(
            existingTest => existingTest.value === recTest.value
          )
        ),
      ];
      handleTestSelection(combinedTests);
    } else {
      const recommendedValues = recommendedOptions.map(test => test.value);
      const filteredTests = formData.requestedLabTests.filter(
        test => !recommendedValues.includes(test.value)
      );
      handleTestSelection(filteredTests);
    }
  };

  const handleBookAppointment = async (e) => {
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
    if (!formData.requestedLabTests || formData.requestedLabTests.length === 0) {
      toast.warning("Please select required lab test");
      return;
    }

    const payload = {
      lab_technician_id: formData.labTechnicianId,
      slot_id: formData.slotId,
      requested_lab_tests: formData.requestedLabTests.map(test => test.value),
      specialization: formData.specialization,
      fee: formData.fee,
      notes: formData.notes,
      patient_first_name: patient?.[0]?.first_name || formData.patientFirstName || "",
      patient_last_name: patient?.[0]?.last_name || formData.patientLastName || "",
      patient_age: patient?.[1]?.date_of_birth ? calculateAge(patient[1].date_of_birth) : "",
      patient_gender: patient?.[1]?.gender || formData.gender || "",
      patient_phone: patient?.[0]?.phone || formData.phone || "",
      patient_email: patient?.[0]?.email || formData.email || "",
    };

    try {
      const response = await bookTechnicianAppointment(payload);
      setAppointments(prev => [...prev, response.data]);
      
      if (response.status === 200) {
        toast.success("Appointment Booked Successfully!", {
          className: "custom-toast",
        });
        onClose();
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Failed to book appointment", {
        className: "custom-toast",
      });
    }
  };

  // ----- RENDER
  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
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
                <i className="fa-solid fa-circle fa-2xs"></i> Patient Information
              </h3>
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
                        ? patient?.[0]?.first_name || ""
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
                        ? patient?.[0]?.last_name || ""
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
                      curUserRole === "patient" && patient?.[1]?.date_of_birth
                        ? calculateAge(patient[1].date_of_birth) || ""
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
                        ? patient?.[1]?.gender || ""
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
                        ? patient?.[0]?.phone || ""
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
                        ? patient?.[0]?.email || ""
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
                <i className="fa-solid fa-circle fa-2xs"></i> Appointment Details
              </h3>

              <div className={styles.formGroup}>
                <div>
                  <label>Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={onInputChange}
                    disabled={loadingStates.specializations}
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  {loadingStates.specializations && <small>Loading...</small>}
                  {apiErrors.specializations && (
                    <small className={styles.errorText}>{apiErrors.specializations}</small>
                  )}
                </div>

                <div>
                  <label>Lab Technician</label>
                  <select
                    name="labTechnicianId"
                    value={formData.labTechnicianId}
                    onChange={onInputChange}
                    disabled={loadingStates.technicians || !formData.specialization}
                  >
                    <option value="">Select Lab Technician</option>
                    {loadingStates.technicians ? (
                      <option disabled>Loading...</option>
                    ) : labTechnicians.length > 0 ? (
                      labTechnicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No technicians available</option>
                    )}
                  </select>
                  {apiErrors.technicians && (
                    <small className={styles.errorText}>{apiErrors.technicians}</small>
                  )}
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

                <div>
                  <label>Available Slots</label>
                  <select
                    name="slotId"
                    value={formData.slotId}
                    onChange={onInputChange}
                    disabled={loadingStates.slots || availableSlots.length === 0}
                  >
                    <option value="">
                      {loadingStates.slots
                        ? "Loading slots..."
                        : availableSlots.length
                        ? "Select a Slot"
                        : "No slots available"}
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
                  {recommendedTests.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={includeRecommended}
                          onChange={handleRecommendedCheckbox}
                          style={{ marginRight: "8px" }}
                        />
                        Add recommended tests by doctor
                      </label>
                    </div>
                  )}
                  <div>
                    {loadingStates.labTests ? (
                      <div>Loading available tests...</div>
                    ) : apiErrors.labTests ? (
                      <div className={styles.errorText}>
                        Failed to load tests: {apiErrors.labTests}
                        <button 
                          onClick={fetchLabTests}
                          style={{ marginLeft: "10px" }}
                        >
                          Retry
                        </button>
                      </div>
                    ) : availableLabTests.length === 0 ? (
                      <div className={styles.warningText}>
                        No lab tests currently available
                      </div>
                    ) : (
                      <Select
                        isMulti
                        options={availableLabTests}
                        getOptionLabel={(e) => e?.label || ""}
                        getOptionValue={(e) => e?.value || ""}
                        placeholder="Select required lab tests"
                        onChange={handleTestSelection}
                        value={formData.requestedLabTests}
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
                          indicatorSeparator: () => ({ display: "none" }),
                        }}
                      />
                    )}
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
              <h3>
                <i className="fa-solid fa-circle fa-2xs"></i> Payment Details
              </h3>
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
                disabled={
                  loadingStates.labTests || 
                  loadingStates.specializations ||
                  loadingStates.technicians
                }
              >
                {loadingStates.labTests ? "Loading..." : "Book Appointment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default PopupBookTechnicianAppointment;
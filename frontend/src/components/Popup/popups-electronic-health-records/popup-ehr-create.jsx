import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import styles from "../popup-appointment-book.module.css";
import Popup from "../Popup.jsx";
import { createEHR, getEHR } from "../../../api/ehrApi.js";
import { useAllPatients } from "../../../api/usersApi.js";
import { useEhrUpdatesWS } from "../../../sockets/ehrSocket.js";
import { toast } from "react-toastify";
import {
  handleSelectChange,
  handleInputChange,
  formatEhrRecords,
  preparePayload,
  immunizationRecordsOptions,
} from "../../../utils/utils.js";
import {
  medicalConditionsOptions,
  categoryOptions,
  diagnosesOptions,
  currentMedicationsOptions,
} from "../../../utils/utils.js";

const PopupEHRCreate = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [step, setStep] = useState(1); // Track the step of the form

  const handleNextStep = () => {
    if (!selectedPatient) {
      toast.warning("Please select a patient before proceeding.");
      return; // prevent navigation
    }

    if (step < 2) setStep(step + 1);
  };

  const [ehrData, setEhrData] = useState({
    patient_id: "",
    medical_conditions: [],
    current_medications: [],
    immunization_records: [],
    nail_image_analysis: "",
    test_results: "",
    diagnoses: [],
    comments: "",
    family_history: "",
    category: "General",
    visit_date: "2025-02-21",
  });
  const [isPatientConfirmed, setIsPatientConfirmed] = useState(false);
  const [records, setRecords] = useState([]);
  const { data: patientsData, isLoading, error } = useAllPatients();

  // Set up WebSocket connection when component mounts
  const socket = useEhrUpdatesWS(setRecords);

  const formattedPatients = useMemo(() => {
    return (
      patientsData?.map((patient) => ({
        value: patient.user.user_id,
        label: `${patient.user.first_name} ${patient.user.last_name}`,
        details: patient,
      })) || []
    );
  }, [patientsData]);

  // Set `patients` directly to `formattedPatients` instead of using `useEffect`
  const [patients, setPatients] = useState(formattedPatients);

  // Update state only when `formattedPatients` changes
  useEffect(() => {
    setPatients(formattedPatients);
  }, [formattedPatients]); // Only update state when `formattedPatients` changes

  const handlePatientChange = async (selected) => {
    setSelectedPatient(selected);
    setIsPatientConfirmed(false); // Reset confirmation when changing patient

    if (selected) {
      try {
        const response = await getEHR(selected.value);
        // Formatting the response data to display on table
        // console.log("EHR_CREATE_DATA", response);
        const formattedData = formatEhrRecords(response.data, "ehr_create");

        setRecords(formattedData);

        // Use setEhrData correctly to update state
        setEhrData((prev) => ({
          ...prev,
          patient_id: selected.value, // Ensure patient_id is set properly
        }));

        setIsPatientConfirmed(true);
      } catch (error) {
        console.error("Error changing patient:", error);
      }
    }
  };

  const handleCreateEHR = async () => {
    if (!ehrData.medical_conditions.length) {
      toast.warning("Please select at least one medical condition.");
      return;
    }
    if (!ehrData.current_medications.length) {
      toast.warning("Please select at least one current medication.");
      return;
    }
    if (!ehrData.diagnoses.length) {
      toast.warning("Please select at least one diagnosis.");
      return;
    }
    if (!ehrData.category) {
      toast.warning("Please select a category.");
      return;
    }
    if (!ehrData.visit_date) {
      toast.warning("Please select a visit date.");
      return;
    }

    try {
      // Prepare request payload
      const payload = preparePayload(ehrData);
      // console.log("SENDING THIS TO CREATE", payload);
      // Send API request
      const response = await createEHR(payload);

      if (response.status === 201) {
        toast.success("EHR created successfully");
        onClose();

        // Send WebSocket update with structured message
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "ehr_update",
              action: "create",
              id: response.data.id, // Backend sends this
              message: "New EHR Record Created!",
              ehr_data: response.data.ehr_data, // Backend sends full EHR data
            })
          );
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to Create New EHR", {
          className: "custom-toast",
        });
      }
    }
  };

  // Function to update value from input field into ehrData (e.g. onChange={onInputChange})
  const onInputChange = handleInputChange(setEhrData);
  // Function to update value from select field into ehrData (e.g. onChange={(selected) => onSelectChange("diagnoses", selected)})
  const onSelectChange = handleSelectChange(setEhrData);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching user data</p>;
  }
  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.formContainer}>
        <div className={styles.headerSection}>
          <div className={styles.titleSection}>
            {/* <h2 style={{ marginLeft: "20px" }}>Add New EHR Record</h2> */}

            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Show back button only on step 2 */}
              {step === 2 && (
                <i
                  className="fa-solid fa-angle-left"
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    position: "absolute",
                    left: "18px",
                    top: "24px",
                  }}
                  onClick={() => setStep(1)} // Go back to step 1 when clicked
                ></i>
              )}

              <h2 style={{ marginLeft: "20px" }}>Add New EHR Record</h2>
            </div>

            <p style={{ marginLeft: "20px" }}>
              {step === 1
                ? "Choose a patient from list to add new record"
                : "Add details for a new electronic health record"}
            </p>
          </div>
          {/* <button className={styles.closeButton} onClick={() => setPopupTrigger(false)}>
            <span>×</span>
          </button> */}
        </div>
        <hr />

        <div className={styles.popupBottom}>
          {/* Patient Selection Dropdown */}
          {step === 1 ? (
            <div className={styles.patientSelectSection}>
              <label>Select Patient</label>
              <div className={styles.dropdown}>
                <Select
                  options={patients}
                  isSearchable
                  onChange={handlePatientChange}
                  placeholder="Search & select patient"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "none",
                      borderBottom: "2px solid #1E68F8",
                      borderRadius: "none",
                      padding: "0",
                      outline: "none",
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: state.isSelected ? "white" : "black", // Change text color
                      cursor: "pointer",
                      outline: "none",
                      padding: "5px",
                    }),
                  }}
                />
              </div>
            </div>
          ) : (
            <p style={{ margin: "10px 0 30px 0", color: "#4E4E4E" }}>
              Patient # PAT001 | Mr John Doe
            </p>
          )}

          {step === 1 ? (
            <>
              {/* Patient Information Section */}
              <div className={styles.infoSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.bullet}></div>
                  <h3>Patient Information</h3>
                </div>

                <div className={styles.patientInfoGrid}>
                  <div className={styles.infoColumn}>
                    <div className={styles.infoLabel}>Patient ID</div>
                    <div className={styles.infoValue}>
                      {selectedPatient?.value || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoColumn}>
                    <div className={styles.infoLabel}>Patient Name</div>
                    <div className={styles.infoValue}>
                      {selectedPatient?.label || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoColumn}>
                    <div className={styles.infoLabel}>Age</div>
                    <div className={styles.infoValue}>
                      {selectedPatient?.details.age || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoColumn}>
                    <div className={styles.infoLabel}>Gender</div>
                    <div className={styles.infoValue}>
                      {selectedPatient?.details.gender || "N/A"}
                    </div>
                  </div>
                  <div className={styles.infoColumn}>
                    <div className={styles.infoLabel}>Phone Number</div>
                    <div className={styles.infoValue}>
                      {selectedPatient?.details.phone || "N/A"}
                    </div>
                  </div>
                </div>

                <div className={styles.emailSection}>
                  <div className={styles.infoLabel}>Email Address</div>
                  <div className={styles.infoValue}>
                    {selectedPatient?.details.email || "N/A"}
                  </div>
                </div>
              </div>

              <br />

              {/* Current Available Records Section */}
              <div className={styles.recordsSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.bullet}></div>
                  <h3>Current Available Records</h3>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.recordsTable}>
                    <thead>
                      <tr>
                        <th>Record ID</th>
                        <th>Patient Name</th>
                        <th>Consulted By</th>
                        <th>Category</th>
                        <th>Medical Conditions</th>
                        <th>Medications</th>
                        <th>Family History</th>
                        <th>Immunization</th>
                        <th>Test Reports</th>
                        <th>Nail Image Analysis</th>
                        <th>Consultation Notes</th>
                        <th>Diagnostics</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records?.map((record, index) => (
                        <tr key={record.id}>
                          <td>{index + 1}</td>

                          <td>{record.id}</td>
                          <td>{record.patient_name}</td>
                          <td>{record.consulted_by}</td>
                          <td>{record.category}</td>
                          <td>{record.medical_conditions}</td>
                          <td>{record.medications}</td>
                          <td>{record.family_history}</td>
                          <td>{record.immunization}</td>
                          <td>{record.test_reports}</td>
                          <td>{record.nail_image_analysis}</td>
                          <td>{record.notes}</td>
                          <td>{record.diagnoses}</td>
                          <td>{record.last_updated}</td>

                          {/* <td>
                        <button onClick={() => toggleActionMenu(record.id)}>⋮</button>
                        {menuOpen === record.id && (
                          <div className={styles.menu}>
                            <ul>
                              <li onClick={() => handleActionClick("Edit", record)}>
                                Edit
                              </li>
                              <li
                                onClick={() => {
                                  handleActionClick("Delete", record);
                                }}
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            isPatientConfirmed &&
            ehrData && (
              <div className={styles.infoSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.bullet}></div>
                  <h3>Enter Electronic Health Records</h3>
                </div>

                <div className={styles.ehrRecodsGrid}>
                  {/* Show details only after confirming patient */}

                  {/* Medical Conditions */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Medical Conditions</div>
                    <Select
                      isMulti
                      options={medicalConditionsOptions}
                      onChange={(selected) =>
                        onSelectChange("medical_conditions", selected)
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

                  {/* Current Medications */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Current Medications</div>
                    <Select
                      isMulti
                      options={currentMedicationsOptions}
                      placeholder="Select or add medications"
                      onChange={(selected) =>
                        onSelectChange("current_medications", selected)
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

                  {/* Immunization Records */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Immunization Records</div>
                    <Select
                      isMulti
                      options={immunizationRecordsOptions}
                      placeholder="Select or add immunization records"
                      onChange={(selected) =>
                        onSelectChange("immunization_records", selected)
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

                  {/* Diagnoses */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Diagnoses</div>
                    <Select
                      isMulti
                      options={diagnosesOptions}
                      placeholder="Select diagnoses"
                      onChange={(selected) =>
                        onSelectChange("diagnoses", selected)
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

                  {/* Category */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Category</div>
                    <Select
                      options={categoryOptions}
                      defaultValue={categoryOptions[3]}
                      onChange={(selected) =>
                        setEhrData({ ...ehrData, category: selected.value })
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

                  {/* Family History */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Family History</div>
                    <textarea
                      name="family_history"
                      placeholder="Enter relevant family medical history"
                      value={ehrData.family_history || ""}
                      onChange={onInputChange}
                      className={styles.textarea}
                    />
                  </div>

                  {/* Comments */}
                  <div className={styles.ehrRecordsColumn}>
                    <div className={styles.infoLabel}>Comments</div>
                    <textarea
                      name="comments"
                      placeholder="Add any additional comments"
                      value={ehrData.comments || ""}
                      onChange={onInputChange}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </div>
            )
          )}

          {/* Continue Button */}
          <div className={styles.actionSection}>
            {/* <button className={styles.continueButton} onClick={handleCreateEHR}>
            Continue
          </button> */}

            <button
              className={styles.cancelButton}
              style={{ marginRight: "20px" }}
              onClick={onClose}
            >
              Cancel
            </button>

            {step === 1 ? (
              <button className={styles.addButton} onClick={handleNextStep}>
                Continue
              </button>
            ) : (
              <button
                className={styles.addButton}
                onClick={() => {
                  handleCreateEHR();
                }}
              >
                Save & Add New Record
              </button>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupEHRCreate;

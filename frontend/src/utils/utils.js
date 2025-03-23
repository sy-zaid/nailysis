// You can add more functions below for reuse

/**
 * Predefined medical conditions options for react-select.
 * @constant {Array<Object>}
 */
export const medicalConditionsOptions = [
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Heart Disease", label: "Heart Disease" },
  { value: "Asthma", label: "Asthma" },
];

/**
 * Predefined category options for react-select.
 * @constant {Array<Object>}
 */
export const categoryOptions = [
  { value: "Chronic", label: "Chronic" },
  { value: "Emergency", label: "Emergency" },
  { value: "Preventive", label: "Preventive" },
  { value: "General", label: "General" },
];

/**
 * Predefined diagnosis options for react-select.
 * @constant {Array<Object>}
 */
export const diagnosesOptions = [
  { value: "Anemia", label: "Anemia" },
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Fungal Infection", label: "Fungal Infection" },
];

/**
 * Predefined current medications options for react-select.
 * @constant {Array<Object>}
 */
export const currentMedicationsOptions = [
  { value: "Metformin", label: "Metformin" },
  { value: "Aspirin", label: "Aspirin" },
  { value: "Lisinopril", label: "Lisinopril" },
  { value: "Atorvastatin", label: "Atorvastatin" },
];

/**
 * Predefined visit purposes.
 * @constant {Array<string>}
 */
export const visitPurposes = [
  "Consultation",
  "Follow-up",
  "Routine Checkup",
  "Emergency Visit",
  "Prescription Refill",
];

/**
 * Predefined test types for laboratory testing.
 * @constant {Array<Object>}
 */
export const testTypes = [
  { value: "CBC", label: "Complete Blood Count (CBC)" },
  { value: "BloodSugar", label: "Blood Sugar Test" },
  { value: "HbA1c", label: "HbA1c (Diabetes Test)" },
  {
    value: "LipidProfile",
    label: "Lipid Profile (Cholesterol Test)",
  },
  {
    value: "Thyroid",
    label: "Thyroid Function Test (T3, T4, TSH)",
  },
];

/**
 * Returns the corresponding CSS class for a given status.
 * @param {string} status - The appointment status.
 * @param {Object} styles - The styles object containing class names.
 * @returns {string} The appropriate CSS class.
 */
export const getStatusClass = (status, styles) => {
  switch (status) {
    case "Consulted":
      return styles.consulted;
    case "Cancelled":
      return styles.cancelled;
    default:
      return styles.scheduled;
  }
};

/**
 * Retrieves the access token from local storage.
 * @returns {string|null} The access token or null if not found.
 */
export const getAccessToken = () => {
  return localStorage.getItem("access");
};

/**
 * Generates headers required for API requests, including the Authorization token.
 * @returns {Object} Headers with Authorization for API requests.
 */
export const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  };
};

/**
 * Retrieves the user role from local storage.
 * @returns {string|null} The user role or null if not found.
 */
export const getRole = () => {
  return localStorage.getItem("role");
};

/**
 * Calculates age based on the provided date of birth.
 * @param {string} dob - The date of birth in YYYY-MM-DD format.
 * @returns {number} The calculated age.
 */
export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }
  return age;
};
/**
 * Handles selection changes for multi-select dropdowns.
 * @param {Function} setData - State setter function for updating data.
 * @returns {Function} Function to handle selection change.
 */
export const handleSelectChange = (setData) => (name, selectedOptions) => {
  setData((prevData) => ({
    ...prevData,
    [name]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
  }));
};

/**
 * Handles input field changes.
 * @param {Function} setData - State setter function for updating input data.
 * @returns {Function} Function to handle input change.
 */
export const handleInputChange = (setData) => (e) => {
  const { name, value } = e.target;
  setData((prev) => ({ ...prev, [name]: value }));
};

/**
 * Formats EHR (Electronic Health Record) data for UI display.
 * @param {Object|Array} response - API response containing EHR records.
 * @param {string} type - Type of EHR processing ("ehr_ws" or "ehr_create").
 * @returns {Array<Object>} Formatted EHR records.
 */
export const formatEhrRecords = (response, type) => {
  if (!response) {
    console.error("formatEhrRecords received undefined data");
    return [];
  }

  let ehrArray =
    type === "ehr_ws"
      ? Array.isArray(response)
        ? response
        : [response]
      : response;

  console.log("CONVERTING THIS:", ehrArray);

  return ehrArray.map((record) => ({
    id: record.id,
    patient_id: record.patient?.user?.user_id || "Unknown",
    patient_name: `${record.patient?.user?.first_name || "Null"} ${
      record.patient?.user?.last_name || "Null"
    }`,
    category: record.category || "N/A",
    notes: record.comments || "No comments",
    last_updated: record.last_updated
      ? new Date(record.last_updated).toLocaleDateString() +
        " | " +
        new Date(record.last_updated).toLocaleTimeString()
      : "N/A",
    consulted_by: record.consulted_by || "Unknown",
    medical_conditions: Array.isArray(record.medical_conditions)
      ? record.medical_conditions.join(", ")
      : "No records",
    medications: Array.isArray(record.current_medications)
      ? record.current_medications.join(", ")
      : "No records",
    immunization:
      Array.isArray(record.immunization_records) &&
      record.immunization_records.length > 1
        ? record.immunization_records.join(", ")
        : "No records",
    family_history: record.family_history || "No records",
    test_reports: Array.isArray(record.test_reports)
      ? record.test_reports.join(", ")
      : "No records",
    nail_image_analysis: Array.isArray(record.nail_image_analysis)
      ? record.nail_image_analysis.join(", ")
      : "No records",
    diagnoses: Array.isArray(record.diagnoses)
      ? record.diagnoses.join(", ")
      : "No records",
    added_to_medical_history: record.added_to_medical_history,
  }));
};

/**
 * Formats Medical History records for UI display.
 * @param {Object} response - API response containing medical history records.
 * @returns {Array<Object>} Formatted medical history records.
 */
export const formatMedicalHistoryRecords = (response) => {
  if (!response) {
    console.error("formatMedicalHistoryRecords received undefined data");
    return [];
  }

  return response.data.map((record) => ({
    id: record.id,
    patient_id: `${record.patient?.user?.user_id || "Null"}`,
    patient_name: `${record.patient?.user?.first_name || "Null"} ${
      record.patient?.user?.last_name || "Null"
    }`,
    family_history: record.family_history || "No Records",
    allergies: Array.isArray(record.allergies)
      ? record.allergies.join(", ")
      : "No Records",
    chronic_conditions: Array.isArray(record.chronic_conditions)
      ? record.chronic_conditions.join(", ")
      : "No Records",
    immunization_history: Array.isArray(record.immunization_history)
      ? record.immunization_history.join(", ")
      : "No Records",
    injuries: Array.isArray(record.injuries)
      ? record.injuries.join(", ")
      : "No Records",
    surgeries: Array.isArray(record.surgeries)
      ? record.surgeries.join(", ")
      : "No Records",
    date_created: record.date_created
      ? new Date(record.date_created).toLocaleDateString() +
        " | " +
        new Date(record.date_created).toLocaleTimeString()
      : "N/A",
    last_updated: record.last_updated
      ? new Date(record.last_updated).toLocaleDateString() +
        " | " +
        new Date(record.last_updated).toLocaleTimeString()
      : "N/A",
  }));
};

/**
 * Prepares EHR payload for API submission.
 * @param {Object} ehrData - EHR data to be sent to the backend.
 * @returns {Object} Processed payload where arrays are stringified.
 */
export const preparePayload = (ehrData) => {
  return Object.fromEntries(
    Object.entries(ehrData).map(([key, value]) => [
      key,
      Array.isArray(value) ? JSON.stringify(value) : value,
    ])
  );
};

/**
 * Toggles the action menu visibility for a specific record.
 * @param {string} recordId - ID of the record.
 * @param {string|null} menuOpen - Currently open menu ID.
 * @param {Function} setMenuOpen - Function to update menu state.
 */
export const toggleActionMenu = (recordId, menuOpen, setMenuOpen) => {
  setMenuOpen(menuOpen === recordId ? null : recordId);
};

/**
 * Closes the popup and resets its content.
 * @param {Function} setShowPopup - Function to control popup visibility.
 * @param {Function} setPopupContent - Function to set popup content.
 */
export const handleClosePopup = (setShowPopup, setPopupContent) => {
  setShowPopup(false);
  setPopupContent(null);
};

/**
 * Opens the popup.
 * @param {Function} setShowPopup - Function to control popup visibility.
 */
export const handleOpenPopup = (setShowPopup) => {
  setShowPopup(true);
};

/**
 * Calculates the total fee for selected lab tests based on available test prices.
 * @param {Array} selectedTests - List of selected lab tests.
 * @param {Array} availableTestPrices - List of available lab tests with their prices.
 * @returns {string} The total fee as a string with two decimal places.
 */
export const calculateTotalFee = (selectedTests, availableTestPrices) => {
  const total = selectedTests.reduce((sum, test) => {
    const testPrice =
      availableTestPrices.find((t) => t.id === test.value)?.price || 0;
    return sum + parseFloat(testPrice);
  }, 0);
  return total.toFixed(2);
};

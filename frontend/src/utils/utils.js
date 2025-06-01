// You can add more constants or functions below for reuse

export const bloodTestParameters = {
  Hemoglobin: {
    normalRange: "13.5 - 17.5",
    unit: "g/dL",
  },
  WBC: {
    normalRange: "4,500 - 11,000",
    unit: "cells/mcL",
  },
  RBC: {
    normalRange: "4.7 - 6.1",
    unit: "million cells/mcL",
  },
  Hematocrit: {
    normalRange: "38.3 - 48.6",
    unit: "%",
  },
  Platelets: {
    normalRange: "150,000 - 450,000",
    unit: "platelets/mcL",
  },
  MCV: {
    normalRange: "80 - 100",
    unit: "fL",
  },
  MCH: {
    normalRange: "27 - 33",
    unit: "pg",
  },
  MCHC: {
    normalRange: "32 - 36",
    unit: "g/dL",
  },
  RDW: {
    normalRange: "11.5 - 14.5",
    unit: "%",
  },
  Neutrophils: {
    normalRange: "40 - 60",
    unit: "%",
  },
  Lymphocytes: {
    normalRange: "20 - 40",
    unit: "%",
  },
  Monocytes: {
    normalRange: "2 - 8",
    unit: "%",
  },
  Eosinophils: {
    normalRange: "1 - 4",
    unit: "%",
  },
  Basophils: {
    normalRange: "0.5 - 1",
    unit: "%",
  },
  ESR: {
    normalRange: "0 - 20",
    unit: "mm/hr",
  },
  CRP: {
    normalRange: "< 10",
    unit: "mg/L",
  },
  Glucose: {
    normalRange: "70 - 99",
    unit: "mg/dL",
  },
  Cholesterol: {
    normalRange: "< 200",
    unit: "mg/dL",
  },
  Triglycerides: {
    normalRange: "< 150",
    unit: "mg/dL",
  },
  LDL: {
    normalRange: "< 100",
    unit: "mg/dL",
  },
  HDL: {
    normalRange: "> 40",
    unit: "mg/dL",
  },
  ALT: {
    normalRange: "7 - 56",
    unit: "U/L",
  },
  AST: {
    normalRange: "10 - 40",
    unit: "U/L",
  },
  ALP: {
    normalRange: "44 - 147",
    unit: "U/L",
  },
  Bilirubin: {
    normalRange: "0.1 - 1.2",
    unit: "mg/dL",
  },
  Urea: {
    normalRange: "7 - 20",
    unit: "mg/dL",
  },
  Creatinine: {
    normalRange: "0.6 - 1.3",
    unit: "mg/dL",
  },
};
export const urineTestParameters = {
  pH: {
    normalRange: "4.5 - 8.0",
    unit: "pH",
    isBoolean: false, // Numeric test
  },
  SpecificGravity: {
    normalRange: "1.005 - 1.030",
    unit: "",
    isBoolean: false, // Numeric test
  },
  Protein: {
    normalRange: "Negative",
    unit: "mg/dL",
    isBoolean: true, // Positive/Negative
  },
  Glucose: {
    normalRange: "Negative",
    unit: "mg/dL",
    isBoolean: true, // Positive/Negative
  },
  Ketones: {
    normalRange: "Negative",
    unit: "mg/dL",
    isBoolean: true, // Positive/Negative
  },
  Bilirubin: {
    normalRange: "Negative",
    unit: "mg/dL",
    isBoolean: true, // Positive/Negative
  },
  Urobilinogen: {
    normalRange: "0.1 - 1.0",
    unit: "mg/dL",
    isBoolean: false, // Numeric test
  },
  Blood: {
    normalRange: "Negative",
    unit: "RBCs",
    isBoolean: true, // Positive/Negative
  },
  Nitrites: {
    normalRange: "Negative",
    unit: "mg",
    isBoolean: true, // Positive/Negative
  },
  LeukocyteEsterase: {
    normalRange: "Negative",
    unit: "mg/dL",
    isBoolean: true, // Positive/Negative
  },
  UrineColor: {
    normalRange: "Light Yellow",
    unit: "",
    isBoolean: false, // Predefined string
  },
  UrineAppearance: {
    normalRange: "Clear",
    unit: "",
    isBoolean: false, // Predefined string
  },
  Microalbumin: {
    normalRange: "Less than 30",
    unit: "mg/g creatinine",
    isBoolean: false, // Numeric test
  },
  Calcium: {
    normalRange: "2.0 - 7.5",
    unit: "mg/dL",
    isBoolean: false, // Numeric test
  },
  Phosphates: {
    normalRange: "Variable",
    unit: "mg/dL",
    isBoolean: false, // Numeric test
  },
  Creatinine: {
    normalRange: "0.6 - 2.0",
    unit: "mg/dL",
    isBoolean: false, // Numeric test
  },
  Sodium: {
    normalRange: "40 - 220",
    unit: "mEq/L",
    isBoolean: false, // Numeric test
  },
  Potassium: {
    normalRange: "20 - 120",
    unit: "mEq/L",
    isBoolean: false, // Numeric test
  },
};

/**
 * Predefined medical conditions options for react-select.
 * @constant {Array<Object>}
 */
export const medicalConditionsOptions = [
  { value: "None", label: "None" },
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
  { value: "None", label: "None" },
  { value: "Metformin", label: "Metformin" },
  { value: "Aspirin", label: "Aspirin" },
  { value: "Lisinopril", label: "Lisinopril" },
  { value: "Atorvastatin", label: "Atorvastatin" },
];
/**
 * Predefined immunization records options for react-select.
 * @constant {Array<Object>}
 */
export const immunizationRecordsOptions = [
  { value: "None", label: "None" },
  { value: "BCG", label: "BCG (Tuberculosis)" },
  { value: "Hepatitis B", label: "Hepatitis B" },
  { value: "Polio", label: "Polio" },
  { value: "DTP", label: "DTP (Diphtheria, Tetanus, Pertussis)" },
  { value: "MMR", label: "MMR (Measles, Mumps, Rubella)" },
  { value: "Varicella", label: "Varicella (Chickenpox)" },
  { value: "Hepatitis A", label: "Hepatitis A" },
  { value: "Typhoid", label: "Typhoid" },
  { value: "HPV", label: "HPV (Human Papillomavirus)" },
  { value: "COVID-19", label: "COVID-19" },
  { value: "Influenza", label: "Influenza (Flu)" },
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
  { value: "None", label: "None" },
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
    // Green
    case "Consulted":
    case "Completed":
    case "Resolved":
    case "Paid":
      return styles.consulted;
    // Red
    case "Cancelled":
    case "No":
    case "Urgent":
    case "Overdue":
    case "Review Required":
      return styles.cancelled;
    // Yellow
    case "Pending":
    case "Scheduled":
      return styles.scheduled;
    // Blue
    case "Rescheduled":
    case "In Progress":
      return styles.inProgress;
    default:
      return {};
  }
};

export const getResultsClass = (value, styles) => {
  if (value === true) return styles.consulted; // Apply "Yes" color
  if (value === false) return styles.cancelled; // Apply "No" color
  return ""; // Default (no color)
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
      record.immunization_records.length >= 1
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
 * @param {Function} setMenuPosition - Function to update menu position dynamically.
 * @param {Event} event - The click event to determine menu position.
 */
export const toggleActionMenu = (
  recordId,
  menuOpen,
  setMenuOpen,
  setMenuPosition,
  event
) => {
  if (menuOpen === recordId) {
    setMenuOpen(null);
  } else {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.bottom + window.scrollY, // Adjust position based on viewport scrolling
      left: buttonRect.left + window.scrollX - 120, // Adjust position based on viewport scrolling
    });
    setMenuOpen(recordId);
  }
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

/**
 * Converts a Django datetime string into a formatted date and time string.
 * @param {string} djangoDate - The Django datetime string.
 * @returns {string} The formatted date and time string, or "Invalid Date" if input is null/undefined.
 */
export const convertDjangoDateTime = (djangoDate) => {
  if (!djangoDate) return "Invalid Date"; // Handles undefined/null values

  const dateObj = new Date(djangoDate); // Convert string to Date object

  return `${dateObj.toLocaleDateString()} | ${dateObj.toLocaleTimeString()}`;
};

export const formatBloodTestEntries = ({
  testEntries,
  bloodTestParameters,
}) => {
  return testEntries.reduce((acc, entry) => {
    acc[entry.parameter] = {
      value: parseFloat(entry.result), // Convert result to number
      unit: bloodTestParameters[entry.parameter]?.unit || "", // Handle undefined case
      range: bloodTestParameters[entry.parameter]?.normalRange || "", // Handle undefined case
    };
    return acc; //  Important: Return accumulator!
  }, {});
};

export const formatUrineTestEntries = ({
  testEntries,
  urineTestParameters,
}) => {
  const result = {};

  testEntries.forEach((entry) => {
    if (!entry?.parameter) return;

    const paramConfig = urineTestParameters[entry.parameter];
    if (!paramConfig) return;

    // For ALL parameters, keep the original string value
    // Don't convert to boolean or number - let the backend handle validation
    result[entry.parameter] = {
      value: entry.result, // Keep original string value
      unit: paramConfig.unit || "",
      range: paramConfig.normalRange || "",
      is_boolean: paramConfig.isBoolean || false,
    };
  });

  return result;
};

export const handleParameterChange = (setTestEntries, index, newParameter) => {
  setTestEntries((prevEntries) =>
    prevEntries.map((entry, i) =>
      i === index ? { ...entry, parameter: newParameter } : entry
    )
  );
};

export const handleResultChange = (setTestEntries, index, newResult) => {
  setTestEntries((prevEntries) =>
    prevEntries.map((entry, i) =>
      i === index ? { ...entry, result: newResult } : entry
    )
  );
};

export const handleAddParameter = (setTestEntries, testCategory) => {
  setTestEntries((prevEntries) => {
    let newParameter;

    // Set default parameter based on test category
    switch (testCategory) {
      case "Blood":
        newParameter = { parameter: "Hemoglobin", result: "" };
        break;
      case "Urine":
        newParameter = { parameter: "SpecificGravity", result: "" };
        break;
      case "Pathology":
        newParameter = { parameter: "WBC", type: "numeric", result: "" };
        break;
      default:
        newParameter = { parameter: "pH", result: "" }; // Fallback default
    }

    return [...prevEntries, newParameter];
  });
};

export const handleRemoveParameter = (setTestEntries, index) => {
  setTestEntries((prevEntries) =>
    prevEntries.length > 1
      ? prevEntries.filter((_, i) => i !== index)
      : prevEntries
  );
};

export const getFormattedCurrentTime = () => {
  return new Date()
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", ""); // optional: remove the comma if you want
};

export const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0!
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};


export const formatMedicalHistoryEpisodes = (responseData) => {
  // Handle case where we might get the full Axios response object
  const episodesData = Array.isArray(responseData) ? responseData : 
                     (responseData?.data || []);

  if (!Array.isArray(episodesData)) {
    console.error('Invalid data format received:', responseData);
    return { formattedEpisodes: [], uniquePatients: [] };
  }

  const formattedEpisodes = [];
  const patientsMap = new Map();

  episodesData.forEach(episode => {
    try {
      // Skip if episode is null/undefined
      if (!episode) return;

      // Extract patient information with safety checks
      const patient = episode.patient?.user || {};
      const patientId = patient.user_id || 'unknown';
      const patientName = `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient';

      // Add patient to map if valid
      if (patientId && !patientsMap.has(patientId)) {
        patientsMap.set(patientId, {
          id: patientId,
          name: patientName,
          rawData: episode.patient // Store complete patient data if needed
        });
      }

      // Format dates with fallbacks
      const startDate = episode.start_date ? new Date(episode.start_date) : new Date();
      const endDate = episode.end_date ? new Date(episode.end_date) : null;
      const lastUpdated = episode.last_updated ? new Date(episode.last_updated) : new Date();

      // Skip invalid entries
      if (!episode.episode_type || (episode.title && episode.title.toLowerCase() === 'none')) return;

      formattedEpisodes.push({
        id: episode.id,
        patient_id: patientId,
        patient_name: patientName,
        episode_type: episode.episode_type,
        title: episode.title || `Untitled ${episode.episode_type}`,
        description: episode.description || '',
        start_date: startDate.toLocaleDateString(),
        end_date: endDate?.toLocaleDateString() || null,
        is_ongoing: Boolean(episode.is_ongoing),
        added_from_ehr: episode.added_from_ehr || null,
        last_updated: lastUpdated.toLocaleString(),
        // Additional fields for UI
        isSelected: false,
        isExpanded: false
      });
    } catch (error) {
      console.error('Error processing episode:', episode, error);
    }
  });

  return {
    formattedEpisodes: formattedEpisodes.sort((a, b) => 
      new Date(b.start_date) - new Date(a.start_date)), // Sort by newest first
    uniquePatients: Array.from(patientsMap.values())
  };
};
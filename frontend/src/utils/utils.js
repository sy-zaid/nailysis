// src/utils.js
export const getAccessToken = () => {
  return localStorage.getItem("access");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

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

// You can add more functions below for reuse
export const medicalConditionsOptions = [
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Heart Disease", label: "Heart Disease" },
  { value: "Asthma", label: "Asthma" },
];

/**
 * Predefined category options for react-select.
 */
export const categoryOptions = [
  { value: "Chronic", label: "Chronic" },
  { value: "Emergency", label: "Emergency" },
  { value: "Preventive", label: "Preventive" },
  { value: "General", label: "General" },
];

/**
 * Predefined diagnosis options for react-select.
 */
export const diagnosesOptions = [
  { value: "Anemia", label: "Anemia" },
  { value: "Diabetes", label: "Diabetes" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Fungal Infection", label: "Fungal Infection" },
];

/**
 * Predefined current medications options for react-select.
 */
export const currentMedicationsOptions = [
  { value: "Metformin", label: "Metformin" },
  { value: "Aspirin", label: "Aspirin" },
  { value: "Lisinopril", label: "Lisinopril" },
  { value: "Atorvastatin", label: "Atorvastatin" },
];

export const handleSelectChange = (setData) => (name, selectedOptions) => {
  setData((prevData) => ({
    ...prevData,
    [name]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
  }));
};

export const handleInputChange = (setData) => (e) => {
  const { name, value } = e.target;
  setData((prev) => ({ ...prev, [name]: value }));
};

export const formatEhrRecords = (response) => {
  console.clear()
  console.log("FORMATTING.....",response.ehr_data)
  return response.ehr_data.map((record) => ({
    id: record.id,
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
    diagnostics: Array.isArray(record.diagnostics)
      ? record.diagnostics.join(", ")
      : "No records",
  }));
};

export const preparePayload = (ehrData) => {
  return Object.fromEntries(
    Object.entries(ehrData).map(([key, value]) => [
      key,
      Array.isArray(value) ? JSON.stringify(value) : value,
    ])
  );
};

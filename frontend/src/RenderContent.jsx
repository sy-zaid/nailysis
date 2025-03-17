import React from "react";
import SystemAdminDashboard from "./pages/admin-system/system-admin-dashboard";

// Clinic Admin Imports
import ClinicAdminDashboard from "./pages/admin-clinic/clinic-admin-dashboard";
import ElectronicHealthRecords from "./pages/common/electronic-health-records";
import PatientMedicalHistory from "./pages/common/patient-health-history";
import ViewAppointmentsClinicAdmin from "./pages/admin-clinic/view-appointments-clinic-admin";

import ViewAppointmentsPatient from "./pages/patient/view-appointments-patient";
import ViewAppointmentsDoctor from "./pages/doctor/view-appointments-doctor";
import PatientPaymentHistory from "./pages/patient/patient-payment-history";
import PatientDiagnosticResults from "./pages/patient/patient-diagnostic-results";
import PatientInvoiceManagement from "./pages/patient/patient-invoice-management";
import DoctorDashboard from "./pages/doctor/doctor-dashboard";
import PatientDashboard from "./pages/patient/patient-dashboard";
import LabAdminDashboard from "./pages/admin-lab/lab-admin-dashboard";
import LabTechnicianDashboard from "./pages/lab-technician/lab-technician-dashboard";
import LabTechnicianTestRequests from "./pages/lab-technician/lab-technician-test-requests";
import ViewAppointmentsLabTechnician from "./pages/lab-technician/view-appointments-lab-technician";
import ViewAppointmentsLabAdmin from "./pages/admin-lab/view-appointments-lab-admin"
import PlaceholderComponent from "./components/PlaceholderComponent"; // Placeholder for missing views
import BillingHistory from "./pages/admin-clinic/billing-history";
import GenerateInvoice from "./pages/admin-clinic/invoice";

// FEEDBACKS
import Feedbacks from "./pages/common/feedbacks";

// Render function for System Admin
export const renderSystemAdminContent = (view) => {
  switch (view) {
    case "Users":
      return <PlaceholderComponent name="Users" />;
    case "Analytics":
      return <PlaceholderComponent name="Analytics" />;
    case "Appointments":
      return <PlaceholderComponent name="Appointments" />;
    case "System Settings":
      return <PlaceholderComponent name="System Settings" />;
    default:
      return <SystemAdminDashboard />;
  }
};

// Render function for Clinic Admin
export const renderClinicAdminContent = (view) => {
  switch (view) {
    case "Patient Records":
      return <ElectronicHealthRecords name="Patient Records" />;
    case "Medical History & Notes":
      return <PatientMedicalHistory name="Medical History & Notes" />;
    case "Analytics":
      return <PlaceholderComponent name="Reports & Analytics" />;
    case "Diagnostic Results":
      return <PlaceholderComponent name="Diagnostic Results" />;
    case "View Appointments":
      return <ViewAppointmentsClinicAdmin />;
    case "Appointments History":
      return <PlaceholderComponent name="Appointments History" />;
    case "Generate Invoice":
      return <GenerateInvoice name="Generate Invoice" />;
    case "View Payment History":
      return <BillingHistory name="View Payment History" />;
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;
    case "Test Requests":
      return <PlaceholderComponent name="Test Requests" />;
    default:
      return <ClinicAdminDashboard />;
  }
};

// Render function for Doctor
export const renderDoctorContent = (view) => {
  switch (view) {
    case "Patient Records":
      return <ElectronicHealthRecords name="Patient Records" />;
    case "Medical History & Notes":
      return <PatientMedicalHistory name="Medical History & Notes" />;
    case "View Appointments":
      return <ViewAppointmentsDoctor name="View Appointment" />;
    case "Appointments History":
      return <PlaceholderComponent name="Appointments History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;
    case "Test Requests":
      return <PlaceholderComponent name="Test Requests" />;
    case "Appointments":
      return <PlaceholderComponent name="Appointments" />;
    default:
      return <DoctorDashboard />;
  }
};

// Render function for Patient
export const renderPatientContent = (view) => {
  switch (view) {
    case "Patient Records":
      return <ElectronicHealthRecords name="Patient Records" />;
    case "Medical History & Notes":
      return <PatientMedicalHistory name="Medical History & Notes" />;
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Samples":
      return <PlaceholderComponent name="Samples" />;
    case "Diagnostic Results":
      return <PatientDiagnosticResults />;
    case "View Appointments":
      return <ViewAppointmentsPatient />;
    case "Appointments History":
      return <PlaceholderComponent name="Appointments History" />;
    case "Generate Invoice":
      return <PatientInvoiceManagement />;
    case "View Billing History":
      return <PatientPaymentHistory />;
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;
    case "Test Requests":
      return <PlaceholderComponent name="Test Requests" />;
    case "Appointments":
      return <PlaceholderComponent name="Appointments" />;
    default:
      return <PatientDashboard />;
  }
};

// Render function for Lab Admin
export const renderLabAdminContent = (view) => {
  switch (view) {
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Diagnostic Results":
      return <PlaceholderComponent name="Diagnostic Results" />;
    case "View Appointments":
      return <ViewAppointmentsLabAdmin name="View Appointment"/>;
    case "Appointments History":
      return <PlaceholderComponent name="Appointments History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;
    case "Test Requests":
      return <PlaceholderComponent name="Test Requests" />;
    case "Appointments":
      return <PlaceholderComponent name="Appointments" />;
    default:
      return <LabAdminDashboard />;
  }
};

// Render function for Lab Technician
export const renderLabTechnicianContent = (view) => {
  switch (view) {
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Diagnostic Results":
      return <PlaceholderComponent name="Diagnostic Results" />;
    case "View Appointments":
      return <ViewAppointmentsLabTechnician />;
    case "Appointments History":
      return <PlaceholderComponent name="Appointments History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;
    case "Test Requests":
      return <LabTechnicianTestRequests />;
    case "Appointments":
      return <PlaceholderComponent name="Appointments" />;
    default:
      return <LabTechnicianDashboard />;
  }
};

import React from "react";
import SystemAdminDashboard from "./pages/admin-system/system-admin-dashboard";
import ClinicAdminDashboard from "./pages/admin-clinic/clinic-admin-dashboard";
import ViewAppointmentsClinicAdmin from "./pages/admin-clinic/view-appointments-clinic-admin";
import ViewAppointmentsPatient from "./pages/patient/view-appointments-patient"
import ViewAppointmentsDoctor from "./pages/doctor/view-appointments-doctor"
import PatientPaymentHistory from "./pages/patient/patient-payment-history";
import PatientDiagnosticResults from "./pages/patient/patient-diagnostic-results";
import PatientInvoiceManagement from "./pages/patient/patient-invoice-management";
import DoctorDashboard from "./pages/doctor/doctor-dashboard";
import PatientDashboard from "./pages/patient/patient-dashboard";
import LabAdminDashboard from "./pages/admin-lab/lab-admin-dashboard";
import LabTechnicianDashboard from "./pages/lab-technician/lab-technician-dashboard";
import PlaceholderComponent from "./components/PlaceholderComponent"; // Placeholder for missing views

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
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Analytics":
      return <PlaceholderComponent name="Reports & Analytics" />;
    case "Diagnostic Results":
      return <PlaceholderComponent name="Diagnostic Results" />;
    case "View Appointments":
      return <ViewAppointmentsClinicAdmin />;
    case "Appointment History":
      return <PlaceholderComponent name="Appointment History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <PlaceholderComponent name="Feedbacks" />;
    case "Test Requests":
      return <PlaceholderComponent name="Test Requests" />;
    default:
      return <ClinicAdminDashboard />;
  }
};

// Render function for Doctor
export const renderDoctorContent = (view) => {
  switch (view) {
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Diagnostic Results":
      return <PlaceholderComponent name="Diagnostic Results" />;
    case "View Appointments":
      return <ViewAppointmentsDoctor name="View Appointment"/>;
    case "Appointment History":
      return <PlaceholderComponent name="Appointment History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <PlaceholderComponent name="Feedbacks" />;
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
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Samples":
      return <PlaceholderComponent name="Samples" />;
    case "Diagnostic Results":
      return <PatientDiagnosticResults/>;
    case "View Appointments":
      return <ViewAppointmentsPatient/>;
    case "Appointment History":
      return <PlaceholderComponent name="Appointment History" />;
    case "Generate Invoice":
      return <PatientInvoiceManagement/>;
    case "View Billing History":
      return <PatientPaymentHistory/>;
    case "Feedbacks":
      return <PlaceholderComponent name="Feedbacks" />;
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
      return <PlaceholderComponent name="View Appointment"/>;
    case "Appointment History":
      return <PlaceholderComponent name="Appointment History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <PlaceholderComponent name="Feedbacks" />;
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
      return <PlaceholderComponent name="View Appointment"/>;
    case "Appointment History":
      return <PlaceholderComponent name="Appointment History" />;
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="Payment History" />;
    case "Feedbacks":
      return <PlaceholderComponent name="Feedbacks" />;
    case "Test Requests":
      return <PlaceholderComponent name="Test Requests" />;
    case "Appointments":
      return <PlaceholderComponent name="Appointments" />;
    default:
      return <LabTechnicianDashboard />;
  }
};

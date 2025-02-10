import React from "react";
import SystemAdminDashboard from "./pages/admin-system/system-admin-dashboard";
import ClinicAdminDashboard from "./pages/admin-clinic/clinic-admin-dashboard";
import UpcomingAppointmentsClinicAdmin from "./pages/admin-clinic/upcoming-appointment-clinic-admin";
import UpcomingAppointmentsPatient from "./pages/patient/upcoming-appointment-patient"
import UpcomingAppointmentsDoctor from "./pages/doctor/upcoming-appointment-doctor"
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
    case "Upcoming Appointments":
      return <UpcomingAppointmentsClinicAdmin />;
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
    case "Upcoming Appointments":
      return <UpcomingAppointmentsDoctor name="Upcoming Appointment"/>;
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
    case "Diagnostic Results":
      return <PatientDiagnosticResults/>;
    case "Upcoming Appointments":
      return <UpcomingAppointmentsPatient/>;
    case "Appointment History":
      return <PlaceholderComponent name="Appointment History" />;
    case "Generate Invoice":
      return <PatientInvoiceManagement/>;
    case "View Payment History":
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
    case "Upcoming Appointments":
      return <PlaceholderComponent name="Upcoming Appointment"/>;
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
    case "Upcoming Appointments":
      return <PlaceholderComponent name="Upcoming Appointment"/>;
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

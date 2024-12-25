import React from "react";
import SystemAdminDashboard from "./pages/admin-system/system-admin-dashboard";
import ClinicAdminDashboard from "./pages/admin-clinic/clinic-admin-dashboard";
import UpcomingAppointments from "./pages/admin-clinic/appointment-clinic-admin";
import DoctorDashboard from "./pages/doctor/doctor-dashboard";
import PatientDashboard from "./pages/patient/patient-dashboard";
import LabAdminDashboard from "./pages/admin-lab/lab-admin-dashboard";
import LabTechnicianDashboard from "./pages/lab-technician/lab-technician-dashboard";
import PlaceholderComponent from "./components/PlaceholderComponent"; // Placeholder for missing views

// Render function for System Admin
export const renderSystemAdminContent = (view) => {
  return <SystemAdminDashboard />;
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
      return <UpcomingAppointments />;
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
      return <PlaceholderComponent name="Upcoming Appointments" />;
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
      return <DoctorDashboard />;
  }
};

// Render function for Patient
export const renderPatientContent = (view) => {
  switch (view) {
    case "Test Results":
      return <PlaceholderComponent name="Test Results" />;
    case "Diagnostic Results":
      return <PlaceholderComponent name="Diagnostic Results" />;
    case "Upcoming Appointments":
      return <PlaceholderComponent name="Upcoming Appointments" />;
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
      return <PlaceholderComponent name="Upcoming Appointments" />;
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
      return <PlaceholderComponent name="Upcoming Appointments" />;
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
      return <LabTechnicianDashboard />;
  }
};

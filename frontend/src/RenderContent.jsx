// RenderFunctions.js
import React from "react";
import SystemAdminDashboard from "./pages/admin-system/system-admin-dashboard";
import ClinicAdminDashboard from "./pages/admin-clinic/clinic-admin-dashboard";
import AppointmentClinicAdmin from "./pages/admin-clinic/appointment-clinic-admin";
import DoctorDashboard from "./pages/doctor/doctor-dashboard";
import PatientDashboard from "./pages/patient/patient-dashboard";
import LabAdminDashboard from "./pages/admin-lab/lab-admin-dashboard";
import LabTechnicianDashboard from "./pages/lab-technician/lab-technician-dashboard";

// Render function for System Admin
export const renderSystemAdminContent = (view) => {
  return <SystemAdminDashboard />;
};

// Render function for Clinic Admin
export const renderClinicAdminContent = (view) => {
  switch (view) {
    case "Test Results":
      return <TestResults />;
    case "Diagnostic Results":
      return <DiagnosticResults />;
    case "Upcoming Appointments":
      return <UpcomingAppointments />;
    case "Appointment History":
      return <AppointmentHistory />;
    case "Generate Invoice":
      return <GenerateInvoice />;
    case "View Payment History":
      return <PaymentHistory />;
    case "Feedbacks":
      return <Feedbacks />;
    case "Test Requests":
      return <TestRequests />;
    default:
      return <ClinicAdminDashboard />;
  }
};

// Render function for Doctor
export const renderDoctorContent = (view) => {
  switch (view) {
    case "Test Results":
      return <TestResults />;
    case "Diagnostic Results":
      return <DiagnosticResults />;
    case "Upcoming Appointments":
      return <UpcomingAppointments />;
    case "Appointment History":
      return <AppointmentHistory />;
    case "Generate Invoice":
      return <GenerateInvoice />;
    case "View Payment History":
      return <PaymentHistory />;
    case "Feedbacks":
      return <Feedbacks />;
    case "Test Requests":
      return <TestRequests />;
    default:
      return <DoctorDashboard />;
  }
};

// Render function for Patient
export const renderPatientContent = (view) => {
  switch (view) {
    case "Test Results":
      return <TestResults />;
    case "Diagnostic Results":
      return <DiagnosticResults />;
    case "Upcoming Appointments":
      return <UpcomingAppointments />;
    case "Appointment History":
      return <AppointmentHistory />;
    case "Generate Invoice":
      return <GenerateInvoice />;
    case "View Payment History":
      return <PaymentHistory />;
    case "Feedbacks":
      return <Feedbacks />;
    case "Test Requests":
      return <TestRequests />;
    default:
      return <PatientDashboard />;
  }
};

// Render function for Lab Admin
export const renderLabAdminContent = (view) => {
  switch (view) {
    case "Test Results":
      return <TestResults />;
    case "Diagnostic Results":
      return <DiagnosticResults />;
    case "Upcoming Appointments":
      return <UpcomingAppointments />;
    case "Appointment History":
      return <AppointmentHistory />;
    case "Generate Invoice":
      return <GenerateInvoice />;
    case "View Payment History":
      return <PaymentHistory />;
    case "Feedbacks":
      return <Feedbacks />;
    case "Test Requests":
      return <TestRequests />;
    default:
      return <LabAdminDashboard />;
  }
};

// Render function for Lab Technician
export const renderLabTechnicianContent = (view) => {
  switch (view) {
    case "Test Results":
      return <TestResults />;
    case "Diagnostic Results":
      return <DiagnosticResults />;
    case "Upcoming Appointments":
      return <UpcomingAppointments />;
    case "Appointment History":
      return <AppointmentHistory />;
    case "Generate Invoice":
      return <GenerateInvoice />;
    case "View Payment History":
      return <PaymentHistory />;
    case "Feedbacks":
      return <Feedbacks />;
    case "Test Requests":
      return <TestRequests />;
    default:
      return <LabTechnicianDashboard />;
  }
};

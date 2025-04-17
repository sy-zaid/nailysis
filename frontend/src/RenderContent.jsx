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
import LabTestOrders from "./pages/common/lab-test-orders";

import ViewTechnicianAppointments from "./pages/common/view-lab-appointments";
import PlaceholderComponent from "./components/PlaceholderComponent"; // Placeholder for missing views
import BillingHistory from "./pages/admin-clinic/billing-history";
import GenerateInvoice from "./pages/admin-clinic/invoice";
import DocCancellationRequest from "./pages/admin-clinic/cancellation-requests-list";
import TechCancellationRequest from "./pages/admin-lab/cancellation-requests-list";
import LabAppointmentHistory from "./pages/common/lab-appointment-history";
import ClinicAppointmentHistory from "./pages/common/clinic-appointment-history";
import NailysisReport from "./pages/common/report";
import LabTestReport from "./pages/common/lab-test-result-new";

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
    case "All Patients Records":
      return <ElectronicHealthRecords name="All Patients Records" />;
    case "All Medical Histories":
      return <PatientMedicalHistory name="All Medical Histories" />;
    case "Analytics":
      return <PlaceholderComponent name="Reports & Analytics" />;
    case "View Appointments":
      return <ViewAppointmentsClinicAdmin />;
    case "Appointments History":
      return <ClinicAppointmentHistory name="Appointments History" />;
    case "Generate Invoice":
      return <GenerateInvoice name="Generate Invoice" />;
    case "View Payment History":
      return <BillingHistory name="View Payment History" />;
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;
    case "Test Results":
      return <LabTestOrders name="Test Results" />;
    case "Cancellation Requests":
      return <DocCancellationRequest name="Cancellation Requests" />;
    default:
      return <ClinicAdminDashboard />;
  }
};

// Render function for Doctor
export const renderDoctorContent = (view) => {
  switch (view) {
    // Appointments
    case "My Appointments":
      return <ViewAppointmentsDoctor name="My Appointments" />;
    case "Appointments History":
      return <ClinicAppointmentHistory name="Appointments History" />;
    case "Manage Availability":
      return <PlaceholderComponent name="Manage Availability" />;
    case "My Cancellation Requests":
      return <DocCancellationRequest name="My Cancellation Requests" />;

    // Electronic Health Records
    case "All Patients Records":
      return <ElectronicHealthRecords name="All Patients Records" />;
    case "All Medical Histories":
      return <PatientMedicalHistory name="All Medical Histories" />;

    // Feedbacks
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;

    // Billing & Invoice
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="View Payment History" />;

    // Default
    default:
      return <DoctorDashboard />;
  }
};

// Render function for Patient
export const renderPatientContent = (view) => {
  switch (view) {
    // Appointments
    case "Clinic Appointments":
      return <ViewAppointmentsPatient name="Clinic Appointments" />;
    case "Lab Appointments":
      return <ViewTechnicianAppointments name="Lab Appointments" />;
    case "Appointments History":
      return <LabAppointmentHistory name="Appointments History" />;
    case "My Clinic Cancellation Requests":
      return <DocCancellationRequest name="My Cancellation Requests" />;
    case "My Lab Cancellation Requests":
      return <TechCancellationRequest name="My Cancellation Requests" />;
    // Electronic Health Records
    case "My Records":
      return <ElectronicHealthRecords name="My Records" />;
    case "My Medical History":
      return <PatientMedicalHistory name="My Medical History" />;

    // Test Results
    case "Test Results":
      return <LabTestOrders name="Test Results" />;

    // Feedbacks
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;

    // Billing & Invoice
    case "Generate Invoice":
      return <PatientInvoiceManagement name="Generate Invoice" />;
    case "View Billing History":
      return <PatientPaymentHistory name="View Billing History" />;

    // Default fallback
    default:
      return <PatientDashboard />;
  }
};

// Render function for Lab Admin
export const renderLabAdminContent = (view) => {
  switch (view) {
    // Appointments
    case "View Appointments":
      return <ViewTechnicianAppointments name="View Appointments" />;
    case "Appointments History":
      return <LabAppointmentHistory name="Appointments History" />;
    case "Cancellation Requests":
      return <TechCancellationRequest name="Cancellation Requests" />;

    // Test Requests
    case "Test Requests":
      return <LabTestOrders name="Test Requests" />;

    // Electronic Health Records
    case "All Patients Records":
      return <ElectronicHealthRecords name="All Patients Records" />;
    case "All Medical Histories":
      return <PatientMedicalHistory name="All Medical Histories" />;

    // Feedbacks
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;

    // Billing & Invoice
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="View Payment History" />;

    // Default
    default:
      return <LabAdminDashboard />;
  }
};

// Render function for Lab Technician
export const renderLabTechnicianContent = (view) => {
  switch (view) {
    // Appointments
    case "View Appointments":
      return <ViewTechnicianAppointments name="View Appointments" />;
    case "Appointments History":
      return <LabAppointmentHistory name="Appointments History" />;
    case "Manage Availability":
      return <PlaceholderComponent name="Manage Availability" />;
    case "My Cancellation Requests":
      return <TechCancellationRequest name="My Cancellation Requests" />;

    // Test Requests
    case "Test Requests":
      return <LabTestOrders name="Test Requests" />;

    // Electronic Health Records
    case "All Patients Records":
      return <ElectronicHealthRecords name="All Patients Records" />;
    case "All Medical Histories":
      return <PatientMedicalHistory name="All Medical Histories" />;

    // Feedbacks
    case "Feedbacks":
      return <Feedbacks name="Feedbacks" />;

    // Billing & Invoice
    case "Generate Invoice":
      return <PlaceholderComponent name="Generate Invoice" />;
    case "View Payment History":
      return <PlaceholderComponent name="View Payment History" />;

    // Default
    default:
      return <LabTechnicianDashboard />;
  }
};

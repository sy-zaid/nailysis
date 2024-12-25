import "./App.css";
// import { Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SystemAdminDashboard from "./pages/admin-system/system-admin-dashboard";
import ClinicAdminDashboard from "./pages/admin-clinic/clinic-admin-dashboard";
import DoctorDashboard from "./pages/doctor/doctor-dashboard";
import PatientDashboard from "./pages/patient/patient-dashboard";
import LabAdminDashboard from "./pages/admin-lab/lab-admin-dashboard";
import LabTechnicianDashboard from "./pages/lab-technician/lab-technician-dashboard";
import AppointmentClinicAdmin from "./pages/admin-clinic/upcoming-appointment-clinic-admin";

import Sidebar from "./components/Dashboard/Sidebar/Sidebar";
import {
  renderSystemAdminContent,
  renderClinicAdminContent,
  renderDoctorContent,
  renderPatientContent,
  renderLabAdminContent,
  renderLabTechnicianContent,
} from "./RenderContent";
import AddAppointment from "./pages/AddAppointment";
import UploadImage from "./pages/UploadImage";
import ImageGuide from "./pages/ImageGuide";
import Home from "./pages/Home";

function Logout() {
  localStorage.clear();
  return <Navigate to="/Login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [view, setView] = useState("home");

  return (
    <div className="App">
      <Routes>
        {/* System Admin */}
        <Route
          path="/system-admin-dashboard"
          element={
            <ProtectedRoute requiredRole="system_admin">
              <div style={{ height: "100vh", width: "100%", margin: "0px" }}>
                <Sidebar userRole="system_admin" setView={setView} />
                <div>{renderSystemAdminContent(view)}</div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Clinic Admin */}
        <Route
          path="/clinic-admin"
          element={
            <ProtectedRoute requiredRole="clinic_admin">
              <div style={{ height: "100vh", width: "100%", margin: "0px" }}>
                <Sidebar userRole="clinic_admin" setView={setView} />
                <div>{renderClinicAdminContent(view)}</div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Doctor */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <div style={{ height: "100vh", width: "100%", margin: "0px" }}>
                <Sidebar userRole="doctor" setView={setView} />
                <div>{renderDoctorContent(view)}</div>
              </div>
            </ProtectedRoute>
          }
          
        />

        {/* Patient */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <div style={{ height: "100vh", width: "100%", margin: "0px" }}>
                <Sidebar userRole="patient" setView={setView} />
                <div>{renderPatientContent(view)}</div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Lab Admin */}
        <Route
          path="/lab-admin-dashboard"
          element={
            <ProtectedRoute requiredRole="lab_admin">
              <div style={{ height: "100vh", width: "100%", margin: "0px" }}>
                <Sidebar userRole="lab_admin" setView={setView} />
                <div>{renderLabAdminContent(view)}</div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Lab Technician */}
        <Route
          path="/lab-technician-dashboard"
          element={
            <ProtectedRoute requiredRole="lab_technician">
              <div style={{ height: "100vh", width: "100%", margin: "0px" }}>
                <Sidebar userRole="lab_technician" setView={setView} />
                <div>{renderLabTechnicianContent(view)}</div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-appointment" element={<AddAppointment />} />

        <Route path="/upload-image" element={<UploadImage />} />
        <Route path="/image-guide" element={<ImageGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

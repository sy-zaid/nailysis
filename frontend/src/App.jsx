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
import Appointment from "./pages/Appointment";

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

  const renderAdminContent = () => {
    switch (view) {
      case "home":
        return <SystemAdminDashboard />;
      case "users":
        return <div>Users Table Component</div>;
      default:
        return <SystemAdminDashboard />;
    }
  };
  return (
    <div className="App">
      <Routes>
        <Route
          path="/system-admin-dashboard"
          element={
            <ProtectedRoute requiredRole="system_admin">
              <div>{renderAdminContent()}</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinic-admin-dashboard"
          element={
            <ProtectedRoute requiredRole="clinic_admin">
              <ClinicAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-admin-dashboard"
          element={
            <ProtectedRoute requiredRole="lab_admin">
              <LabAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-technician-dashboard"
          element={
            <ProtectedRoute requiredRole="lab_technician">
              <LabTechnicianDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;

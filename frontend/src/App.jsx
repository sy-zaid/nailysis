import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import electronic_health_record from "./pages/common/electronic-health-records.jsx";
import PatientHealthHistory from "./pages/common/patient-health-history.jsx";
import { QueryClientProvider } from "@tanstack/react-query"; // Import React Query Client Provider
import { queryClient } from "./queryClient.js"; // Import the client
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
import YourPatients from "./pages/admin-clinic/your-patients-clinic-admin";
import PatientProfile from "./pages/admin-clinic/patient-profile-clinic-admin";
import DoctorProfile from "./pages/admin-clinic/doctor-profile-clinic-admin";

function Logout() {
  localStorage.clear();
  queryClient.clear(); // IMPORTANT TO CLEAR ALL CACHE ON LOGOUT
  return <Navigate to="/Login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  console.log("QueryClientProvider is wrapping App");

  const [view, setView] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="App">
        <Routes>
          {/* System Admin */}
          <Route
            path="/system-admin-dashboard"
            element={
              <ProtectedRoute requiredRole="system_admin">
                <Sidebar
                  userRole="system_admin"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  {renderSystemAdminContent(view)}
                </div>
              </ProtectedRoute>
            }
          />
          {/* Clinic Admin */}
          <Route
            path="/clinic-admin"
            element={
              <ProtectedRoute requiredRole="clinic_admin">
                <Sidebar
                  userRole="clinic_admin"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  {renderClinicAdminContent(view)}
                </div>
              </ProtectedRoute>
            }
          />

          {/*clinic-admin => Patient Profile */}
          <Route
            path="/clinic-admin/patient-profile"
            element={
              <ProtectedRoute requiredRole="clinic_admin">
                <Sidebar
                  userRole="clinic_admin"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  <PatientProfile />
                </div>
              </ProtectedRoute>
            }
          />

          {/*clinic-admin => electronic_health_record */}
          <Route
            path="/clinic-admin/electronic_health_record"
            element={
              <ProtectedRoute requiredRole="clinic_admin">
                <Sidebar
                  userRole="clinic_admin"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  <electronic_health_record />
                </div>
              </ProtectedRoute>
            }
          />

          {/*clinic-admin => Patient Health History */}
          <Route
            path="/clinic-admin/patient-history"
            element={
              <ProtectedRoute requiredRole="clinic_admin">
                <Sidebar
                  userRole="clinic_admin"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  <PatientHealthHistory />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <Sidebar
                  userRole="doctor"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  {renderDoctorContent(view)}
                </div>
              </ProtectedRoute>
            }
          />
          {/* Patient */}

          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute requiredRole="patient">
                <Sidebar
                  userRole="patient"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  {renderPatientContent(view)}
                </div>
              </ProtectedRoute>
            }
          />

          {/* Lab Admin */}
          <Route
            path="/lab-admin-dashboard"
            element={
              <ProtectedRoute requiredRole="lab_admin">
                <Sidebar
                  userRole="lab_admin"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  {renderLabAdminContent(view)}
                </div>
              </ProtectedRoute>
            }
          />
          {/* Lab Technician */}
          <Route
            path="/lab-technician-dashboard"
            element={
              <ProtectedRoute requiredRole="lab_technician">
                <Sidebar
                  userRole="lab_technician"
                  setView={setView}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`mainContent ${
                    isOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  {renderLabTechnicianContent(view)}
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
    </QueryClientProvider>
  );
}

export default App;

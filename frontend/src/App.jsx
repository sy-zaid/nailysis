import React from "react";
import "./App.css";
// import { Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function Logout() {
  localStorage.clear()
  return <Navigate to="/Login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}


function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/Login" element={<Login />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/Register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}


// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// Exporting the App component as the default export
export default App;

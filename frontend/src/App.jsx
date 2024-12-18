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
  const [view, setView] = useState("home");

  const renderAdminContent = () => {
    switch (view) {
      case "home":
        return <HomeSuperAdmin />;
      case "users":
        return <div>Users Table Component</div>;
      default:
        return <HomeSuperAdmin />;
    }
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin-dashboard"
            element={
              <ProtectedRoute requiredRole="Super Admin">
                <div
                  style={{
                    backgroundColor: "Blue",
                    display: "flex",
                    height: "100vh",
                    margin: "0px",

                  }}
                >
                  <SideMenu setView={setView} />
                  <div style={{
                    display:"flex",
                    flexDirection:"column",
                    width:"100vw"
                  }}>
                    <div><TopBar /></div>
                    <div>{renderAdminContent()}</div>
                    
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-admin-dashboard"
            element={
              <ProtectedRoute requiredRole="Team Admin">
                <TeamAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium-dashboard"
            element={
              <ProtectedRoute requiredRole="Premium User">
                <RegularUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requiredRole="Regular User">
                <RegularUser />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
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

export default App;

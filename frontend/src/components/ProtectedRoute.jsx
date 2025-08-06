import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children, requiredRole }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(checkRole(res.data.access));
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setIsAuthorized(false);
    }
  };

  const checkRole = (token) => {
    try {
      const decoded = jwtDecode(token);
      const curUserRole = decoded.role || null; // Safely handle if role is missing
      // console.log("User role:", curUserRole);

      // Check if the required role matches the user's role
      return requiredRole === curUserRole;
    } catch (error) {
      console.error("Failed to decode token or check role:", error);
      return false;
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      // console.log("No token found")
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken(); // Add the 'await' here to call the refreshToken function
    } else {
      setIsAuthorized(checkRole(token)); // Check role as part of the authorization
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

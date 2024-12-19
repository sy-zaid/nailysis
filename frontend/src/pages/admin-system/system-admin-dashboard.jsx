import React from "react";
import { useNavigate } from "react-router-dom";

function SystemAdminDashboard() {
  React.useEffect(() => {
    window.location.href = "http://127.0.0.1:8000/admin"; // Replace with your Django admin URL
  }, []);

  return null;
}

export default SystemAdminDashboard;

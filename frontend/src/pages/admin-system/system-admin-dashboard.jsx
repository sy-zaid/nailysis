import React from "react";
import { useNavigate } from "react-router-dom";

function SystemAdminDashboard() {
  React.useEffect(() => {
    window.location.href = `${import.meta.env.VItE_API_URL}/admin`; // Replace with your Django admin URL
  }, []);

  return null;
}

export default SystemAdminDashboard;

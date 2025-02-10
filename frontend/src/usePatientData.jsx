import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const getToken = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTime) {
      console.warn("Token expired, logging out...");
      localStorage.removeItem("access");
      return null;
    }

    return token; // Return the token instead of the decoded object
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("access");
    return null;
  }
};

const fetchPatientData = async () => {
  const token = getToken(); // Use validated token
  if (!token) throw new Error("No valid token found");

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/patients/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data)
    return response.data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("access");
      window.location.href = "/login"; // Redirect to login
    }
    return []; // Return an empty array to prevent undefined errors
  }
};

const usePatientData = () => {
  const token = getToken();

  return useQuery({
    queryKey: ["patientData"],
    queryFn: fetchPatientData,
    enabled: !!token, // Prevent API call if token is expired
    retry: false,
    staleTime: 0,
    cacheTime: 0,
  });
};

export default usePatientData;

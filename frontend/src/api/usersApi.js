import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getRole } from "../utils/utils";

const cacheTime = 5 * 60 * 1000; // 5 minutes cache time

// API function (does NOT use useQuery)
const getAllPatients = async () => {
  const token = getAccessToken();
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/patients/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data; // Only return data
};

// Custom Hook using useQuery
export const useAllPatients = () => {
  const curUserRole = getRole(); // Dynamically get the role

  // Only fetch and cache data if the user is not a patient
  if (curUserRole !== "patient") {
    return useQuery({
      queryKey: ["patients"],
      queryFn: getAllPatients,
      staleTime: cacheTime, // Controls when data becomes stale
      cacheTime: cacheTime, // Controls how long to keep inactive data
    });
  }

  // Return a consistent value for patients
  return { data: null, isLoading: false, error: null };
};

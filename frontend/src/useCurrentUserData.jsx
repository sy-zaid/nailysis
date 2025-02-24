import { useQuery, useQueryClient } from "@tanstack/react-query";
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

    return token;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("access");
    return null;
  }
};

const fetchCurrentUserData = async () => {
  const token = getToken();
  if (!token) throw new Error("No valid token found");

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/current_users/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    return Array.isArray(response.data) ? response.data : []; // Ensure an array is returned
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("access");
      window.location.href = "/login"; // Redirect to login
    }
    return []; // Prevent `undefined` return
  }
};

const useCurrentUserData = () => {
  const token = getToken();
  const queryClient = useQueryClient(); // Get queryClient instance

  const query = useQuery({
    queryKey: ["CurrentUserData"],
    queryFn: fetchCurrentUserData,
    enabled: !!token, // Prevent API call if token is expired
    retry: false,
    staleTime: 0,
    cacheTime: 0,
  });

  // 🔥 Invalidate ALL queries when role changes
  if (query.data?.role) {
    queryClient.invalidateQueries(); // Clears all cached queries
  }

  return query;
};

export default useCurrentUserData;

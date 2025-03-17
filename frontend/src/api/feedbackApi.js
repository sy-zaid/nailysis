import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in .env file

// Get Auth Token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

// Fetch Feedback List (Based on User Role)
export const fetchFeedbacks = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/feedback/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};

// Submit New Feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${API_URL}/api/feedback/`, feedbackData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

// Mark Feedback as Resolved
export const resolveFeedback = async (feedbackId) => {
  try {
    const response = await axios.post(`${API_URL}/api/feedback/${feedbackId}/mark_resolved/`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error resolving feedback:", error);
    throw error;
  }
};

// Delete Feedback Entry
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/feedback/${feedbackId}/delete_feedback/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};

// Submit Feedback Response by Admin
export const submitFeedbackResponse = async (feedbackId, responseText) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/feedback-response/`,
      { feedback: feedbackId, response_text: responseText },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback response:", error);
    throw error;
  }
};

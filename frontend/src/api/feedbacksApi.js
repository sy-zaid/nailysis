// import api from "./axiosInstance";
import axios from "axios";
import { getHeaders } from "../utils/utils";
const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in .env file

// Submit new Feedback
export const submitFeedback = async (feedbackData) => {
  const url = `${import.meta.env.VITE_API_URL}/api/feedbacks/submit_feedback/`; //  Ensure correct API URL
  return axios.post(url, feedbackData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    },
  });
};

export const submitFeedbackResponse = async (feedbackId, feedbackData) => {
  const url = `${import.meta.env.VITE_API_URL}/api/feedbacks/${feedbackId}/submit_response/`; //  FIX: Add `feedbackId`
  
  return axios.post(url, feedbackData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
    },
  });
};





export const getFeedbackCategories = async () => {
  const url = `${API_URL}/api/feedbacks/categories`;
  return axios.get(url, getHeaders());
};

// Fetch Feedback List (Based on User Role)
export const fetchFeedbacks = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/feedbacks/`, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};

export const getFeedbackResponses = async () => {
    const url = `${API_URL}/api/feedback_response/`
    return axios.get(url, getHeaders())
}

// Mark Feedback as Resolved
export const resolveFeedback = async (feedbackId) => {
  try {
    const response = await axios.post(`${API_URL}/api/feedback/${feedbackId}/mark_resolved/`, {}, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error resolving feedback:", error);
    throw error;
  }
};

// Delete Feedback Entry
export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/feedbacks/${feedbackId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting feedback:", error.response ? error.response.data : error.message);
    throw error;
  }
};



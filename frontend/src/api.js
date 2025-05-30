/**
 * Axios API Client Configuration
 * 
 * This module configures a custom Axios instance for making HTTP requests. 
 * It includes an interceptor to automatically add authentication tokens to the request headers.
 * 
 * Features:
 * - Base URL configuration for the API.
 * - Automatic inclusion of Bearer tokens for authentication.
 * - Centralized error handling for requests.
 */

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";
/**
 * Create an Axios instance with a predefined base URL.
 * The base URL is read from the environment variable `VITE_API_URL`.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // The base URL for all API requests.
});

/**
 * Axios Request Interceptor
 * 
 * This interceptor runs before each request is sent.
 * It:
 * 1. Retrieves the authentication token from localStorage.
 * 2. Adds the token to the request's Authorization header (if available).
 * 3. Handles any errors during the request configuration.
 */
api.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem(ACCESS_TOKEN);

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Proceed with the modified request
    },
    (error) => {
        // Return the error if request configuration fails
        return Promise.reject(error);
    }
);


export default api;

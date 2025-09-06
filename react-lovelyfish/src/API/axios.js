import axios from "axios";

// Read backend API URL from environment variable
// REACT_APP_API_BASE_URL should be set in .env or Azure frontend environment variables
const baseURL = process.env.REACT_APP_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL,             // Use environment variable
  withCredentials: true, // Include cookies in requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (centralized error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Network error";
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = JSON.stringify(error.response.data);
      }
    }
    console.error("[API Error]", message);
    return Promise.reject({ ...error, message });
  }
);

export default api;

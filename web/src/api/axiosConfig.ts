import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call the refresh token endpoint
        await api.post("/auth/refresh-token");

        // Retry the original request

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is also invalid, logout the user
        // You might want to redirect to login page here
        console.error("Error refreshing token", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

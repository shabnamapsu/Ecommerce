import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("Axios Token:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
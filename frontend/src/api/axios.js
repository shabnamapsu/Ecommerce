import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-3-nee8.onrender.com/api",
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
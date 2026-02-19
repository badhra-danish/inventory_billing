import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// let isLoggingOut = false;

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401 && !isLoggingOut) {
//       isLoggingOut = true;

//       localStorage.removeItem("token");

//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   },
// );

export default api;

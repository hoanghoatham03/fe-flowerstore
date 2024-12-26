import axios from "axios";
import { WHITE_LIST_ROUTES } from "../utils/appConstant";

export const axiosInstance = axios.create({
  baseURL: 'https://flowerstoreapi-production.up.railway.app/api',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      config.headers.set("Content-Type", "multipart/form-data");
    } else {
      config.headers.set("Content-Type", "application/json");
    }

    const token = localStorage.getItem("token");
    if (token && !WHITE_LIST_ROUTES.includes(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.set("Accept", "application/json");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API Response Error:", error.response.data);
      console.log("Status Code:", error.response.status);
    } else if (error.request) {
      console.log("API Request Error:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
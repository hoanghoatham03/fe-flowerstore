
import { axiosInstance } from "@/config/axiosConfig";
import { setToken } from "@/store/authStore";

// Login function
export async function login(email, password) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
}

// Register function
export async function register(firstName, lastName, mobileNumber, email, password) {
  const res = await axiosInstance.post("/auth/register", {
    firstName,
    lastName,
    mobileNumber,
    email,
    password,
  });
  return res.data;
}

// Logout function
export async function logout() {
  setToken("");
  return "logout success";
}

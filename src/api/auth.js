import { axiosInstance } from "../config/axiosConfig";
import { BASE_URL } from "../utils/appConstant";

export const authLogin = async (email, password) => {
  console.log("email", email);
  console.log("password", password);
  const response = await axiosInstance.post(`${BASE_URL}api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

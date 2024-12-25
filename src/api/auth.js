import { axiosInstance } from "../config/axiosConfig";
import { BASE_URL } from "../utils/appConstant";

export const authLogin = async (email, password) => {
  const response = await axiosInstance.post(`${BASE_URL}api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

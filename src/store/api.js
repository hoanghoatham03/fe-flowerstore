import { axiosInstance } from "../config/axiosConfig";
import { BASE_URL } from "../utils/appConstant";

export const authLogin = async (user) => {
  const response = await axiosInstance.post(`${BASE_URL}/auth/login`, user);
  return response.data;
};


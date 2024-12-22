import { axiosInstance } from "@/config/axiosConfig";

export const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      return res.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message); 
      throw error;
    }
  };
  

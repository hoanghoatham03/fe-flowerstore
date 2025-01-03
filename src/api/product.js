import { axiosInstance } from "@/config/axiosConfig";

export const getProducts = async (pageNo, pageSize) => {
    const res = await axiosInstance.get(`/products?pageNo=${pageNo}&pageSize=${pageSize}`);
    return res.data;
};

export const getProductByCategoryId = async (categoryId, pageNo, pageSize) => {
    const res = await axiosInstance.get(`/products/categories/${categoryId}?pageNo=${pageNo}&pageSize=${pageSize}`);
    return res.data;
};

export const getProductById = async (productId) => {
    const res = await axiosInstance.get(`/products/${productId}`);
    return res.data;
};

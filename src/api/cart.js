import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";

export const getCart = async (userId) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.get(`/users/${userId}/carts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const addToCart = async (userId, productId, quantity) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.post(`/users/${userId}/carts`, {
        productId,
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const updateCartItem = async (userId, productId, quantity) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.put(`/users/${userId}/carts`, {
        productId,
        quantity
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

export const removeFromCart = async (userId, productId) => {
    const token = await getToken();
    if (!token) {
        throw new Error("User not authenticated");
    }
    const res = await axiosInstance.delete(`/users/${userId}/carts/product/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

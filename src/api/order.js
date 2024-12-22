import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";

export async function createOrder(userId, addressId, paymentId) {
    const token = await getToken();
    const res = await axiosInstance.post(`/users/orders`, {
        userId,
        addressId,
        paymentId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export async function getOrder(userId) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function getOrderDetails(userId, orderId) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function deleteOrder(userId, orderId) {
    const token = await getToken();
    const res = await axiosInstance.delete(`/orders/${orderId}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

import { axiosInstance } from "@/config/axiosConfig";

export async function createOrderWithPaymentIsCash(userId, addressId, paymentId, token) {
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

export async function createOrderWithPaymentIsBank(userId, addressId, paymentId, token) {
    const res = await axiosInstance.post(`/users/orders/bank`, {
        userId,
        addressId,
        paymentId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function getOrder(userId, token) {
    const res = await axiosInstance.get(`/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function getOrderDetails(userId, orderId, token) {
    const res = await axiosInstance.get(`/users/${userId}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

export async function deleteOrder(userId, orderId, token) {
    const res = await axiosInstance.delete(`/orders/${orderId}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

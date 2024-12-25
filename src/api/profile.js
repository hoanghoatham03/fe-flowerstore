import { axiosInstance } from "@/config/axiosConfig";

export async function getProfile(userId, token) {
    const res = await axiosInstance.get(`/users/${userId}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}
export async function updateProfile(userId, formData, token) {
    const res = await axiosInstance.put(`/users/${userId}/profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
        }
    });
    return res.data;
}

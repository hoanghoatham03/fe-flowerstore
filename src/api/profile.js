import { axiosInstance } from "@/config/axiosConfig";
import { getToken } from "@/store/authStore";

export async function getProfile(userId) {
    const token = await getToken();
    const res = await axiosInstance.get(`/users/${userId}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export async function updateProfile(userId, formData) {
    const token = await getToken();
    const res = await axiosInstance.put(`/users/${userId}/profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
        }
    });
    return res.data;
}

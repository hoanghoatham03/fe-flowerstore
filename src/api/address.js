import { axiosInstance } from "../config/axiosConfig";

//get all address of user
export async function getAllAddress(userId,token){
    const response = await axiosInstance.get(`/users/${userId}/addresses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
//get address by id
export async function getAddress(userId,addressId,token){
    const response = await axiosInstance.get(`/users/${userId}/addresses/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
export async function createAddress(userId,address,token){
    const response = await axiosInstance.post(`/users/${userId}/addresses`, address, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
export async function updateAddress(userId,addressId,address,token){
    const response = await axiosInstance.put(`/users/${userId}/addresses/${addressId}`, address, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
export async function deleteAddress(userId, addressId,token) {
    const response = await axiosInstance.delete(`/users/${userId}/addresses/${addressId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(response);
    return response.data;
}
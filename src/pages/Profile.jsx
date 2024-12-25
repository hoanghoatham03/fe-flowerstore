import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "@/api/profile";
import { getAllAddress, createAddress, updateAddress ,deleteAddress } from "../api/address"; 
import { updateProfile } from "@/api/profile"; 
import Modal from "../components/modal";
import Spinner from "../components/Spinner";
import { CameraIcon } from "@heroicons/react/24/outline";
const ProfilePage = () => {
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false); 
  const [addressFormData, setAddressFormData] = useState({
    street: '',
    district: '',
    city: ''
  });
  const [selectedAddress, setSelectedAddress] = useState(null); 

  useEffect(() => {
    if (user && token) {
      const fetchProfile = async () => {
        try {
          const fetchedProfile = await getProfile(user.userId, token);
          setProfile(fetchedProfile.data);
          setFormData({
            firstName: fetchedProfile.data.firstName,
            lastName: fetchedProfile.data.lastName,
            email: fetchedProfile.data.email,
            mobileNumber: fetchedProfile.data.mobileNumber,
          });
        } catch (err) {
          setProfileError("Không thể tải thông tin profile");
        }
      };
      const fetchAddresses = async () => {
        try {
          const fetchedAddresses = await getAllAddress(user.userId, token);
          setAddresses(fetchedAddresses.data);
        } catch (err) {
          setProfileError("Không thể tải thông tin địa chỉ");
        }
      };
      fetchProfile();
      fetchAddresses();
    }
  }, [user, token]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      updateProfile(user.userId, formData, token)
        .then(() => {
          const fetchProfile = async () => {
            try {
              const fetchedProfile = await getProfile(user.userId, token);
              setProfile(fetchedProfile.data);
            } catch (err) {
              setProfileError("Không thể tải thông tin profile");
            }
          };
          fetchProfile();
        })
        .catch((err) => {
          setProfileError("Không thể cập nhật ảnh đại diện");
        });
    }
  };
  const handleRemoveClick = (addresses) => {
    setSelectedAddress(addresses);
    setIsModalOpen(true);
  };
  const handleConfirmRemove = async () => {
    try {
      if (!selectedAddress) return;
        
      await deleteAddress(user.userId, selectedAddress.addressId, token); 
      setAddresses((prev) =>
        prev.filter((address) => address.addressId !== selectedAddress.addressId)
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };
  

  const handleCancelRemove = () => {
    setSelectedAddress(null);
    setIsModalOpen(false); 
  };
  const handleEditProfile = () => {
    setIsEditing(true); 
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const newFormData = new FormData();
    newFormData.append("firstName", formData.firstName);
    newFormData.append("lastName", formData.lastName);
    newFormData.append("email", formData.email);
    newFormData.append("mobileNumber", formData.mobileNumber);

    try {
      await updateProfile(user.userId, newFormData, token);
      window.location.reload();
    } catch (err) {
      setProfileError("Không thể cập nhật thông tin");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); 
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      mobileNumber: profile.mobileNumber,
    }); 
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    console.log(address);
    setAddressFormData({
      street: address.street,
      district: address.district,
      city: address.city
    });
    setIsEditingAddress(true);
  };

  const handleCreateAddress = () => {
    setIsEditingAddress(true); 
    setAddressFormData({
      street: '',
      district: '',
      city: ''
    });
    setSelectedAddress(null);
  };
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (selectedAddress) {
        await updateAddress(user.userId,selectedAddress.addressId, addressFormData, token);
      } else {
        await createAddress(user.userId, addressFormData, token);
      }
      const fetchedAddresses = await getAllAddress(user.userId, token);
      setAddresses(fetchedAddresses.data);
      setIsEditingAddress(false);
    } catch (err) {
      setProfileError("Không thể tạo hoặc cập nhật địa chỉ");
    }
  };

  const handleCancelAddressEdit = () => {
    setIsEditingAddress(false);
    setAddressFormData({
      street: '',
      district: '',
      city: ''
    });
    setSelectedAddress(null);
  };

  if (loading === "loading") {
    return <Spinner />;
  }

  if (profileError || error) {
    return <p>Error: {profileError || error}</p>;
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-sans p-5">Thông tin cá nhân</h1>
      {profile ? (
        <div className="min-h-screen flex justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl p-8 w-full h-fit transition-all duration-300 animate-fade-in">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 text-center mb-8 md:mb-0">
                <img
                  src={profile.avatar}
                  alt="Profile Picture"
                  className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 dark:border-blue-900 transition-transform duration-300 hover:scale-105"
                  onClick={() => document.getElementById('file-input').click()}
                />
                <input
                  id="file-input"
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <h1 className="text-2xl font-bold text-indigo-800 dark:text-white mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Moon Flower</p>
                <button
                  onClick={handleEditProfile}
                  className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                >
                  Chỉnh sửa thông tin
                </button>
              </div>

              <div className="md:w-2/3 md:pl-8">
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit}>
                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
                      Chỉnh sửa thông tin tài khoản
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-700 dark:text-gray-300">Tên</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 dark:text-gray-300">Họ</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 dark:text-gray-300">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 dark:text-gray-300">Số điện thoại</label>
                        <input
                          type="text"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        type="submit"
                        className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
                      Thông tin tài khoản
                    </h2>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {profile.email}
                      </li>
                      <li className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {profile.mobileNumber}
                      </li>
                    </ul>
                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Địa chỉ</h2>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        {addresses && addresses.length > 0 ? (
                            addresses.map((address, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a8 8 0 00-8 8c0 4.418 8 10 8 10s8-5.582 8-10a8 8 0 00-8-8zm0 12a4 4 0 110-8 4 4 0 010 8z" />
                                </svg>
                                {address.street}, {address.district}, {address.city}
                                </div>
                                <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditAddress(address)}
                                    className="text-indigo-800 hover:text-blue-900"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleRemoveClick(address)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Xóa
                                </button>
                                </div>
                            </li>
                            ))
                        ) : (
                            <li className="text-gray-500">Chưa có địa chỉ nào được thêm</li>
                        )}
                        </ul>

                    {addresses && (
                      <button
                        onClick={handleCreateAddress}
                        className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                      >
                        Thêm địa chỉ
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      {isModalOpen && (
        <Modal
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          message="Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
        />
      )}
      {isEditingAddress && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-black z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-1/2 max-w-xl transition-all duration-300">
            <form onSubmit={handleAddressSubmit}>
              <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">
                {selectedAddress ? "Chỉnh sửa địa chỉ" : "Tạo địa chỉ"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 dark:text-gray-300">Street</label>
                  <input
                    type="text"
                    value={addressFormData.street}
                    onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                    className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-gray-300">District</label>
                  <input
                    type="text"
                    value={addressFormData.district}
                    onChange={(e) => setAddressFormData({ ...addressFormData, district: e.target.value })}
                    className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-gray-700 dark:text-gray-300">City</label>
                  <input
                    type="text"
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="w-full p-4 mt-2 border-2 rounded-lg dark:text-gray-200 dark:bg-gray-800"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={handleCancelAddressEdit}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

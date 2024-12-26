import React, { useState } from 'react';
import MapDirections from './MapDirections';

const LocationModal = ({ onClose }) => {
  const [showMap, setShowMap] = useState(false);
  const [locationType, setLocationType] = useState(null);

  if (!showMap) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Chọn điểm bắt đầu</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => {
                setLocationType('current');
                setShowMap(true);
              }}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Vị trí hiện tại của tôi
            </button>
            <button
              onClick={() => {
                setLocationType('search');
                setShowMap(true);
              }}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Tìm kiếm địa điểm khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[80%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tìm đường đến cửa hàng</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <MapDirections locationType={locationType} />
      </div>
    </div>
  );
};

export default LocationModal; 
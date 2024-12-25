import React from "react";

const Modal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Xác nhận xóa 
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base text-white sm:text-sm hover:bg-green-700"
                onClick={onConfirm}
              >
                Đồng ý 
              </button>
            </span>
            <span className="mt-3 sm:mt-0 sm:w-auto">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base text-gray-700 sm:text-sm hover:bg-gray-300"
                onClick={onCancel}
              >
                Hủy
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

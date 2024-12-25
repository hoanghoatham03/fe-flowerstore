import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrderDetails } from '../api/order';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await getOrderDetails(user.userId, orderId, token);
        console.log("response order detail:",response.data);
        setOrder(response.data);
      } catch (error) {
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, user.userId, token]);

  if (loading) {
    window.scrollTo(0, 0);
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy thông tin đơn hàng</p>
        <Link to="/orders" className="text-blue-500 hover:underline mt-2 inline-block">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.orderId}</h1>
          <Link to="/orders" className="text-blue-500 hover:underline">
            Quay lại
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Thông tin đơn hàng</h2>
              <p>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Trạng thái đơn hàng: <span className="font-medium">{order.orderStatus}</span></p>
              <p>Trạng thái thanh toán: <span className="font-medium">{order.paymentStatus}</span></p>
              <p>Phương thức thanh toán: {order.payment.paymentId === 1 ? 'Tiền mặt' : 'Chuyển khoản'}</p>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
              <p>{order.address.street}</p>
              <p>{order.address.district}</p>
              <p>{order.address.city}</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.orderItemId} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.product.images[0]?.imageUrl}
                    alt={item.product.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.productName}</h3>
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                    <p className="text-gray-900">{item.product.realPrice * item.quantity} VND</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tổng tiền:</span>
              <span className="font-semibold text-xl">{order.totalAmount} VND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrder, deleteOrder } from '../api/order';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import Modal from '../components/modal';
import { ClipLoader } from "react-spinners";
const OrderHistory = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isHandling, setIsHandling] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [user.userId, token]);

  const loadOrders = async () => {
    try {
      const response = await getOrder(user.userId, token);
      console.log("response order history:",response.data);
      setOrders(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    setShowModal(false);
    setIsHandling(true);
    try {
      await deleteOrder(user.userId, orderToDelete, token);
      setOrders(orders.filter(order => order.orderId !== orderToDelete));
      
      toast.success('Đã hủy đơn hàng thành công');
    } catch (error) {
      toast.error('Không thể hủy đơn hàng');
    } finally {
      setOrderToDelete(null);
      setIsHandling(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.reverse().map((order) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Đơn hàng #{order.orderId}</h2>
                  <p className="text-gray-600">Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <span className={getStatusBadgeClass(order.orderStatus)}>
                  {order.orderStatus}
                </span>
              </div>
              
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.orderItemId} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]?.imageUrl}
                      alt={item.product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.productName}</h3>
                      <p className="text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-gray-900">{item.product.realPrice * item.quantity.toLocaleString()} VND</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="font-semibold">Tổng tiền: {order.totalAmount.toLocaleString()} VND</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán: {order.payment.paymentId === 1 ? 'Tiền mặt' : 'Chuyển khoản'}
                  </p>
                </div>
                <div className="space-x-4">
                  <Link
                    to={`/orders/${order.orderId}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Xem chi tiết
                  </Link>
                  {order.orderStatus === 'PENDING' && (
                    <button
                      onClick={() => {
                        setOrderToDelete(order.orderId);
                        setShowModal(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                        {isHandling ? <ClipLoader color="red" size={15} /> : 'Hủy đơn'} 
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          onConfirm={handleDeleteOrder}
          onCancel={() => {
            setShowModal(false);
            setOrderToDelete(null);
          }}
          message="Bạn có chắc muốn hủy đơn hàng này?"
        />
      )}
    </div>
  );
};

export default OrderHistory; 
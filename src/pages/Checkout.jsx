import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrderWithPaymentIsCash, createOrderWithPaymentIsBank } from '../api/order';
import { getAllAddress } from '../api/address';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const PAYMENT_METHODS = {
  CASH: 1,
  BANK: 2
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true);
      try {
        const response = await getAllAddress(user.userId, token);
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0].id);
        }
      } catch (error) {
        toast.error('Không thể tải địa chỉ giao hàng');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      loadAddresses();
    }
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        items: cart.cartItems.map(item => ({
          productId: item.product.productId,
          quantity: item.quantity
        }))
      };

      if (paymentMethod === PAYMENT_METHODS.CASH) {
        await createOrderWithPaymentIsCash(user.userId, selectedAddress,1, token);
        toast.success('Đặt hàng thành công');
        navigate('/order-success');
      } else {
        const response = await createOrderWithPaymentIsBank(user.userId, selectedAddress,2, token);
        navigate(`/payment/${response.data.orderId}`);
      }
    } catch (error) {
      toast.error('Đặt hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return cart?.cartItems?.reduce(
      (total, item) => total + item.product.realPrice * item.quantity,
      0
    ) || 0;
  };

  const shippingFee = 10000; // 10,000 VND
  const discount = 10000; // 10,000 VND
  const calculateTotal = () => calculateSubtotal() + shippingFee - discount;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h2>
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Chọn địa chỉ giao hàng</option>
                {addresses.map((address) => (
                  <option key={address.addressId} value={address.addressId}>
                    {address.street}, {address.district}, {address.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    value={PAYMENT_METHODS.CASH}
                    checked={paymentMethod === PAYMENT_METHODS.CASH}
                    onChange={(e) => setPaymentMethod(Number(e.target.value))}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Thanh toán khi nhận hàng</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    value={PAYMENT_METHODS.BANK}
                    checked={paymentMethod === PAYMENT_METHODS.BANK}
                    onChange={(e) => setPaymentMethod(Number(e.target.value))}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-500">Chuyển khoản qua tài khoản ngân hàng</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Spinner size="small" />
                  <span className="ml-2">Đang xử lý...</span>
                </div>
              ) : (
                'Đặt hàng'
              )}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-4">
              {cart?.cartItems?.map((item) => (
                <div key={item.cartItemId} className="flex items-center space-x-4 py-4 border-b">
                  <img
                    src={item.product.images[0]?.imageUrl}
                    alt={item.product.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.productName}</h3>
                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                    <p className="text-gray-900 font-medium">
                      {item.product.realPrice * item.quantity} VND
                    </p>
                  </div>
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{calculateSubtotal()} VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>{shippingFee} VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giảm giá</span>
                  <span>- {discount} VND</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                  <span>Tổng cộng</span>
                  <span>{calculateTotal()} VND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
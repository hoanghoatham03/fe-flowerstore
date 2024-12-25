import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrderDetails } from '../api/order';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [status, setStatus] = useState(PAYMENT_STATUS.PENDING);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);


  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await getOrderDetails(user.userId, orderId, token);
        console.log("response payment page:",response.data);
        setOrderDetails(response.data);
      } catch (error) {
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, user.userId, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          if (status === PAYMENT_STATUS.PENDING) {
            setStatus(PAYMENT_STATUS.FAILURE);
            toast.error('Hết thời gian thanh toán');
            setTimeout(() => navigate('/checkout'), 2000);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await getOrderDetails(user.userId, orderId, token);
        if (response.data.paymentStatus === PAYMENT_STATUS.SUCCESS) {
          setStatus(PAYMENT_STATUS.SUCCESS);
          toast.success('Thanh toán thành công');
          setTimeout(() => navigate('/order-success'), 2000);
        } else if (response.data.paymentStatus === PAYMENT_STATUS.FAILURE) {
          setStatus(PAYMENT_STATUS.FAILURE);
          toast.error('Thanh toán thất bại');
          setTimeout(() => navigate('/checkout'), 2000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    if (status === PAYMENT_STATUS.PENDING) {
      const interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [status, orderId, user.userId, token, navigate]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <Spinner />
        </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className=" bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Quét mã QR để thanh toán
        </h1>
        <div className="flex items-center justify-center border border-gray-300 rounded-lg p-4">
        <div className='flex flex-col items-center justify-center w-1/2'>
            <div className="flex justify-center mb-6">
            <img src={orderDetails?.qrCode} alt="QR Code" className="w-full h-auto" />
            </div>
            
        </div>
        <div className=" text-gray-600 w-1/2">
        <div className="text-center mb-4">
            
            </div>

            <div className="text-left">
                <p className="text-lg font-bold">Chủ tài khoản: Nguyễn Thế Hưng</p>
                <p className="text-lg font-bold">Số tài khoản: 109883503505777</p>
                <p className="text-lg font-bold">Ngân hàng: Vietinbank</p>
                <p className="text-lg font-bold">Số tiền: {orderDetails?.totalAmount} VND</p>
                <p className="text-lg font-bold">Nội dung: SEVQRthanhtoanmadon{orderId}</p>
            </div>

            <p className="text-red-500 bg-yellow-100 rounded-lg p-2 text-center mt-4 font-bold">Đơn hàng sẽ hết hạn trong: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          <p className="mt-2">Vui lòng không thoát trang này cho đến khi thanh toán hoàn tất</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 
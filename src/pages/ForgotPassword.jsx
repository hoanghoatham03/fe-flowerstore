import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authForgotPassword } from '@/api/auth';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authForgotPassword(email);
      toast.success('Mã OTP đã được gửi đến email của bạn');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Email không tồn tại trong hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-[#FDEDEC] min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Quên mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9C3F46] text-white py-2 px-4 rounded-md hover:bg-[#9C7376] transition-colors duration-300 disabled:bg-[#9C8486]"
          >
            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-300"
          >
            Quay lại đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 
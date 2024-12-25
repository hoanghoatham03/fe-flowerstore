import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemQuantity, fetchCart, removeCartItem } from "../store/reducers/cartReducer";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/cartItem";
import Modal from "../components/modal";
import debounce from "lodash/debounce";
import Spinner from "../components/Spinner";
const CartPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);
  const [updatedItems, setUpdatedItems] = useState(cart?.cartItems || []);
  const [promoCode, setPromoCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const navigate = useNavigate();
  const promoCodeList = ['Flower10'];
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ userId: user.userId, token }));
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    setUpdatedItems(cart?.cartItems || []);
  }, [cart]);

  const debounceFnRef = React.useRef(
    debounce((item, newQuantity) => {
      dispatch(
        updateCartItemQuantity({
          userId: user.userId,
          productId: item.product.productId,
          quantity: newQuantity,
          token,
        })
      )
        .unwrap()
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }, 1000) 
  );

  const handleApplyPromoCode = (code) => {
    if (promoCodeList.includes(code)) {
      setDiscount(10000);
    } else {
      setMessage('Mã giảm giá không hợp lệ');
    }
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      setItemToDelete(item);
      setShowModal(true);
      return;
    }

    debounceFnRef.current.cancel();

    setUpdatedItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.cartItemId === item.cartItemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );

    debounceFnRef.current(item, newQuantity);
  };

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        setDeletingItemId(itemToDelete.cartItemId);
        setShowModal(false);
        await dispatch(removeCartItem({
          userId: user.userId,
          productId: itemToDelete.product.productId,
          token
        })).unwrap();
        
        setUpdatedItems((prevItems) =>
          prevItems.filter((item) => item.product.productId !== itemToDelete.product.productId)
        );
        
      } catch (error) {
        console.error("Error deleting item from cart:", error);
      } finally {
        setDeletingItemId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const calculateTotalPrice = () => {
    return updatedItems.reduce(
      (total, item) => total + item.product.realPrice * item.quantity,
      0
    );
  };

  if (status === "loading") {
    window.scrollTo(0, 0);
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Spinner />
      </div>
    )
  }

  if (!Array.isArray(updatedItems) || updatedItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <h1 className="text-2xl font-bold">Giỏ hàng của bạn đang trống</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-8">
      <div className="sm:flex shadow-md my-10">
        <div className="w-full sm:w-3/4 bg-white px-8 py-8">
          <div className="flex justify-between border-b pb-6">
            <h1 className="font-semibold text-xl">Giỏ hàng</h1>
            <h2 className="font-semibold text-xl">{updatedItems.length} Items</h2>
          </div>

          <table className="w-full mt-6 table-auto sm:text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold py-4">Sản phẩm</th>
                <th className="text-left font-semibold py-4">Giá</th>
                <th className="text-left font-semibold py-4">Số lượng</th>
                <th className="text-left font-semibold py-4">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {updatedItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onDelete={(item) => {
                    setItemToDelete(item);
                    setShowModal(true);
                  }}
                  isDeleting={deletingItemId === item.cartItemId}
                />
              ))}
            </tbody>
          </table>

          <Link to="../" className="flex font-semibold text-indigo-600 text-sm mt-8">
            <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
              <path
                d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971-4.411 40.971-16.971V296z"
              />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>

        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
          <h1 className="font-semibold text-xl border-b pb-8">Tổng hợp đơn hàng</h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Sản phẩm {updatedItems.length}</span>
            <span className="font-semibold text-sm">{calculateTotalPrice().toLocaleString()} VND</span>
          </div>
          <div>
            <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
            <select className="block p-2 text-gray-600 w-full text-sm">
              <option>Giao hàng tiêu chuẩn - 10,000 VND</option>
            </select>
          </div>
          <div className="py-10">
            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">
              Mã giảm giá
            </label>
            <div className="flex justify-between items-center gap-2">
              <input
                type="text"
                id="promo"
                placeholder="Nhập mã giảm giá"
                className="p-2 text-sm w-full"
                value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
              <button 
                onClick={() => handleApplyPromoCode(promoCode)}
                className="bg-red-500 hover:bg-red-600 rounded-lg px-5 py-2 text-sm text-white w-24 h-full"
              >
                <span className="text-white">Áp mã</span>
              </button>
            </div>
          </div>

          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-red-500">- {discount.toLocaleString()} VND</span>
              <button 
                onClick={() => setDiscount(0)}
                
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          )}
          {message && (
            <div className="text-red-500">{message}</div>
          )}
          
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Tổng cộng</span>
              <span>{(calculateTotalPrice() - discount + 10000).toLocaleString()} VND</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-indigo-500 font-semibold hover:bg-indigo-600 rounded-lg py-3 text-sm text-white uppercase w-full"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          onConfirm={handleDeleteItem}
          onCancel={handleCancelDelete}
          message="Bạn có chắc muốn xóa sản phẩm khỏi giỏ ?"
        />
      )}
    </div>
  );
};

export default CartPage;

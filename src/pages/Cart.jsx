import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemQuantity, fetchCart, removeCartItem } from "../store/reducers/cartReducer";
import { Link } from "react-router-dom";
import CartItem from "../components/cartItem";
import Modal from "../components/modal";
import debounce from "lodash/debounce";
import Spinner from "../components/Spinner";
const CartPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);
  const [updatedItems, setUpdatedItems] = useState(cart?.cartItems || []);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
        console.log("Deleting item:", itemToDelete);
        await removeCartItem(user.userId, itemToDelete.cartItemId, token);
        setUpdatedItems((prevItems) =>
          prevItems.filter((item) => item.cartItemId !== itemToDelete.cartItemId)
        );
        dispatch(fetchCart({ userId: user.userId, token }));
        setShowModal(false);
      } catch (error) {
        console.error("Error deleting item from cart:", error);
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
    return <Spinner/>;
  }

  if (!Array.isArray(updatedItems) || updatedItems.length === 0) {
    return <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống.</p>;
  }

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-8">
      <div className="sm:flex shadow-md my-10">
        <div className="w-full sm:w-3/4 bg-white px-8 py-8">
          <div className="flex justify-between border-b pb-6">
            <h1 className="font-semibold text-xl">Shopping Cart</h1>
            <h2 className="font-semibold text-xl">{updatedItems.length} Items</h2>
          </div>

          <table className="w-full mt-6 table-auto sm:text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold py-4">Product</th>
                <th className="text-left font-semibold py-4">Price</th>
                <th className="text-left font-semibold py-4">Quantity</th>
                <th className="text-left font-semibold py-4">Total</th>
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
            Continue Shopping
          </Link>
        </div>

        <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
          <h1 className="font-semibold text-xl border-b pb-8">Order Summary</h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Items {updatedItems.length}</span>
            <span className="font-semibold text-sm">{calculateTotalPrice()} VND</span>
          </div>
          <div>
            <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
            <select className="block p-2 text-gray-600 w-full text-sm">
              <option>Standard shipping - 10,000 VND</option>
            </select>
          </div>
          <div className="py-10">
            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">
              Promo Code
            </label>
            <input
              type="text"
              id="promo"
              placeholder="Enter your code"
              className="p-2 text-sm w-full"
            />
          </div>
          <button className="bg-red-500 hover:bg-red-600 rounded-lg px-5 py-2 text-sm text-white uppercase">
            Apply
          </button>
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>{calculateTotalPrice()} VND</span>
            </div>
            <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 rounded-lg py-3 text-sm text-white uppercase w-full">
              Checkout
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

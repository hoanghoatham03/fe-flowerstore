import React from "react";
import { ClipLoader } from "react-spinners";

const CartItem = ({ item, onQuantityChange, onDelete, isDeleting }) => {
  return (
    <tr key={item.cartItemId}>
      <td className="py-4">
        <div className="flex items-center">
          <img
            className="h-16 w-16 mr-4 rounded-lg"
            src={item.product.images[0]?.imageUrl}
            alt={item.product.productName}
          />
          <span className="font-semibold">{item.product.productName}</span>
        </div>
      </td>
      <td className="py-4">{item.product.realPrice.toLocaleString()} VND</td>
      <td className="py-4">
        <div className="flex items-center">
          <button 
            className="border rounded-md py-2 px-4 mr-2" 
            onClick={() => onQuantityChange(item, item.quantity - 1)}
          >
            -
          </button>
          <span className="text-center w-8">{item.quantity}</span>
          <button 
            className="border rounded-md py-2 px-4 ml-2" 
            onClick={() => onQuantityChange(item, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4">
        {(item.product.realPrice * item.quantity).toLocaleString()} VND
      </td>
      <td>
        <button 
          onClick={() => onDelete(item)}
          disabled={isDeleting} 
          className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center"
        >
          {isDeleting ? (
            <ClipLoader size={15} color="#dc2626" />
          ) : (
            'Xóa'
          )}
        </button>
      </td>
    </tr>
  );
};

export default CartItem;

import React from "react";

const CartItem = ({ item, onQuantityChange, onDelete }) => {
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
      <td className="py-4">{item.product.realPrice} VND</td>
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
        {item.product.realPrice * item.quantity} VND
      </td>
      <td>
        <button onClick={() => onDelete(item)} className="text-red-600">Delete</button>
      </td>
    </tr>
  );
};

export default CartItem;

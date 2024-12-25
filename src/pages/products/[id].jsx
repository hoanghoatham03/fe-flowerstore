import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailScreen = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/product/${id}`) 
        .then((res) => res.json())
        .then((data) => {
          setProductData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product data:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!productData) {
    return <div className="text-center py-4 text-red-500">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center p-4 border-b border-gray-300">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 bg-gray-200 rounded-full"
        >
          <span className="text-xl font-bold">&#8592;</span>
        </button>
        <h1 className="text-xl font-bold">{productData.name}</h1>
      </div>
      <div className="p-4 flex flex-col md:flex-row">
        <img
          src={productData.imageUrl}
          alt={productData.name}
          className="w-full md:w-1/2 object-cover rounded-md"
        />
        <div className="md:ml-8 mt-4 md:mt-0">
          <p className="text-xl text-red-500 font-bold">
            Giá: {productData.price - productData.price * (productData.discount / 100)} VND
          </p>
          {productData.discount > 0 && (
            <p className="text-gray-500 line-through">
              Giá gốc: {productData.price} VND
            </p>
          )}
          <p className="mt-4">{productData.description}</p>
          <button className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;

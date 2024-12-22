import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/api/product";

const ProductDetailScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadProductDetail = async () => {
    setLoading(true);
    try {
      const response = await getProductById(parseInt(id, 10));
      setProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProductDetail();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải chi tiết sản phẩm...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Không tìm thấy sản phẩm.</p>;
  }
  return (
    <div className="px-4 md:px-20 py-10 bg-white items-center">
      <div className="flex flex-col md:flex-row md:gap-10">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.images[0]?.imageUrl}
            alt={product.productName}
            className="max-w-full h-auto object-cover rounded-md"
          />
        </div>
  
        <div className="w-full border-2 md:w-1/2 p-5 flex flex-col gap-3">
          <h1 className="text-3xl font-bold mb-6">{product.productName}</h1>
          <div className="flex items-center border-y-2 border-gray-300 p-3 gap-4 mb-6 text-2xl list-none">
            <li className="text-red-500">
              {product.price - product.price * (product.discount / 100)} VND
            </li>
            {product.discount > 0 && (
              <li className="text-gray-500 text-xl line-through">
                {product.price} VND
              </li>
            )}
            {product.discount > 0 && (
              <li className="bg-red-500 text-white px-3 py-1 rounded-lg text-lg">
                {product.discount}% GIẢM
              </li>
            )}
          </div>
  
          <div>
            <p className="font-sans">Khuyến mãi:</p>
            <div className="flex flex-row list-none text-[#e91e63] space-x-3 font-semibold font-sans">
              <li>
                <p className="border-dashed border-2 border-[#dc1b57] bg-[#ffe1e1] p-2">
                  Giảm 50K
                </p>
              </li>
              <li>
                <p className="border-dashed border-2 border-[#dc1b57] bg-[#ffe1e1] p-2">
                  Giảm 25K
                </p>
              </li>
              <li>
                <p className="border-dashed border-2 border-[#dc1b57] bg-[#ffe1e1] p-2">
                  Giảm 10%
                </p>
              </li>
            </div>
          </div>
  
          <p className="font-sans">
            Gọi ngay:{" "}
            <span className="text-[#db1b57] bg-[#ffe1e1] text-2xl font-bold px-5 rounded">
              1900 633 045
            </span>
          </p>
          <div>
            <input
              type="text"
              name="quantity"
              defaultValue="1"
              size="2"
              id="input-quantity"
              className="form-control border-2 border-[#dc1b57] p-5"
            />
            <button className="self-start py-3 px-6 bg-blue-500 text-white text-lg font-sans font-semibold rounded-md hover:bg-blue-600 m-5">
              Thêm Đơn
            </button>
          </div>
        </div>
      </div>
  
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
        <p className="w-full flex text-lg text-gray-700">{product.description}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Sản Phẩm Liên Quan</h2> 
        
      </div>
    </div>
  );
  
  };

export default ProductDetailScreen;

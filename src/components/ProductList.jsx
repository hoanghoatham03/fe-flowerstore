import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductByCategoryId } from "@/api/product";
import { Link } from "react-router-dom";

const ProductList = ({ categoryId }) => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => getProductByCategoryId(categoryId, 1, 4).then((res) => res.data),
    staleTime: 300000,
    cacheTime: 600000,
  });

  return (
    <div>
      {isLoading ? (
        <p className="text-center font-sans text-xs">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.productId}
              to={`/product/${product.productId}`}
              className="relative w-full h-auto rounded-md p-4 shadow hover:bg-neutral-200 hover:shadow-xl"
            >
              {product.discount > 0 && (
                <span className="absolute m-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                  {product.discount}%<br />GIẢM
                </span>
              )}

              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-auto object-cover mb-4 rounded-md"
              />

              <h3 className="text-center text-lg font-semibold font-sans text-gray-900">
                {product.productName}
              </h3>

              <div className="flex justify-center items-center mt-2">
                <p className="text-red-500 text-sm font-bold">
                  {product.price - product.price * (product.discount / 100)} VND
                </p>
                {product.discount > 0 && (
                  <p className="text-gray-500 text-sm line-through ml-2">
                    {product.price} VND
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-4">
                <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Đặt ngay
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;

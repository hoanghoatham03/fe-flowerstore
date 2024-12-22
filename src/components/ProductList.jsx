import React, { useState, useEffect } from "react";
import { getCategories } from "@/api/category"; // API to get categories
import { getProductByCategoryId } from "@/api/product"; // API to get products by category
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCategoriesAndProducts = async () => {
    setLoading(true);
    try {
      const categoryResponse = await getCategories(1, 9);
      const allCategories = categoryResponse.data;

      const productPromises = allCategories.map(async (category) => {
        const productResponse = await getProductByCategoryId(category.categoryId, 1, 4);
        return { [category.categoryId]: productResponse.data };
      });

      const productData = await Promise.all(productPromises);
      const productMap = Object.assign({}, ...productData);

      setCategories(allCategories);
      setProducts(productMap);
    } catch (error) {
      console.error("Error loading categories and products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoriesAndProducts(); 
  }, []);

  const handleProductPress = (product) => {
    navigate(`/pages/products/${product.productId}`);
  };

  return (
    <div>
      {loading && <p className="text-center font-sans text-xs">Đang tải...</p>}

      {!loading &&
        categories.map((category) => (
          <div key={category.categoryId} className="mb-8 lg:m-20">
            <h2 className="m-5 text-2xl font-sans mb-4">{category.categoryName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(products[category.categoryId] || []).slice(0, 4).map((product) => (
                <div
                  key={product.productId}
                  className="relative w-full h-auto rounded-md p-4 shadow hover:bg-neutral-200 hover:shadow-xl cursor-pointer"
                  onClick={() => handleProductPress(product)}
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

                  <h3 className="text-center text-lg font-semibold font-sans text-gray-900">{product.productName}</h3>

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
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductList;

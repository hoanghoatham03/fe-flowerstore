import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "@/api/product";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";
import ProductFilters from "@/components/ProductFilters";
import { filterProducts, sortProducts } from "@/utils/productFilters";
import { useQuery } from "@tanstack/react-query";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [filters, setFilters] = useState({
    category: "",
    price: {
      min: 0,
      max: 10000000,
    },
    sort: "price-asc",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchProducts', query],
    queryFn: async () => {
      if (!query) return { data: { products: [] } };
      return await searchProducts(query, 1, 70);
    },
    enabled: !!query,
    staleTime: 300000,
    cacheTime: 600000,
  });

  const products = data?.data?.products || [];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = filterProducts(products, filters);
    return sortProducts(result, filters.sort);
  }, [products, filters]);

  const categories = useMemo(() => {
    return [...new Map(
      products.map(product => [
        product.categoryId,
        { categoryId: product.categoryId, categoryName: product.categoryName }
      ])
    ).values()];
  }, [products]);

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Đã xảy ra lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho "{query}" ({filteredAndSortedProducts.length} sản phẩm)
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <ProductFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
          />
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>Không tìm thấy sản phẩm nào phù hợp</p>
              <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
                Quay lại trang chủ
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Link
                  key={product.productId}
                  to={`/product/${product.productId}`}
                  className="group"
                >
                  <div className="relative h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={product?.imageUrl}
                      alt={product.productName}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                        -{product.discount}%
                      </div>
                    )}
                    <div className="p-4 h-full">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#9C3F46]">
                        {product.productName}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-red-500 font-bold">
                          {product.realPrice.toLocaleString()} VND
                        </span>
                        {product.discount > 0 && (
                          <span className="text-gray-500 text-sm line-through">
                            {product.price.toLocaleString()} VND
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 
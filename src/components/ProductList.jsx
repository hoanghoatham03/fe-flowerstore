import { useQuery } from "@tanstack/react-query";
import { getProductByCategoryId } from "@/api/product";

const ProductList = ({ categoryId }) => {
  // Sử dụng React Query v5
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", categoryId], // Khóa cache
    queryFn: () => getProductByCategoryId(categoryId, 1, 4).then((res) => res.data),
    staleTime: 300000, // Cache trong 5 phút
    cacheTime: 600000, // Giữ cache trong 10 phút
  });

  return (
    <div>
      {isLoading ? (
        <p className="text-center font-sans text-xs">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
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
      )}
    </div>
  );
};

export default ProductList;

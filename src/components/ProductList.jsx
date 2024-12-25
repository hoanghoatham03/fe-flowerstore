import React,{useRef,useCallback}from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductByCategoryId } from "@/api/product";
import { Link } from "react-router-dom";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Pagination } from "swiper/modules";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Spinner from "./Spinner";
const ProductList = ({ categoryId }) => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () =>
      getProductByCategoryId(categoryId, 1,6).then((res) => res.data),
    staleTime: 300000,
    cacheTime: 600000,
  });
  const sliderRef = useRef(null);

 
  return (
    <div className="my-3">
      {isLoading ? (
        <Spinner />
      ) : (
        <Swiper
          ref={sliderRef} 
          spaceBetween={20} 
          slidesPerView={1} 
          navigation={true}
          loop={true} 
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            320: {
              slidesPerView: 1, 
            },
            640: {
              slidesPerView: 2, 
            },
            768: {
              slidesPerView: 3, 
            },
            1024: {
              slidesPerView: 4, 
            },
          }
        }
        className="arr-custom custom-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.productId}
            className="relative w-full h-auto rounded-md p-8 shadow hover:bg-neutral-200 hover:shadow-xl">
              <Link
                to={`/product/${product.productId}`}
              >
                {product.discount > 0 && (
                  <span className="absolute m-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full text-center font-bold">
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
                  <button className="py-2 px-4 bg-[#c3e6cb] text-black font-medium rounded-md hover:bg-[#be9fdb]">
                    Đặt ngay
                  </button>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductList;

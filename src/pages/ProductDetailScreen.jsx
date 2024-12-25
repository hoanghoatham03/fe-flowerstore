import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProductById } from "@/api/product";
import { addToCart } from "../api/cart";
import ProductList from "../components/ProductList";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay ,Pagination} from "swiper/modules";
import "swiper/css";
import 'swiper/css/pagination';
import "swiper/css/autoplay";
import { GlassMagnifier } from "react-image-magnifiers";

const ProductDetailScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user, token } = useSelector((state) => state.auth);

  const loadProductDetail = async () => {
    setLoading(true);
    try {
      const response = await getProductById(parseInt(id, 10));
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductClick = async () => {
    try {
      const response = await addToCart(user.userId, id, quantity, token);
      console.log("Thêm sản phẩm vào giỏ hàng thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  useEffect(() => {
    if (id) {
      loadProductDetail();
    }
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div className="px-4 md:px-20 py-10 bg-white items-center">
      <div className="flex flex-col md:flex-row md:gap-10">
        <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
        <Swiper
              spaceBetween={10}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop
              className="custom-swiper"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative overflow-hidden">
                    <GlassMagnifier
                      imageSrc={image?.imageUrl}
                      imageAlt={product.productName}
                      glassSrc={image?.imageUrl}
                      glassWidth={300}
                      glassHeight={300}
                      magnifierSize={100}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

        </div>

        <div className="w-full border-2 md:w-1/2 lg:w-2/3 p-5 flex flex-col gap-3">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            {product.productName}
            <span className="flex items-center gap-2 border-2 border-gray-300 p-2 rounded-lg">
              <span className="text-yellow-500">★</span>
              <span className="text-yellow-500">★</span>
              <span className="text-yellow-500">★</span>
              <span className="text-yellow-500">★</span>
              <span className="text-gray-400">★</span>
            </span>
          </h1>
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
            <p className="font-sans text-xl">Khuyến mãi:</p>
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

          <p className="font-sans text-xl">
            Gọi ngay:{" "}
            <span className="text-[#db1b57] bg-[#ffe1e1] text-2xl font-bold px-5 rounded p-3">
              1900 633 045
            </span>
          </p>
          <div>
            <input
              type="number"
              name="quantity"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="form-control border-2 border-[#dc1b57] p-5 w-20"
            />
            <button
              onClick={handleAddProductClick}
              className="self-start py-3 px-6 bg-blue-500 text-white text-lg font-sans font-semibold rounded-md hover:bg-blue-600 m-5"
            >
              Thêm Vào Giỏ
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
        <p className="w-full flex text-lg text-gray-700">{product.description}</p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Sản Phẩm Liên Quan</h2>
        <div>
          <ProductList categoryId={product.categoryId} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;

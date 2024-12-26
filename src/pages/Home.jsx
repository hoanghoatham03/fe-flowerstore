import React, { useEffect, useState } from "react";
import { getCategories } from "@/api/category"; 
import ProductList from "../components/ProductList";
import Banner from "../components/Banner";
import Spinner from "../components/Spinner";
import DirectMap from '../components/DirectMap';
import { FaMapMarkedAlt } from "react-icons/fa";
import giphy from '../assets/giphy.gif';
import { APP_COLORS } from "@/utils/appConstant";

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDirectMap, setShowDirectMap] = useState(false);

    const loadCategories = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      try {
        const response = await getCategories(); 
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadCategories();
    }, []);

    return (
      <div>
        <Banner />
        <div className="mt-8 px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Tất cả Sản Phẩm</h2>
  
          {loading ? (
            <Spinner/>
          ) : (
            categories.map((category) => (
              <div key={category.categoryId} className="mb-6 pb-6">
                <h3 className="text-2xl font-semibold mb-4">{category.categoryName}</h3>
                <ProductList categoryId={category.categoryId} />
              </div>
            ))
          )}
        </div>

        <div className=" fixed bottom-10 right-10 z-50">  
          <img src={giphy} alt="clickme" className="w-10 h-10" />
        
        <button
          onClick={() => setShowDirectMap(true)}
          className=" bg-[#9C3F46] text-white px-4 py-2 rounded-lg hover:bg-[#b16c72]"
        >
          <div className="flex items-center ">
            <FaMapMarkedAlt className="mr-2" />
            Đến cửa hàng ngay
          </div>
        </button>
        </div>
        {showDirectMap && (
          <DirectMap onClose={() => setShowDirectMap(false)} />
        )}
      </div>
    );
  };
  
  export default HomePage;

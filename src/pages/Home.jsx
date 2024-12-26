import React, { useEffect, useState } from "react";
import { getCategories } from "@/api/category"; 
import ProductList from "../components/ProductList";
import Banner from "../components/Banner";
import Spinner from "../components/Spinner";
import DirectMap from '../components/DirectMap';
import { FaMapMarkedAlt } from "react-icons/fa";
import giphy from '../assets/giphy.gif';
import poster from '../assets/poster.webp';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDirectMap, setShowDirectMap] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const ListCategoryEmpty = [16,17,18,19]

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

  useEffect(() => {
    const timer = setInterval(() => {
      setShowPoster(true);
    }, 180000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPoster(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showPoster]);



  return (
    <div>
      {showPoster && <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="relative max-w-2xl mx-auto">
          <img 
            src={poster} 
            alt="Promotional Poster" 
            className="w-full h-auto rounded-lg shadow-xl"
          />
          <button
            onClick={() => setShowPoster(false)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>}
      <Banner />
      <div className="mt-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Tất cả Sản Phẩm</h2>

        {loading ? (
          <Spinner/>
        ) : (
          categories.map((category) => (
            ListCategoryEmpty.includes(category.categoryId) ? null : (
              <div key={category.categoryId} className="mb-6 pb-6">
                <h3 className="text-2xl font-semibold mb-4">{category.categoryName}</h3>
                <ProductList categoryId={category.categoryId} />
              </div>
            )
          ))
        )}
      </div>

      <div className="fixed bottom-10 right-10 z-50">  
        <img src={giphy} alt="clickme" className="w-10 h-10" />
        <button
          onClick={() => setShowDirectMap(true)}
          className="bg-[#9C3F46] text-white px-4 py-2 rounded-lg hover:bg-[#b16c72]"
        >
          <div className="flex items-center">
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

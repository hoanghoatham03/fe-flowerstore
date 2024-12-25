import React, { useEffect, useState } from "react";
import { getCategories } from "@/api/category"; 
import ProductList from "../components/ProductList";
import Banner from "../components/Banner";
import Spinner from "../components/Spinner";
const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadCategories = async () => {
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
              <div key={category.categoryId} className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">{category.categoryName}</h3>
                <ProductList categoryId={category.categoryId} />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  export default HomePage;

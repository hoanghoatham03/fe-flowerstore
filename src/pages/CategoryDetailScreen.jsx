
import { useParams } from "react-router-dom";
import ProductList from "@/components/ProductList";
import React, { useState, useEffect } from "react";
import { getProductByCategoryId } from "../api/product";
import Spinner from "@/components/Spinner";
const CategoryDetailScreen = () => {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const loadCategoryName = async () => {
    setLoading(true);
    try {
      const response = await getProductByCategoryId(parseInt(id, 10),1,10);
      setCategoryName(response.data.products[0].categoryName);
      console.log("response category name:",response.data)
    } catch (error) {
      console.error("Error fetching category name:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    if (id) {
      loadCategoryName();
    }
    
  }, [id]);

  if (loading) {
    window.scrollTo(0, 0);
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Spinner />
      </div>
    );
  }


  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold text-black-800 mb-4">{categoryName}</h1>
      <ProductList categoryId={parseInt(id, 10)} />
    </div>
  );
};

export default CategoryDetailScreen;


import { useRouter } from "next/router";
import { useEffect, useState } from "react"; 
import ProductList from "@/components/ProductList"; 

const CategoryDetailScreen = () => {
  const router = useRouter();
  const { id, name } = router.query; 

  const [loading, setLoading] = useState(true); 
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setCategoryData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching category data:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center p-4 border-b border-gray-300">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 bg-gray-200 rounded-full"
        >
          <span className="text-xl font-bold">&#8592;</span>
        </button>
        <h1 className="text-xl font-bold">{categoryData?.name}</h1>
      </div>
      <div className="p-4">
        <ProductList categoryId={parseInt(id, 10)} />
      </div>
    </div>
  );
};

export default CategoryDetailScreen;

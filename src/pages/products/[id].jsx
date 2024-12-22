import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For navigation
import { getProductById } from "@/api/product"; // Assuming you have an API function to fetch the product

const ProductDetailScreen = () => {
  const { id } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Added state for managing adding to cart

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(parseInt(id));
        setProduct(data.data);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatPrice = (price) => {
    if (!price) return "0 đ";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true); // Set adding state to true when starting to add to cart
    // You can handle adding to cart logic here
    console.log("Adding to cart", product, quantity);
    
    // Simulate a delay, you can replace this with actual API call logic
    setTimeout(() => {
      setIsAddingToCart(false); // Reset adding state after the action completes
      // Optionally show success or error notifications
    }, 1000);
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const allImages = [
    ...(product.images?.map((img) => img.imageUrl) || []),
    product.imageUrl,
  ].filter(Boolean);

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="flex items-center p-4 border-b border-gray-300">
        <button onClick={() => navigate(-1)} className="mr-4">
          Back
        </button>
        <h1 className="text-2xl font-bold">Product Details</h1>
      </div>

      {/* Product Images and Thumbnails */}
      <div className="overflow-auto">
        <img
          src={allImages[selectedImageIndex]}
          alt={product.productName}
          className="w-full h-96 object-cover"
        />
        {allImages.length > 1 && (
          <div className="p-4 flex space-x-4">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`border-2 p-1 rounded ${selectedImageIndex === index ? 'border-red-500' : 'border-transparent'}`}
              >
                <img src={img} alt="Thumbnail" className="w-16 h-16 object-cover rounded" />
              </button>
            ))}
          </div>
        )}

        <div className="p-4">
          <h2 className="text-xl font-semibold mt-4">{product.productName}</h2>
          <div className="flex items-center space-x-1 mt-2">
            <span className="text-yellow-500">★★★★☆</span>
          </div>

          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold text-red-500">{formatPrice(product.realPrice)}</span>
            {product.discount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="line-through text-gray-500">{formatPrice(product.price)}</span>
                <span className="bg-red-500 text-white text-xs py-1 px-2 rounded">{`-${product.discount}%`}</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="font-semibold">Category:</p>
            <p>{product.categoryName}</p>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Stock:</p>
            <p>{product.stock}</p>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Description:</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
        
          <button
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            className="bg-gray-200 p-2 rounded"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-200 p-2 rounded"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product?.stock}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailScreen;

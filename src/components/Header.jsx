import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/src/assets/logo-shop.png"
                alt="Moon Flower Logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold">Moon Flower</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Products
            </Link>
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

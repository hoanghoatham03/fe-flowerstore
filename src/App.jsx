import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Layout from "./pages/Layout";
import CategoryDetailScreen from "./pages/CategoryDetailScreen";
import ProductDetailScreen from "./pages/ProductDetailScreen";
import "antd/dist/reset.css";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/category/:id",
        element: <CategoryDetailScreen />,
      },
      {
        path: "/product/:id",
        element: <ProductDetailScreen />,
      },
      {
        path: "/cart", 
        element: <Cart />,
      },
      {
        path: "/profile", 
        element: <Profile />,
      },
      
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

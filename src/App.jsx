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
import { Toaster } from 'react-hot-toast';
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentPage from "./pages/PaymentPage";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
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
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/order-success",
        element: <OrderSuccess />,
      },
      {
        path: "/payment/:orderId",
        element: <PaymentPage />,
      },
      {
        path: "/orders",
        element: <OrderHistory />,
      },
      {
        path: "/orders/:orderId",
        element: <OrderDetail />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      }
      
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;

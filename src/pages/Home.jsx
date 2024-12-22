import React from "react";
import ProductList from "../components/ProductList"
import Banner from "../components/Banner";
const HomePage = () => {

  return (
    <div>
      <Banner></Banner>
      <ProductList className="m-5"></ProductList>
    </div>
  );
};

export default HomePage;

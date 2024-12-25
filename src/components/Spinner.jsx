import React from "react";
import { PacmanLoader } from "react-spinners";

const Spinner = ({ size = 30, color = "#333333" }) => {
  return (
    <div className="flex justify-center">
      <PacmanLoader color={color} size={size} />
    </div>
  );
};

export default Spinner;
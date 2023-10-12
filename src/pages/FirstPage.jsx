import React from "react";
import { Link } from "react-router-dom";

const FirstPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-10 text-center">MM1 Simulation</h1>
      <div className="space-y-4 flex flex-col items-center">
        <Link to="/arrival">
          <button className="py-2 px-4 bg-blue-500  hover:bg-blue-600 text-white rounded-lg">Arrival Random Number Generator</button>
        </Link>
        <Link to="/service">
          <button className="py-2 px-4 bg-blue-500  hover:bg-blue-600 text-white rounded-lg">Service Random Number Generator</button>
        </Link>
      </div>
    </div>
  );
};

export default FirstPage;

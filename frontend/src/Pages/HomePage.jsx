import React from "react";
import { Moon } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="mainDiv w-screen min-h-screen bg-white flex items-center justify-center p-4 relative">
      <div className="absolute top-8 right-8 bg-white border border-gray-300 rounded-full p-3 shadow-sm">
        <Moon className="w-5 h-5 text-gray-800" />
      </div>
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#000000] mb-2">
          Welcome to the College ERP
        </h1>
        <p className="text-sm text-gray-600 mb-8">Created by</p>
        <div className="grid grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
          <div className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 font-normal text-base">
              Dhwanit Khatri
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 font-normal text-base">Jiken Patel</p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 font-normal text-base">
              Aayush Bhavsar
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 font-normal text-base">Yug Panchal</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/LoginPage">
            <button className="px-10 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Login
            </button>
          </Link>
          <Link to="/AboutUs">
            <button className="px-10 py-3 bg-white text-black font-medium rounded-lg border-2 border-black hover:bg-gray-50 transition-colors">
              About Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

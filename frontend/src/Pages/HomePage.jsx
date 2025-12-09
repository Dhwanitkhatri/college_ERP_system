import React from "react";
import { Link } from "react-router-dom";
import ThemeButton from "../ui/Buttons/ThemeButton";

const HomePage = () => {
  return (
    <div className="mainDiv w-screen min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative">
      <div className="absolute top-8 right-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm">
        <ThemeButton />
      </div>
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
          Welcome to the College ERP
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
          Created by
        </p>
        <div className="grid grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">
              Dhwanit Khatri
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">Jiken Patel</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">
              Aayush Bhavsar
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">Yug Panchal</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/LoginPage">
            <button className="px-10 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Login
            </button>
          </Link>
          <Link to="/AboutUs">
            <button className="px-10 py-3 bg-white dark:bg-gray-800 text-black dark:text-white font-medium rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              About Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

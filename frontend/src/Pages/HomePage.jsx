import React from "react";
import { Link } from "react-router-dom";
import ThemeButton from "../ui/Buttons/ThemeButton";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="mainDiv w-screen min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 right-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm"
      >
        <ThemeButton />
      </motion.div>
      <div className="max-w-2xl w-full text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2"
        >
          Welcome to the College ERP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm text-gray-600 dark:text-gray-300 mb-8"
        >
          Created by
        </motion.p>
        <div className="grid grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">
              Dhwanit Khatri
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">
              Jiken Patel
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">
              Aayush Bhavsar
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 dark:text-gray-200 font-normal text-base">
              Yug Panchal
            </p>
          </motion.div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/LoginPage">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="px-10 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Login
            </motion.button>
          </Link>
          <Link to="/AboutUs">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="px-10 py-3 bg-white dark:bg-gray-800 text-black dark:text-white font-medium rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              About Us
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

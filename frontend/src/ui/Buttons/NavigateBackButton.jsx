import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavigateBackButton = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 
                        rounded-full transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
      </button>
    </div>
  );
};

export default NavigateBackButton;

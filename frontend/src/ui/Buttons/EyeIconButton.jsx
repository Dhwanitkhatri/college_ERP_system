import React from "react";
import { Eye, EyeOff } from "lucide-react";

const EyeIconButton = ({ visible, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 
                 text-[var(--icon-color)] 
                 hover:bg-[var(--bg-hover)] 
                 p-1.5 rounded-md 
                 transition-colors duration-200"
      tabIndex={-1}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
};

export default EyeIconButton;
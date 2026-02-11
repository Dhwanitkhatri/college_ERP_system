import React from "react";

/*
  Reusable button
  Receives:
    - status (active / inactive)
    - onClick function
*/

const ActivateDeactivateButton = ({ status, onClick }) => {
  const isActive = status === "active";

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-white transition
        ${
          isActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
    >
      {isActive ? "Deactivate" : "Activate"}
    </button>
  );
};

export default ActivateDeactivateButton;

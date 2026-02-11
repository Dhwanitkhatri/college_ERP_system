import React from "react";

const DeleteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
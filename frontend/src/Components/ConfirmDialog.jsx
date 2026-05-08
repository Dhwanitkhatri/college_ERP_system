import React from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--card-bg)] text-[var(--text-primary)] p-6 rounded-xl shadow-xl w-[90%] max-w-md">
        
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmDialog;
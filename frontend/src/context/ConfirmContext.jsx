import { createContext, useContext, useState } from "react";
import ConfirmDialog from "../Components/ConfirmDialog";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showConfirm = ({ title, message, onConfirm }) => {
    setDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleCancel = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleConfirm = () => {
    dialog.onConfirm?.();
    handleCancel();
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
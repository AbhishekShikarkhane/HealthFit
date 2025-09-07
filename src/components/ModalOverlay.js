import React from 'react';
import { motion } from 'framer-motion';

const ModalOverlay = ({ children, onClose }) => {
  const handleBackdropClick = (e) => {
    // Only close if the backdrop itself is clicked, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {children}
    </motion.div>
  );
};

export default ModalOverlay;
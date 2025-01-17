import React from 'react';
import PropTypes from 'prop-types';

const Toast = ({ message, type, onClose }) => {
  const baseClasses = "fixed top-20 right-4 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out z-50";
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} slide-in`}>
      {message}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  onClose: PropTypes.func,
};

export default Toast; 
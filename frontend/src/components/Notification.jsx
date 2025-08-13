import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white flex justify-between items-center z-50";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
    </div>
  );
};


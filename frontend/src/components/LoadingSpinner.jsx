import React from 'react';

function LoadingSpinner({ size = 'medium', color = 'blue' }) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    green: 'border-green-500 border-t-transparent'
  };
  
  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colorClasses[color]} 
      rounded-full animate-spin
    `}></div>
  );
}

export default LoadingSpinner;
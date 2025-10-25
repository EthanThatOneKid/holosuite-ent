import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <span className={`loading loading-spinner ${className}`}></span>
  );
};

export default LoadingSpinner;

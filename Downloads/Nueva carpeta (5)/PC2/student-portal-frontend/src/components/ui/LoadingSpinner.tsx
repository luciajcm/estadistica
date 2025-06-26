import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  let spinnerSize = 'w-6 h-6';
  if (size === 'sm') spinnerSize = 'w-4 h-4';
  if (size === 'lg') spinnerSize = 'w-10 h-10';

  return (
    <div
      className={`${spinnerSize} border-4 border-solid border-gray-300 border-t-primary rounded-full animate-spin ${className}`}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;
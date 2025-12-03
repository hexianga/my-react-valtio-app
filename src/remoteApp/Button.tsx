import React from 'react';

const Button: React.FC<{ label?: string; onClick?: () => void }> = ({ label = 'Remote Button', onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
    >
      {label}
    </button>
  );
};

export default Button;


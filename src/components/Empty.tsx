import React from 'react';

interface EmptyProps {
  message: string;
}

const Empty: React.FC<EmptyProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 mb-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 14l-4-4m0 0l4-4m-4 4h16M5 10h16m-7 4h7"
        />
      </svg>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default Empty;
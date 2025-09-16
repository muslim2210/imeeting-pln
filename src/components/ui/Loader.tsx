import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>


        {/* Text */}
        <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;

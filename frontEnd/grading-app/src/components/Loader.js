import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-gray-800 rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;

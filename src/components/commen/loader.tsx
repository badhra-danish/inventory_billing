import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}

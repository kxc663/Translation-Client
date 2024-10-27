import React from "react";

const StatusDisplay = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-200";
      case "error":
      case "cancelled":
        return "text-red-600 bg-red-100 border-red-200";
      case "pending...":
        return "text-blue-600 bg-blue-100 border-blue-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`
        status-display
        p-4
        rounded-lg
        border-2
        shadow-md
        transition-all
        duration-300
        ${getStatusStyles()}
      `}>
        <div className="flex items-center justify-center space-x-2">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {status?.toLowerCase() === "completed" && (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {(status?.toLowerCase() === "error" || status?.toLowerCase() === "cancelled") && (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {status?.toLowerCase() === "pending..." && (
              <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </div>
          
          {/* Status Text */}
          <h2 className="text-lg font-semibold">
            Current Status: {" "}
            <span className="font-bold">
              {status}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
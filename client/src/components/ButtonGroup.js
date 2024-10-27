import React from "react";

const ButtonGroup = ({ onStart, onCancel, isPending }) => (
    <div className="flex justify-center gap-4 mt-6">
        <button
            onClick={onStart}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all shadow-md 
                ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
        >
            Start
        </button>
        <button
            onClick={onCancel}
            disabled={!isPending}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all shadow-md 
                ${!isPending ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}
        >
            Cancel
        </button>
    </div>
);

export default ButtonGroup;

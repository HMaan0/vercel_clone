"use client";
import { useState } from "react";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (!isCopied) {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors relative group"
    >
      <div className="relative h-6 w-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 text-gray-600 group-hover:text-gray-800 absolute transition-all duration-300 ${
            isCopied
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 pointer-events-none"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 text-gray-600 absolute transition-all duration-300 ${
            isCopied
              ? "opacity-0 scale-50 pointer-events-none"
              : "opacity-100 scale-100 group-hover:text-gray-800"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
    </button>
  );
};

export default CopyButton;

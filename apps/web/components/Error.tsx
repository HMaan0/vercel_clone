"use client";

import { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";

const Error = ({
  message,
  clearError,
}: {
  message: string | null;
  clearError: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(clearError, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, clearError]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-5 right-5 bg-red-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 max-w-sm transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <FaExclamationCircle size={18} />
      <div>
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(clearError, 300);
        }}
        className="ml-auto text-white hover:text-red-100"
      >
        ✕
      </button>
    </div>
  );
};

export default Error;

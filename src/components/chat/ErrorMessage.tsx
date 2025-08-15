import React, { useState } from "react";
import { AlertCircle, X, Minus } from "lucide-react";

interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  console.log("ErrorMessage props:", { title, message: message?.substring(0, 100) + "..." });

  if (!isVisible) return null;

  if (!message) {
    return (
      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden card-border">
        <div className="bg-[#001f3f] text-white p-3">
          <h3 className="font-medium">No Data</h3>
        </div>
        <div className="p-4 bg-red-50">
          <p className="text-red-600">No message content received</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden card-border">
      <div className="bg-[#001f3f] text-white p-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-800 p-1 rounded"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="hover:bg-blue-800 p-1 rounded"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 bg-blue-50">
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="rounded-full bg-blue-500 p-2">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div 
                className="text-gray-800"
                dangerouslySetInnerHTML={{ __html: message }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
import React, { useState, useEffect } from 'react';
import { AlertTriangle, XCircle, CheckCircle, X } from 'lucide-react';

const BaseAlert = ({ icon: Icon, bgColor, borderColor, textColor, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(oldProgress + 100 / 15, 100);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`relative border-l-4 px-4 py-3 mb-4 ${bgColor} ${borderColor} ${textColor} animate-popup`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="mr-3" size={24} />
          <p className="font-normal">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
        <div
          className={`h-full ${borderColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export const WarningAlert = ({ message, onClose }) => (
  <BaseAlert
    icon={AlertTriangle}
    bgColor="bg-orange-100"
    borderColor="border-orange-500"
    textColor="text-orange-700"
    message={message}
    onClose={onClose}
  />
);

export const ErrorAlert = ({ message, onClose }) => (
  <BaseAlert
    icon={XCircle}
    bgColor="bg-red-100"
    borderColor="border-red-500"
    textColor="text-red-700"
    message={message}
    onClose={onClose}
  />
);
export const SuccessAlert = ({ message, onClose }) => (
  <BaseAlert
    icon={CheckCircle}
    bgColor="bg-green-100"
    borderColor="border-green-500"
    textColor="text-green-700"
    message={message}
    onClose={onClose}
  />
);

const AlertExample = () => {
  return (
    <div className="p-4 space-y-4">
      <WarningAlert message="This is a warning alert." />
      <ErrorAlert message="This is an error alert." />
      <SuccessAlert message="This is a success alert." />
    </div>
  );
};

export default AlertExample;
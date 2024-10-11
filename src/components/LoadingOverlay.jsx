import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ duration }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-white">
        <Loader2 className="animate-spin h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
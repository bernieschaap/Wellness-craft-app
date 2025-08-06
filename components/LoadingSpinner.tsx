
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border-4 border-rose-500/20"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-rose-500 animate-spin"></div>
      </div>
      <p className="text-lg text-rose-400 font-semibold animate-pulse">
        Crafting your plan...
      </p>
    </div>
  );
};

export default LoadingSpinner;


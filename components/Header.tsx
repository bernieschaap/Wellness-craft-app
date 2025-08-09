
import React from 'react';
import HeartPulseIcon from '@/components/icons/HeartPulseIcon.tsx'; // Repurposed SparklesIcon

const Header = () => {
  return (
    <header className="py-6 text-center print:hidden">
      <div className="flex items-center justify-center gap-3">
        <HeartPulseIcon className="w-9 h-9 text-rose-400" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-fuchsia-500">
          WellnessCraft
        </h1>
      </div>
      <p className="mt-2 text-lg text-gray-400">Your AI-powered personal health planner.</p>
    </header>
  );
};

export default Header;
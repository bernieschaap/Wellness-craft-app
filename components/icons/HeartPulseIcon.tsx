import React from 'react';

const HeartPulseIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
    />
     <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.182 13.918l2.474-3.134a.75.75 0 011.06.023l2.474 3.134a.75.75 0 11-1.108.874l-1.85-2.338-1.85 2.338a.75.75 0 11-1.108-.874z"
     />
  </svg>
);

export default HeartPulseIcon;
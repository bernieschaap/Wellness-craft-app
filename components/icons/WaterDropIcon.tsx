import React from 'react';

const WaterDropIcon = ({ className }: { className?: string }) => (
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
            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V9.75c0-4.418-3.582-8.25-8.25-8.25S3.75 5.332 3.75 9.75v8.25A2.25 2.25 0 006 20.25z" 
        />
    </svg>
);

export default WaterDropIcon;
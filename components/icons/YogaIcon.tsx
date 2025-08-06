import React from 'react';

const YogaIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M4 20h4l1.5 -3l.5 -5.5l.5 2.5l1 2l1 -4l2 5l2 -6" />
        <path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M17 20l-2 -6l-2 -3l2.5 -2.5l4.5 5z" />
    </svg>
);

export default YogaIcon;
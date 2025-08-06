
import React from 'react';

const ToolsIcon = ({ className }: { className?: string }) => (
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
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 01.8 0l1.12 1.12a.563.563 0 010 .8l-2.471 2.471M11.42 15.17L5.877 21m5.543-5.83l-2.471-2.471a.563.563 0 00-.8 0l-1.12 1.12a.563.563 0 000 .8l2.471 2.471m5.543-5.83l-5.543-5.543a.563.563 0 010-.8l1.12-1.12a.563.563 0 01.8 0l5.543 5.543m-5.83 5.543l.001-.001" 
        />
    </svg>
);

export default ToolsIcon;

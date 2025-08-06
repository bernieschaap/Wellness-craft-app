
import React from 'react';

const DumbbellIcon = ({ className }: { className?: string }) => (
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
       <path d="M14.5 5h-5l-2.43 2.43a5 5 0 0 0 0 7.14l2.43 2.43h5l2.43 -2.43a5 5 0 0 0 0 -7.14l-2.43 -2.43z" />
       <path d="M4 12h-2" />
       <path d="M22 12h-2" />
       <path d="M12 4v-2" />
       <path d="M12 22v-2" />
    </svg>
);

export default DumbbellIcon;

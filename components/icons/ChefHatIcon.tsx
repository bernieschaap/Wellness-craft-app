import React from 'react';

const ChefHatIcon = ({ className }: { className?: string }) => (
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
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 3c1.918 0 3.52 1.35 3.94 3.06a4 4 0 0 1 2.06 3.94h-12a4 4 0 0 1 2.06 -3.94a4 4 0 0 1 3.94 -3.06z" />
        <path d="M6 10h12l-1.786 6.248a2 2 0 0 1 -1.957 1.752h-4.514a2 2 0 0 1 -1.957 -1.752l-1.786 -6.248z" />
        <path d="M6 10v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1" />
    </svg>
);

export default ChefHatIcon;
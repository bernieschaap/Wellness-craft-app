import React from 'react';

const PrinterIcon = ({ className }: { className?: string }) => (
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
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a.229.229 0 00.228.228h1.644a.229.229 0 00.228-.228l-.29-3.299a.229.229 0 00-.228-.228h-1.644a.229.229 0 00-.228.228l-.29 3.299z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18.75h12M6 18.75a.229.229 0 01-.228-.228v-3.299a.229.229 0 01.228-.228h12a.229.229 0 01.228.228v3.299a.229.229 0 01-.228.228M6 18.75v-3.299a.229.229 0 01-.228-.228V8.25c0-.578.47-1.048 1.048-1.048h10.404c.578 0 1.048.47 1.048 1.048v5.175a.229.229 0 01-.228.228v3.299"
    />
  </svg>
);

export default PrinterIcon;
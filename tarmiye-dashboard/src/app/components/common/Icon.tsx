// Icon.tsx
import React from 'react';

interface IconProps {
  icon: 'tabler:eye' | 'tabler:eye-off';
  fontSize?: string | number;
}

const Icon: React.FC<IconProps> = ({ icon, fontSize = '1.25rem' }) => {
  if (icon === 'tabler:eye') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={fontSize}
        height={fontSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (icon === 'tabler:eye-off') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={fontSize}
        height={fontSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.585 10.587a2 2 0 0 0 2.828 2.83" />
        <path d="M9.363 5.365A9.453 9.453 0 0 1 12 4c7 0 11 8 11 8a18.02 18.02 0 0 1-2.088 3.538" />
        <path d="M3.284 3.286L1 12s4 8 11 8a18.02 18.02 0 0 0 4.538-.619" />
        <line x1="3" y1="3" x2="21" y2="21" />
      </svg>
    );
  }

  return null;
};

export default Icon;

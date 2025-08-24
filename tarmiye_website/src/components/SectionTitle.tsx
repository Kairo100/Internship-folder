

import React from 'react';

interface SectionTitleProps {
  mainText: string;
  highlightText: string;
  alignment?: 'left' | 'center' | 'right';
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  mainText,
  highlightText,
  alignment = 'center',
}) => {
  const alignmentClass =
    alignment === 'left'
      ? 'text-left'
      : alignment === 'right'
      ? 'text-right'
      : 'text-center';

  return (
    <h2
      className={`text-3xl md:text-4xl lg:text-3xl font-extrabold ${alignmentClass} mb-12 md:mb-16`}
    >
      <span className="text-gray-800">{mainText} </span>
      <span className="text-primary inline-block border-b-4 border-primary pb-1">
        {highlightText}
      </span>
    </h2>
  );
};

export default SectionTitle;

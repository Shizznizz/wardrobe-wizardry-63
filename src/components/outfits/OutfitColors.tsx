
import React from 'react';

interface OutfitColorsProps {
  colors: string[];
  className?: string;
}

export const OutfitColors: React.FC<OutfitColorsProps> = ({ colors, className = '' }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      {colors.map((color, idx) => (
        <span 
          key={idx} 
          className="text-xs py-0.5 px-2 bg-white/10 rounded-full"
        >
          {color}
        </span>
      ))}
    </div>
  );
};

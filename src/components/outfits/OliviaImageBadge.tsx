
import React from 'react';
import { User } from 'lucide-react';

interface OliviaImageBadgeProps {
  isVisible: boolean;
  large?: boolean;
}

const OliviaImageBadge = ({ isVisible, large = false }: OliviaImageBadgeProps) => {
  if (!isVisible) return null;
  
  return (
    <div className={`absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center z-10 ${large ? 'py-1 px-3 text-sm' : ''}`}>
      <User className={`${large ? 'h-4 w-4' : 'h-3 w-3'} mr-1`} />
      Olivia's Image
    </div>
  );
};

export default OliviaImageBadge;

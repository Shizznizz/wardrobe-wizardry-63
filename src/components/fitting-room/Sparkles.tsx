
import React from 'react';
import { Sparkles as SparklesIcon } from 'lucide-react';

interface SparklesProps {
  className?: string;
}

const Sparkles = ({ className = "" }: SparklesProps) => {
  return <SparklesIcon className={className} />;
};

export default Sparkles;

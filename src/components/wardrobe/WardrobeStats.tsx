
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CTAButton } from '@/components/ui/cta-button';

interface WardrobeStatsProps {
  className?: string;
}

const WardrobeStats = ({ className }: WardrobeStatsProps) => {
  const navigate = useNavigate();

  const handleViewStats = () => {
    navigate('/style-planner#style-timeline');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CTAButton
            onClick={handleViewStats}
            variant="outline"
            size="sm"
            className={`bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 ${className}`}
            icon={<BarChart3 className="h-4 w-4" />}
          >
            View Stats
          </CTAButton>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-slate-800 border-slate-700 text-white"
          side="bottom"
        >
          See what you wear most and discover your wardrobe gaps
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WardrobeStats;


import React from 'react';
import { 
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const OutfitTooltip: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm text-blue-300/80 italic cursor-help">
              Trending outfit combos based on real wardrobes and seasonal trends
            </p>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700">
            <p className="text-sm">These outfits are curated based on popular combinations and current fashion trends</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

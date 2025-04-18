import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudSun, Layers, Sparkles, Clock, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WardrobeFiltersProps {
  smartFilter: string | null;
  onApplySmartFilter: (filterType: string, itemId?: string) => void;
  itemForPairing: string | null;
}

const WardrobeFilters = ({ 
  smartFilter, 
  onApplySmartFilter, 
  itemForPairing 
}: WardrobeFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="bg-slate-900/50 p-3 sm:px-4 sm:py-3 rounded-xl backdrop-blur-sm border border-white/5 shadow-md">
        <div className="flex items-center mb-3">
          <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
          <h3 className="text-sm font-medium text-white">Smart Filters</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs border-slate-700/50 hover:bg-slate-800/60",
                    smartFilter === 'weather' && "bg-slate-800/80 border-blue-500/50 text-blue-300"
                  )}
                  onClick={() => onApplySmartFilter('weather')}
                >
                  <CloudSun className="mr-1.5 h-3.5 w-3.5" />
                  Wear again in similar weather
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                <p className="text-xs">Find items suitable for today's weather conditions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "text-xs border-slate-700/50 hover:bg-slate-800/60",
                        smartFilter === 'pairing' && "bg-slate-800/80 border-green-500/50 text-green-300"
                      )}
                    >
                      <Layers className="mr-1.5 h-3.5 w-3.5" />
                      Works well with
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                  <p className="text-xs">Find items that pair well with a specific piece</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-md border-slate-700/50 text-white">
              <DropdownMenuItem onClick={() => onApplySmartFilter('olivia')} className="focus:bg-slate-800">
                Olivia's Suggestions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs border-slate-700/50 hover:bg-slate-800/60",
                    smartFilter === 'most-worn' && "bg-slate-800/80 border-yellow-500/50 text-yellow-300"
                  )}
                  onClick={() => onApplySmartFilter('most-worn')}
                >
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  Most Worn
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                <p className="text-xs">Filter by most worn items</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default WardrobeFilters;

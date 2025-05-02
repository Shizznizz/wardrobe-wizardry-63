
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Grid3X3, List, LayoutGrid } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WardrobeControlsProps {
  viewMode: 'grid' | 'list';
  showCompactView: boolean;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCompactViewChange: (show: boolean) => void;
}

const WardrobeControls = ({
  viewMode,
  showCompactView,
  onViewModeChange,
  onCompactViewChange,
}: WardrobeControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md ml-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => {
                if (value === 'grid' || value === 'list') {
                  onViewModeChange(value);
                }
              }}
              className="bg-slate-900/60 p-1.5 rounded-full backdrop-blur-sm border border-white/10 shadow-md flex-1 sm:flex-none"
            >
              <ToggleGroupItem 
                value="grid" 
                className="rounded-full h-9 w-9 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gradient-to-r data-[state=on]:from-indigo-600 data-[state=on]:to-purple-600 transition-all duration-300"
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="list" 
                className="rounded-full h-9 w-9 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gradient-to-r data-[state=on]:from-indigo-600 data-[state=on]:to-purple-600 transition-all duration-300"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
            <p className="text-xs">Toggle between grid and list view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {viewMode === 'grid' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 pl-3 pr-4 rounded-full backdrop-blur-sm border border-white/10 shadow-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 group flex-1 sm:flex-none justify-center">
                <Switch 
                  id="compact-view" 
                  checked={showCompactView} 
                  onCheckedChange={onCompactViewChange}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-slate-700/60 transition-colors duration-300"
                />
                <Label 
                  htmlFor="compact-view" 
                  className="text-xs font-medium text-gray-300 cursor-pointer transition-colors group-hover:text-white flex items-center gap-1.5"
                >
                  <LayoutGrid className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-300 transition-colors" />
                  Compact View
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900/90 border-white/10 text-white">
              <p className="text-xs">Show simplified view with fewer tags and smaller images</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default WardrobeControls;

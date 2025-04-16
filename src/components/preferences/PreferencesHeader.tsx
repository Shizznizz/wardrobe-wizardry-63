
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PreferencesHeader = () => {
  return (
    <div className="px-6 py-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <span className="text-white text-xs">OB</span>
        </div>
        <p className="text-sm text-white">
          Let's shape your style preferences together 💜
        </p>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="rounded-full p-1 hover:bg-white/10 cursor-pointer">
              <Info className="h-4 w-4 text-white/70" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs max-w-xs">
              Olivia will use your preferences to create outfits tailored to your style and needs
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PreferencesHeader;

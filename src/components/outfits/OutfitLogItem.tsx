
import { Clock, Cloud, Droplets, Sun, Wind, Snowflake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Outfit } from '@/lib/types';

type OutfitLog = {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: string;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
};

interface OutfitLogItemProps {
  log: OutfitLog;
  outfit: Outfit;
  onClick: () => void;
}

const OutfitLogItem = ({ log, outfit, onClick }: OutfitLogItemProps) => {
  // Get weather icon based on condition
  const getWeatherIcon = () => {
    switch (log.weatherCondition) {
      case 'sunny':
        return <Sun className="h-3.5 w-3.5 text-amber-400" />;
      case 'cloudy':
        return <Cloud className="h-3.5 w-3.5 text-slate-400" />;
      case 'rainy':
        return <Droplets className="h-3.5 w-3.5 text-blue-400" />;
      case 'snowy':
        return <Snowflake className="h-3.5 w-3.5 text-blue-200" />;
      case 'windy':
        return <Wind className="h-3.5 w-3.5 text-slate-300" />;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className="bg-slate-800/80 p-3 rounded-md border border-purple-500/20 hover:bg-slate-800 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <p className="font-medium text-white">{outfit.name}</p>
      
      <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span className="capitalize">{log.timeOfDay}</span>
        </div>
        
        {log.weatherCondition && (
          <div className="flex items-center gap-1">
            {getWeatherIcon()}
            <span className="capitalize">{log.weatherCondition}</span>
          </div>
        )}
        
        {log.temperature && (
          <div className="text-slate-400">{log.temperature}</div>
        )}
      </div>
      
      <div className="flex gap-1 mt-2 flex-wrap">
        {outfit.occasions.map(occasion => (
          <Badge key={occasion} variant="outline" className="text-xs">
            {occasion}
          </Badge>
        ))}
      </div>
      
      {log.notes && (
        <p className="text-xs text-slate-400 mt-2 line-clamp-1">{log.notes}</p>
      )}
    </div>
  );
};

export default OutfitLogItem;

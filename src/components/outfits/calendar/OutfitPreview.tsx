
import { Outfit } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt } from 'lucide-react';

interface OutfitPreviewProps {
  outfit: Outfit;
  isCompact?: boolean;
}

const OutfitPreview = ({ outfit, isCompact = false }: OutfitPreviewProps) => {
  const imageUrl = outfit.tags?.find(tag => tag?.startsWith('http'));
  const hasImage = outfit.tags?.includes('image');
  
  // Handle both string and array types for season
  const seasons = Array.isArray(outfit.season) 
    ? outfit.season
    : outfit.season 
      ? [outfit.season] 
      : outfit.seasons || [];

  return (
    <Card className="bg-slate-800/50 overflow-hidden border-slate-700/50 hover:border-slate-600/50 transition-colors">
      <div className={`flex ${isCompact ? 'items-center p-2' : 'flex-col p-3'} gap-2`}>
        {hasImage && imageUrl ? (
          <img 
            src={imageUrl} 
            alt={outfit.name}
            className={`
              rounded-md object-cover
              ${isCompact ? 'w-12 h-12' : 'w-full h-32'}
            `}
          />
        ) : (
          <div className={`
            bg-slate-700/50 rounded-md flex items-center justify-center
            ${isCompact ? 'w-12 h-12' : 'w-full h-32'}
          `}>
            <Shirt className="w-6 h-6 text-slate-400" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h4 className="font-medium text-sm text-white">{outfit.name}</h4>
          <div className="flex flex-wrap gap-1">
            {seasons.map(season => (
              <Badge 
                key={season} 
                variant="secondary" 
                className="text-xs bg-slate-700/50"
              >
                {season}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OutfitPreview;

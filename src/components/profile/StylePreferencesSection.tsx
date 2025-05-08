
import React from 'react';
import { Label } from '@/components/ui/label';
import { UserPreferences } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface StylePreferencesSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

// Predefined style tags
const styleOptions = [
  'Casual', 'Formal', 'Business', 'Sporty', 'Bohemian', 'Minimalist', 
  'Vintage', 'Streetwear', 'Glamorous', 'Preppy', 'Edgy', 'Romantic'
];

// Predefined color options
const colorOptions = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Navy', value: '#000080' },
  { name: 'Grey', value: '#808080' },
  { name: 'Beige', value: '#F5F5DC' }
];

// Predefined occasion options
const occasionOptions = [
  'Work', 'Casual', 'Date Night', 'Party', 'Workout', 
  'Travel', 'Beach', 'Formal Event', 'Outdoor', 'Lounge'
];

const StylePreferencesSection = ({ preferences, setPreferences }: StylePreferencesSectionProps) => {
  const handleAddStyle = (style: string) => {
    if (preferences.favoriteStyles?.includes(style)) return;
    
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteStyles: [...(prev.favoriteStyles || []), style]
      };
    });
  };
  
  const handleRemoveStyle = (style: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteStyles: prev.favoriteStyles?.filter(s => s !== style) || []
      };
    });
  };
  
  const handleAddColor = (color: string) => {
    if (preferences.favoriteColors?.includes(color)) return;
    
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: [...(prev.favoriteColors || []), color]
      };
    });
  };
  
  const handleRemoveColor = (color: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: prev.favoriteColors?.filter(c => c !== color) || []
      };
    });
  };
  
  const handleToggleOccasion = (occasion: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      
      const occasionPreferences = prev.occasionPreferences || [];
      
      if (occasionPreferences.includes(occasion)) {
        return {
          ...prev,
          occasionPreferences: occasionPreferences.filter(o => o !== occasion)
        };
      } else {
        return {
          ...prev,
          occasionPreferences: [...occasionPreferences, occasion]
        };
      }
    });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Style Preferences</h3>
        <p className="text-white/70 text-sm">
          Your style preferences help Olivia provide tailored outfit recommendations and styling advice.
        </p>
      </div>
      
      {/* Favorite Style Tags */}
      <div className="space-y-4">
        <Label>Favorite Style Tags</Label>
        
        <div className="flex flex-wrap gap-2">
          {preferences.favoriteStyles?.map(style => (
            <Badge 
              key={style} 
              className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 px-3 py-1 flex items-center gap-1"
            >
              {style}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveStyle(style)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-white/70 mb-2">Add style tags:</p>
          <div className="flex flex-wrap gap-2">
            {styleOptions
              .filter(style => !preferences.favoriteStyles?.includes(style))
              .map(style => (
                <Badge 
                  key={style} 
                  className="bg-white/10 hover:bg-white/20 cursor-pointer"
                  onClick={() => handleAddStyle(style)}
                >
                  {style}
                </Badge>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* Favorite Colors */}
      <div className="space-y-4">
        <Label>Favorite Colors</Label>
        
        <div className="flex flex-wrap gap-3">
          {preferences.favoriteColors?.map(color => {
            const colorInfo = colorOptions.find(c => c.value === color);
            return (
              <div 
                key={color} 
                className="relative group"
                title={colorInfo?.name || color}
              >
                <div 
                  className="w-8 h-8 rounded-full border border-white/30 cursor-pointer"
                  style={{ backgroundColor: color }}
                ></div>
                <button 
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveColor(color)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-white/70 mb-2">Add colors:</p>
          <div className="flex flex-wrap gap-3">
            {colorOptions
              .filter(color => !preferences.favoriteColors?.includes(color.value))
              .map(color => (
                <div 
                  key={color.value} 
                  className="w-8 h-8 rounded-full border border-white/30 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleAddColor(color.value)}
                  title={color.name}
                ></div>
              ))
            }
          </div>
        </div>
      </div>
      
      {/* Occasions */}
      <div className="space-y-4">
        <Label>Occasions You Dress For</Label>
        
        <div className="flex flex-wrap gap-2">
          {occasionOptions.map(occasion => {
            const isSelected = preferences.occasionPreferences?.includes(occasion);
            return (
              <Badge 
                key={occasion} 
                className={`cursor-pointer ${isSelected 
                  ? 'bg-purple-500/30 text-purple-200 hover:bg-purple-500/40' 
                  : 'bg-white/10 hover:bg-white/20'}`}
                onClick={() => handleToggleOccasion(occasion)}
              >
                {occasion}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StylePreferencesSection;

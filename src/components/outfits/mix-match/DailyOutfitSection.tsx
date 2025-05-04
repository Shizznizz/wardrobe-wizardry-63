
import React from 'react';
import { Outfit, ClothingItem, WeatherInfo } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, CloudSun } from 'lucide-react';

interface DailyOutfitSectionProps {
  weather?: WeatherInfo;
  currentOutfit: Outfit | null;
  clothingItems: ClothingItem[];
  situation?: string;
}

const DailyOutfitSection = ({
  weather,
  currentOutfit,
  clothingItems,
  situation = 'casual'
}: DailyOutfitSectionProps) => {
  if (!currentOutfit) {
    return (
      <div className="text-center p-10 bg-slate-800/50 rounded-xl border border-white/10">
        <p className="text-white/70">Loading your personalized outfit recommendation...</p>
      </div>
    );
  }

  // Filter clothing items based on current outfit's items array
  const outfitItems = clothingItems.filter(item => 
    currentOutfit.items.includes(item.id)
  );

  // Group items by type for better presentation
  const itemsByType: Record<string, ClothingItem[]> = {};
  outfitItems.forEach(item => {
    // Normalize clothing types to broader categories
    let normalizedType = item.type.toLowerCase();
    
    // Map similar types to common categories
    if (['shirt', 'blouse', 'top', 't-shirt'].includes(normalizedType)) {
      normalizedType = 'top';
    } else if (['pants', 'jeans', 'shorts', 'skirt', 'trousers'].includes(normalizedType)) {
      normalizedType = 'bottom';
    } else if (['shoes', 'sneakers', 'boots', 'sandals'].includes(normalizedType)) {
      normalizedType = 'footwear';
    } else if (['jacket', 'coat', 'sweater', 'cardigan'].includes(normalizedType)) {
      normalizedType = 'outerwear';
    }
    
    if (!itemsByType[normalizedType]) {
      itemsByType[normalizedType] = [];
    }
    itemsByType[normalizedType].push(item);
  });

  const hasType = (type: string): boolean => !!itemsByType[type]?.length;

  // Build outfit name from components if not already specified
  const outfitName = currentOutfit.name || 
    `${situation.charAt(0).toUpperCase() + situation.slice(1)} ${
      weather ? `${weather.temperature}°C` : ''
    } Outfit`;

  // Show placeholder image if no outfit image is available
  const placeholderImage = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=500&h=600";
  
  return (
    <Card className="bg-gradient-to-br from-slate-800/70 to-purple-900/20 border-0 shadow-xl overflow-hidden border-white/10">
      <CardContent className="p-0 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left side - Outfit image */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
            
            {/* Display outfit image or placeholder */}
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${
                  (outfitItems[0]?.imageUrl || outfitItems[0]?.image) ? 
                  (outfitItems[0]?.imageUrl || outfitItems[0]?.image) : 
                  placeholderImage
                })` 
              }}>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h2 className="text-2xl font-bold text-white mb-2">{outfitName}</h2>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOutfit.tags?.map((tag, idx) => (
                  <Badge key={idx} 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white"
                  >
                    {tag}
                  </Badge>
                ))}
                
                {currentOutfit.seasons?.map((season, idx) => (
                  <Badge key={`season-${idx}`}
                    variant="outline"
                    className="bg-blue-500/20 border-blue-500/30 text-blue-200"
                  >
                    {season}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right side - Outfit details */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Key Pieces</h3>
              
              {weather && (
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-2 bg-slate-800/80 border-white/10 text-sm"
                >
                  <CloudSun className="h-3.5 w-3.5 text-yellow-300" />
                  <span>
                    {weather.temperature}°C {weather.condition}
                  </span>
                </Badge>
              )}
            </div>
            
            <ul className="space-y-4">
              {hasType('top') && itemsByType['top'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white">
                  <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                  <span>{item.color.charAt(0).toUpperCase() + item.color.slice(1)} {item.name}</span>
                </li>
              ))}
              
              {hasType('bottom') && itemsByType['bottom'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white">
                  <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                  <span>{item.color.charAt(0).toUpperCase() + item.color.slice(1)} {item.name}</span>
                </li>
              ))}
              
              {hasType('footwear') && itemsByType['footwear'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white">
                  <div className="h-2 w-2 rounded-full bg-pink-400"></div>
                  <span>{item.color.charAt(0).toUpperCase() + item.color.slice(1)} {item.name}</span>
                </li>
              ))}
              
              {hasType('outerwear') && itemsByType['outerwear'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <span>{item.color.charAt(0).toUpperCase() + item.color.slice(1)} {item.name}</span>
                </li>
              ))}
              
              {/* Show other item types if they exist */}
              {Object.entries(itemsByType)
                .filter(([type]) => !['top', 'bottom', 'footwear', 'outerwear'].includes(type))
                .map(([type, items]) => 
                  items.map((item, idx) => (
                    <li key={`${type}-${idx}`} className="flex items-center gap-3 text-white">
                      <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                      <span>{item.color.charAt(0).toUpperCase() + item.color.slice(1)} {item.name}</span>
                    </li>
                  ))
                )}
                
              {/* If no items were found, show a message */}
              {outfitItems.length === 0 && (
                <li className="text-white/70">
                  <em>Add more items to your wardrobe for personalized outfit details</em>
                </li>
              )}
            </ul>
            
            <div className="pt-4">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                {weather?.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span>{weather.city}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span>Updated today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyOutfitSection;

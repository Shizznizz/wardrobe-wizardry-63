
import { useState } from 'react';
import { Palette, Shirt, InfoCircle, HelpCircle } from 'lucide-react';
import { UserPreferences, ClothingColor } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorStyleSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

const ColorStyleSection = ({ preferences, setPreferences }: ColorStyleSectionProps) => {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  
  const handleColorToggle = (color: ClothingColor) => {
    setPreferences(prev => {
      const newColors = prev.favoriteColors.includes(color)
        ? prev.favoriteColors.filter(c => c !== color)
        : [...prev.favoriteColors, color];
      
      return {
        ...prev,
        favoriteColors: newColors
      };
    });
  };

  const handleStyleToggle = (style: string) => {
    setPreferences(prev => {
      const newStyles = prev.favoriteStyles.includes(style)
        ? prev.favoriteStyles.filter(s => s !== style)
        : [...prev.favoriteStyles, style];
      
      return {
        ...prev,
        favoriteStyles: newStyles
      };
    });
  };
  
  // Color swatches definition with visual representations
  const colors: { label: string; value: ClothingColor; bgClass: string }[] = [
    { label: 'Black', value: 'black', bgClass: 'bg-black' },
    { label: 'White', value: 'white', bgClass: 'bg-white' },
    { label: 'Gray', value: 'gray', bgClass: 'bg-gray-400' },
    { label: 'Red', value: 'red', bgClass: 'bg-red-500' },
    { label: 'Blue', value: 'blue', bgClass: 'bg-blue-500' },
    { label: 'Green', value: 'green', bgClass: 'bg-green-500' },
    { label: 'Yellow', value: 'yellow', bgClass: 'bg-yellow-400' },
    { label: 'Purple', value: 'purple', bgClass: 'bg-purple-500' },
    { label: 'Pink', value: 'pink', bgClass: 'bg-pink-400' },
    { label: 'Orange', value: 'orange', bgClass: 'bg-orange-500' },
    { label: 'Brown', value: 'brown', bgClass: 'bg-amber-700' },
    { label: 'Multicolor', value: 'multicolor', bgClass: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500' },
  ];
  
  // Style definitions with descriptions and icons
  const styles = [
    { 
      name: 'casual', 
      description: 'Comfortable, everyday clothing with relaxed fits and simple designs', 
      example: '👕 👖' 
    },
    { 
      name: 'formal', 
      description: 'Polished attire for professional or special occasions', 
      example: '👔 👗' 
    },
    { 
      name: 'business casual', 
      description: 'Professional yet relaxed style suitable for modern workplaces',
      example: '🧥 👔' 
    },
    { 
      name: 'smart casual', 
      description: 'Neat, conventional, yet relatively informal style',
      example: '👚 👖' 
    },
    { 
      name: 'sporty', 
      description: 'Athletic-inspired clothing suitable for active lifestyles',
      example: '🏃‍♀️ 👟' 
    },
    { 
      name: 'bohemian', 
      description: 'Artistic, free-spirited style with natural fabrics and patterns',
      example: '👒 👗' 
    },
    { 
      name: 'vintage', 
      description: 'Inspired by fashion trends from previous decades',
      example: '👗 👜' 
    },
    { 
      name: 'minimalist', 
      description: 'Clean lines, simple silhouettes, and neutral colors',
      example: '👕 👖' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-400" />
          <h3 className="text-base font-medium text-white">Color Preferences</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <div 
              key={color.value}
              onClick={() => handleColorToggle(color.value)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                preferences.favoriteColors.includes(color.value) 
                  ? "bg-slate-800/80 border border-purple-500/50" 
                  : "bg-slate-900/50 border border-white/5 hover:bg-slate-800/50"
              )}
            >
              <div 
                className={cn(
                  "w-6 h-6 rounded-full border shadow-sm", 
                  color.bgClass,
                  color.value === 'white' ? "border-gray-300" : "border-transparent"
                )} 
              />
              <Label className="cursor-pointer text-sm font-medium text-white/90">
                {color.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shirt className="h-5 w-5 text-pink-400" />
          <h3 className="text-base font-medium text-white">Style Preferences</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => (
            <TooltipProvider key={style.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    onClick={() => handleStyleToggle(style.name)}
                    onMouseEnter={() => setHoveredStyle(style.name)}
                    onMouseLeave={() => setHoveredStyle(null)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group",
                      preferences.favoriteStyles.includes(style.name) 
                        ? "bg-slate-800/80 border border-pink-500/50" 
                        : "bg-slate-900/50 border border-white/5 hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg opacity-80">{style.example}</span>
                      <Label className="cursor-pointer text-sm font-medium capitalize text-white/90">
                        {style.name}
                      </Label>
                    </div>
                    <HelpCircle className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="text-xs">
                    <p>{style.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorStyleSection;

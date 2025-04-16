
import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClothingColor, PersonalityTag, UserPreferences } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColorStyleSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

const ColorStyleSection = ({ preferences, setPreferences }: ColorStyleSectionProps) => {
  const [expandedColors, setExpandedColors] = useState(false);
  const [expandedStyles, setExpandedStyles] = useState(false);
  const [expandedPersonality, setExpandedPersonality] = useState(false);

  const clothingColors: ClothingColor[] = [
    'black', 'white', 'gray', 'red', 'blue', 'green', 'yellow',
    'purple', 'pink', 'orange', 'brown', 'navy', 'multicolor'
  ];

  const clothingStyles = [
    'Streetwear', 'Bohemian', 'Casual', 'Chic', 'Classic', 'Edgy',
    'Elegant', 'Glamorous', 'Minimalist', 'Modern', 'Preppy', 'Romantic',
    'Vintage'
  ];

  const personalityTags: PersonalityTag[] = [
    'minimalist', 'bold', 'trendy', 'classic', 'casual', 'formal',
    'sporty', 'elegant', 'vintage', 'bohemian', 'preppy', 'artistic'
  ];

  const handleColorToggle = (color: ClothingColor) => {
    setPreferences(prev => {
      const currentColors = prev.favoriteColors || [];
      const newColors = currentColors.includes(color)
        ? currentColors.filter(c => c !== color)
        : [...currentColors, color];
      
      return {
        ...prev,
        favoriteColors: newColors
      };
    });
  };

  const handleStyleToggle = (style: string) => {
    setPreferences(prev => {
      const currentStyles = prev.favoriteStyles || [];
      const newStyles = currentStyles.includes(style)
        ? currentStyles.filter(s => s !== style)
        : [...currentStyles, style];
      
      return {
        ...prev,
        favoriteStyles: newStyles
      };
    });
  };

  const handlePersonalityTagToggle = (tag: PersonalityTag) => {
    setPreferences(prev => {
      const currentTags = prev.personalityTags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      
      return {
        ...prev,
        personalityTags: newTags
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/40 rounded-xl p-4 border border-purple-500/20">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setExpandedColors(!expandedColors)}
        >
          <h3 className="text-lg font-medium text-white flex items-center">
            <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-2"></span>
            Favorite Colors
          </h3>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {expandedColors ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        {expandedColors && (
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
            {clothingColors.map(color => (
              <div key={color} className="flex flex-col items-center">
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 ${
                    preferences.favoriteColors?.includes(color)
                      ? 'border-white'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color === 'multicolor' 
                    ? 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'
                    : color }}
                  onClick={() => handleColorToggle(color)}
                >
                  {color === 'multicolor' && (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                  )}
                </button>
                <span className="text-xs text-gray-300 mt-1 capitalize">{color}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800/40 rounded-xl p-4 border border-purple-500/20">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setExpandedStyles(!expandedStyles)}
        >
          <h3 className="text-lg font-medium text-white flex items-center">
            <span className="inline-block w-4 h-4 rounded mr-2 bg-gradient-to-r from-blue-500 to-indigo-500"></span>
            Clothing Styles
          </h3>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {expandedStyles ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        {expandedStyles && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {clothingStyles.map(style => (
              <TooltipProvider key={style}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={`px-3 py-2 rounded-md text-sm ${
                        preferences.favoriteStyles?.includes(style)
                          ? 'bg-indigo-500/40 text-white'
                          : 'bg-slate-700/40 text-gray-300 hover:bg-slate-700/60'
                      }`}
                      onClick={() => handleStyleToggle(style)}
                    >
                      {style}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                    <p>
                      {style === 'Streetwear' && 'Urban-inspired casual wear for everyday comfort'}
                      {style === 'Bohemian' && 'Free-spirited, artistic with natural fabrics'}
                      {style === 'Casual' && 'Relaxed, comfortable everyday clothing'}
                      {style === 'Chic' && 'Stylish and sophisticated with a modern edge'}
                      {style === 'Classic' && 'Timeless, traditional clothing that never goes out of style'}
                      {style === 'Edgy' && 'Bold, unconventional styles with attitude'}
                      {style === 'Elegant' && 'Graceful, refined styles for a sophisticated look'}
                      {style === 'Glamorous' && 'Eye-catching, luxurious outfits designed to stand out'}
                      {style === 'Minimalist' && 'Simple, clean aesthetics with minimal details'}
                      {style === 'Modern' && 'Contemporary styles reflecting current fashion trends'}
                      {style === 'Preppy' && 'Neat, traditional style associated with private preparatory schools'}
                      {style === 'Romantic' && 'Soft, feminine styles with delicate details'}
                      {style === 'Vintage' && 'Retro clothing inspired by previous eras'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800/40 rounded-xl p-4 border border-purple-500/20">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setExpandedPersonality(!expandedPersonality)}
        >
          <h3 className="text-lg font-medium text-white flex items-center">
            <span className="inline-block w-4 h-4 rounded mr-2 bg-gradient-to-r from-pink-500 to-orange-500"></span>
            Style Personality
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2">
                    <Info className="h-4 w-4 text-gray-400" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 border-slate-700 text-white max-w-xs">
                  <p>Your style personality helps Olivia understand your preferences on a deeper level to make better outfit recommendations.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {expandedPersonality ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        {expandedPersonality && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {personalityTags.map(tag => (
              <TooltipProvider key={tag}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={`px-3 py-2 rounded-md text-sm ${
                        preferences.personalityTags?.includes(tag)
                          ? 'bg-pink-500/40 text-white'
                          : 'bg-slate-700/40 text-gray-300 hover:bg-slate-700/60'
                      }`}
                      onClick={() => handlePersonalityTagToggle(tag)}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white">
                    <p>
                      {tag === 'minimalist' && 'Clean lines, neutral tones, timeless silhouettes'}
                      {tag === 'bold' && 'Strong colors, statement pieces, confidence in standing out'}
                      {tag === 'trendy' && 'Up-to-date with current fashion, enjoys new styles'}
                      {tag === 'classic' && 'Timeless quality pieces that never go out of style'}
                      {tag === 'casual' && 'Relaxed, comfortable, everyday wear'}
                      {tag === 'formal' && 'Polished, structured, sophisticated aesthetic'}
                      {tag === 'sporty' && 'Athletic inspired, functional, performance-oriented'}
                      {tag === 'elegant' && 'Refined, graceful, luxurious materials'}
                      {tag === 'vintage' && 'Nostalgic pieces, retro inspirations'}
                      {tag === 'bohemian' && 'Free-spirited, artistic, natural materials'}
                      {tag === 'preppy' && 'Clean-cut, collegiate, traditional style'}
                      {tag === 'artistic' && 'Creative, unique, unconventional combinations'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorStyleSection;

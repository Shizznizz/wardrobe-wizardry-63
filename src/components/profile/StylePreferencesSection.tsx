
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertCircle } from 'lucide-react';
import { UserPreferences } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SeasonalPreferences from '@/components/preferences/SeasonalPreferences';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';

// Common style tags for autocomplete
const commonStyleTags = [
  { value: 'casual', label: 'Casual' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'preppy', label: 'Preppy' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'sporty', label: 'Sporty' },
  { value: 'glam', label: 'Glam' },
  { value: 'athleisure', label: 'Athleisure' },
  { value: 'retro', label: 'Retro' },
  { value: 'grunge', label: 'Grunge' },
  { value: 'punk', label: 'Punk' },
  { value: 'hipster', label: 'Hipster' },
  { value: 'business', label: 'Business' },
  { value: 'formal', label: 'Formal' }
];

// Common colors for autocomplete
const commonColors = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'orange', label: 'Orange' },
  { value: 'brown', label: 'Brown' },
  { value: 'gray', label: 'Gray' },
  { value: 'navy', label: 'Navy' },
  { value: 'teal', label: 'Teal' },
  { value: 'maroon', label: 'Maroon' },
  { value: 'olive', label: 'Olive' },
  { value: 'beige', label: 'Beige' },
  { value: 'turquoise', label: 'Turquoise' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'coral', label: 'Coral' }
];

// Common occasions for autocomplete
const commonOccasions = [
  { value: 'work', label: 'Work' },
  { value: 'date night', label: 'Date Night' },
  { value: 'beach', label: 'Beach' },
  { value: 'party', label: 'Party' },
  { value: 'casual outing', label: 'Casual Outing' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'interview', label: 'Interview' },
  { value: 'formal event', label: 'Formal Event' },
  { value: 'gym', label: 'Gym' },
  { value: 'travel', label: 'Travel' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'concert', label: 'Concert' },
  { value: 'brunch', label: 'Brunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'clubbing', label: 'Clubbing' },
  { value: 'business meeting', label: 'Business Meeting' }
];

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

interface StylePreferencesSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const StylePreferencesSection = ({ preferences, setPreferences }: StylePreferencesSectionProps) => {
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const [tagError, setTagError] = useState('');
  const [colorError, setColorError] = useState('');
  const [occasionError, setOccasionError] = useState('');
  
  // Create filtered lists based on what's already selected
  const [availableStyleTags, setAvailableStyleTags] = useState(commonStyleTags);
  const [availableColors, setAvailableColors] = useState(commonColors);
  const [availableOccasions, setAvailableOccasions] = useState(commonOccasions);

  // Update available options when preferences change
  useEffect(() => {
    // Filter out already selected items
    setAvailableStyleTags(
      commonStyleTags.filter(
        tag => !preferences.personalityTags?.some(
          existingTag => existingTag.toLowerCase() === tag.value.toLowerCase()
        )
      )
    );
    
    setAvailableColors(
      commonColors.filter(
        color => !preferences.favoriteColors?.some(
          existingColor => existingColor.toLowerCase() === color.value.toLowerCase()
        )
      )
    );
    
    setAvailableOccasions(
      commonOccasions.filter(
        occasion => !preferences.occasionPreferences?.some(
          existingOccasion => existingOccasion.toLowerCase() === occasion.value.toLowerCase()
        )
      )
    );
  }, [preferences.personalityTags, preferences.favoriteColors, preferences.occasionPreferences]);
  
  const isTagDuplicate = (tag: string): boolean => {
    return preferences.personalityTags?.some(
      existingTag => existingTag.toLowerCase() === tag.toLowerCase()
    ) || false;
  };
  
  const isColorDuplicate = (color: string): boolean => {
    return preferences.favoriteColors?.some(
      existingColor => existingColor.toLowerCase() === color.toLowerCase()
    ) || false;
  };
  
  const isOccasionDuplicate = (occasion: string): boolean => {
    return preferences.occasionPreferences?.some(
      existingOccasion => existingOccasion.toLowerCase() === occasion.toLowerCase()
    ) || false;
  };
  
  const addTag = () => {
    if (!newTag.trim()) {
      return;
    }
    
    if (isTagDuplicate(newTag)) {
      setTagError("You've already added this tag");
      setTimeout(() => setTagError(''), 3000);
      return;
    }
    
    setTagError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        personalityTags: [...(prev.personalityTags || []), capitalizeFirstLetter(newTag.trim())]
      };
    });
    setNewTag('');
  };
  
  const removeTag = (tag: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        personalityTags: (prev.personalityTags || []).filter(t => t !== tag)
      };
    });
  };
  
  const addColor = () => {
    if (!newColor.trim()) {
      return;
    }
    
    if (isColorDuplicate(newColor)) {
      setColorError("You've already added this color");
      setTimeout(() => setColorError(''), 3000);
      return;
    }
    
    // Validate if it's in the common colors list or a custom entry
    const isValidColor = commonColors.some(
      color => color.value.toLowerCase() === newColor.toLowerCase()
    );
    
    if (!isValidColor) {
      setColorError("Please enter a valid color name");
      setTimeout(() => setColorError(''), 3000);
      return;
    }
    
    setColorError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: [...(prev.favoriteColors || []), capitalizeFirstLetter(newColor.trim())]
      };
    });
    setNewColor('');
  };
  
  const removeColor = (color: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: (prev.favoriteColors || []).filter(c => c !== color)
      };
    });
  };
  
  const addOccasion = () => {
    if (!newOccasion.trim()) {
      return;
    }
    
    if (isOccasionDuplicate(newOccasion)) {
      setOccasionError("You've already added this occasion");
      setTimeout(() => setOccasionError(''), 3000);
      return;
    }
    
    setOccasionError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        occasionPreferences: [...(prev.occasionPreferences || []), capitalizeFirstLetter(newOccasion.trim())]
      };
    });
    setNewOccasion('');
  };
  
  const removeOccasion = (occasion: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        occasionPreferences: (prev.occasionPreferences || []).filter(o => o !== occasion)
      };
    });
  };
  
  const setBodyType = (value: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        bodyType: value
      };
    });
  };
  
  const handleSeasonalPreferencesChange = (seasonalPrefs: UserPreferences['seasonalPreferences']) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        seasonalPreferences: seasonalPrefs
      };
    });
  };

  const handleTagSelect = (value: string) => {
    if (value && !isTagDuplicate(value)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          personalityTags: [...(prev.personalityTags || []), capitalizeFirstLetter(value)]
        };
      });
    }
  };

  const handleColorSelect = (value: string) => {
    if (value && !isColorDuplicate(value)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          favoriteColors: [...(prev.favoriteColors || []), capitalizeFirstLetter(value)]
        };
      });
    }
  };

  const handleOccasionSelect = (value: string) => {
    if (value && !isOccasionDuplicate(value)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          occasionPreferences: [...(prev.occasionPreferences || []), capitalizeFirstLetter(value)]
        };
      });
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Style Tags Section */}
      <div className="space-y-4">
        <Label>Favorite Style Tags</Label>
        <div className="flex flex-col gap-2">
          <Combobox
            items={availableStyleTags}
            value=""
            onChange={handleTagSelect}
            placeholder="Select or type a style tag (e.g. casual, elegant)"
            searchPlaceholder="Search style tags..."
            emptyMessage="No matching style tags found."
            className="w-full bg-slate-950/50 border-white/10"
          />
          <div className="flex items-center">
            <Input
              placeholder="Or add a custom style tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="bg-slate-950/50 border-white/10 flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <TooltipProvider>
              <Tooltip open={!!tagError} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={addTag}
                    className="ml-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                {tagError && (
                  <TooltipContent side="top" className="bg-red-500 border-red-600">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {tagError}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {preferences.personalityTags?.map((tag, index) => (
            <Badge key={index} className="px-3 py-1 bg-slate-800 hover:bg-slate-700">
              {tag}
              <X
                className="h-3 w-3 ml-2 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Colors Section */}
      <div className="space-y-4">
        <Label>Favorite Colors</Label>
        <div className="flex flex-col gap-2">
          <Combobox
            items={availableColors}
            value=""
            onChange={handleColorSelect}
            placeholder="Select or type a color (e.g. blue, emerald green)"
            searchPlaceholder="Search colors..."
            emptyMessage="No matching colors found."
            className="w-full bg-slate-950/50 border-white/10"
          />
          <div className="flex items-center">
            <Input
              placeholder="Or add a custom color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="bg-slate-950/50 border-white/10 flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor();
                }
              }}
            />
            <TooltipProvider>
              <Tooltip open={!!colorError} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={addColor}
                    className="ml-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                {colorError && (
                  <TooltipContent side="top" className="bg-red-500 border-red-600">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {colorError}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {preferences.favoriteColors?.map((color, index) => (
            <Badge 
              key={index} 
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700"
            >
              {color}
              <X
                className="h-3 w-3 ml-2 cursor-pointer"
                onClick={() => removeColor(color)}
              />
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Occasions Section */}
      <div className="space-y-4">
        <Label>Occasions You Dress For</Label>
        <div className="flex flex-col gap-2">
          <Combobox
            items={availableOccasions}
            value=""
            onChange={handleOccasionSelect}
            placeholder="Select or type an occasion (e.g. work, date night)"
            searchPlaceholder="Search occasions..."
            emptyMessage="No matching occasions found."
            className="w-full bg-slate-950/50 border-white/10"
          />
          <div className="flex items-center">
            <Input
              placeholder="Or add a custom occasion"
              value={newOccasion}
              onChange={(e) => setNewOccasion(e.target.value)}
              className="bg-slate-950/50 border-white/10 flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOccasion();
                }
              }}
            />
            <TooltipProvider>
              <Tooltip open={!!occasionError} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={addOccasion}
                    className="ml-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                {occasionError && (
                  <TooltipContent side="top" className="bg-red-500 border-red-600">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {occasionError}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {preferences.occasionPreferences?.map((occasion, index) => (
            <Badge key={index} className="px-3 py-1 bg-slate-800 hover:bg-slate-700">
              {occasion}
              <X
                className="h-3 w-3 ml-2 cursor-pointer"
                onClick={() => removeOccasion(occasion)}
              />
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Body Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="bodyType">Body Type</Label>
        <Select value={preferences.bodyType || 'not-specified'} onValueChange={setBodyType}>
          <SelectTrigger id="bodyType" className="bg-slate-950/50 border-white/10">
            <SelectValue placeholder="Select your body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-specified">Prefer not to specify</SelectItem>
            <SelectItem value="petite">Petite</SelectItem>
            <SelectItem value="athletic">Athletic</SelectItem>
            <SelectItem value="pear">Pear-shaped</SelectItem>
            <SelectItem value="hourglass">Hourglass</SelectItem>
            <SelectItem value="apple">Apple-shaped</SelectItem>
            <SelectItem value="rectangle">Rectangle</SelectItem>
            <SelectItem value="inverted-triangle">Inverted Triangle</SelectItem>
            <SelectItem value="plus-size">Plus Size</SelectItem>
            <SelectItem value="curvy">Curvy</SelectItem>
            <SelectItem value="slim">Slim</SelectItem>
            <SelectItem value="muscular">Muscular</SelectItem>
            <SelectItem value="tall">Tall</SelectItem>
            <SelectItem value="petite-curvy">Petite & Curvy</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Seasonal Preferences */}
      <div className="space-y-4">
        <Label>Seasonal Preferences</Label>
        <SeasonalPreferences
          value={preferences.seasonalPreferences || {
            spring: { enabled: true, temperatureRange: [10, 22] as [number, number] },
            summer: { enabled: true, temperatureRange: [20, 35] as [number, number] },
            autumn: { enabled: true, temperatureRange: [8, 20] as [number, number] },
            winter: { enabled: true, temperatureRange: [-5, 10] as [number, number] },
            all: { enabled: true, temperatureRange: [-10, 40] as [number, number] }
          }}
          onChange={handleSeasonalPreferencesChange}
        />
      </div>
    </div>
  );
};

export default StylePreferencesSection;

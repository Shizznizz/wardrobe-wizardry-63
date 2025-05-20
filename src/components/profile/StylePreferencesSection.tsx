
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertCircle, Check } from 'lucide-react';
import { UserPreferences } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SeasonalPreferences from '@/components/preferences/SeasonalPreferences';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  isValidColor,
  isDuplicate,
  getSuggestions,
  commonColors,
  commonStyleTags,
  commonOccasions,
  normalizeString
} from '@/utils/formValidation';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

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
  
  // Suggestions states
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [colorSuggestions, setColorSuggestions] = useState<string[]>([]);
  const [occasionSuggestions, setOccasionSuggestions] = useState<string[]>([]);
  
  // Popover states
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [occasionPopoverOpen, setOccasionPopoverOpen] = useState(false);
  
  // Input references for focusing
  const tagInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const occasionInputRef = useRef<HTMLInputElement>(null);
  
  // Update suggestions when input changes
  useEffect(() => {
    if (newTag) {
      setTagSuggestions(getSuggestions(newTag, commonStyleTags));
      setTagPopoverOpen(tagSuggestions.length > 0);
    } else {
      setTagPopoverOpen(false);
    }
  }, [newTag, tagSuggestions.length]);
  
  useEffect(() => {
    if (newColor) {
      setColorSuggestions(getSuggestions(newColor, commonColors));
      setColorPopoverOpen(colorSuggestions.length > 0);
    } else {
      setColorPopoverOpen(false);
    }
  }, [newColor, colorSuggestions.length]);
  
  useEffect(() => {
    if (newOccasion) {
      setOccasionSuggestions(getSuggestions(newOccasion, commonOccasions));
      setOccasionPopoverOpen(occasionSuggestions.length > 0);
    } else {
      setOccasionPopoverOpen(false);
    }
  }, [newOccasion, occasionSuggestions.length]);
  
  const isTagDuplicate = (tag: string): boolean => {
    return isDuplicate(preferences.personalityTags || [], tag);
  };
  
  const isColorDuplicate = (color: string): boolean => {
    return isDuplicate(preferences.favoriteColors || [], color);
  };
  
  const isOccasionDuplicate = (occasion: string): boolean => {
    return isDuplicate(preferences.occasionPreferences || [], occasion);
  };
  
  const addTag = (tagToAdd: string = newTag) => {
    const trimmedTag = tagToAdd.trim();
    if (!trimmedTag) {
      return;
    }
    
    if (isTagDuplicate(trimmedTag)) {
      setTagError("You've already added this tag");
      setTimeout(() => setTagError(''), 3000);
      return;
    }
    
    setTagError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        personalityTags: [...(prev.personalityTags || []), trimmedTag]
      };
    });
    setNewTag('');
    setTagPopoverOpen(false);
    tagInputRef.current?.focus();
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
  
  const addColor = (colorToAdd: string = newColor) => {
    const trimmedColor = colorToAdd.trim();
    if (!trimmedColor) {
      return;
    }
    
    if (!isValidColor(trimmedColor)) {
      setColorError("Please enter a valid color name");
      setTimeout(() => setColorError(''), 3000);
      return;
    }
    
    if (isColorDuplicate(trimmedColor)) {
      setColorError("You've already added this color");
      setTimeout(() => setColorError(''), 3000);
      return;
    }
    
    setColorError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: [...(prev.favoriteColors || []), trimmedColor]
      };
    });
    setNewColor('');
    setColorPopoverOpen(false);
    colorInputRef.current?.focus();
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
  
  const addOccasion = (occasionToAdd: string = newOccasion) => {
    const trimmedOccasion = occasionToAdd.trim();
    if (!trimmedOccasion) {
      return;
    }
    
    if (isOccasionDuplicate(trimmedOccasion)) {
      setOccasionError("You've already added this occasion");
      setTimeout(() => setOccasionError(''), 3000);
      return;
    }
    
    setOccasionError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        occasionPreferences: [...(prev.occasionPreferences || []), trimmedOccasion]
      };
    });
    setNewOccasion('');
    setOccasionPopoverOpen(false);
    occasionInputRef.current?.focus();
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
  
  // Handle keyboard navigation for suggestion lists
  const handleSuggestionKeyDown = (
    e: React.KeyboardEvent,
    suggestionsList: string[],
    addFunction: (suggestion: string) => void
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // The user would be able to navigate the suggestions with the keyboard
      // This would require additional DOM manipulation which we're omitting for simplicity
    } else if (e.key === 'Enter' && suggestionsList.length > 0) {
      e.preventDefault();
      addFunction(suggestionsList[0]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setTagPopoverOpen(false);
      setColorPopoverOpen(false);
      setOccasionPopoverOpen(false);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Style Tags Section */}
      <div className="space-y-4">
        <Label>Favorite Style Tags</Label>
        <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center">
              <Input
                ref={tagInputRef}
                placeholder="Add a style tag (e.g. casual, elegant, sporty)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-slate-950/50 border-white/10 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !tagSuggestions.length) {
                    e.preventDefault();
                    addTag();
                  } else {
                    handleSuggestionKeyDown(e, tagSuggestions, addTag);
                  }
                }}
              />
              <TooltipProvider>
                <Tooltip open={!!tagError} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => addTag()}
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
          </PopoverTrigger>
          {tagSuggestions.length > 0 && (
            <PopoverContent className="p-0 w-full bg-slate-800 border border-slate-700" align="start">
              <div className="py-1">
                {tagSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-white flex items-center justify-between"
                    onClick={() => {
                      addTag(suggestion);
                      setNewTag('');
                    }}
                  >
                    <span>{suggestion}</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </button>
                ))}
              </div>
            </PopoverContent>
          )}
        </Popover>
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
        <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center">
              <Input
                ref={colorInputRef}
                placeholder="Add a color (e.g. blue, emerald green, pastel pink)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="bg-slate-950/50 border-white/10 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !colorSuggestions.length) {
                    e.preventDefault();
                    addColor();
                  } else {
                    handleSuggestionKeyDown(e, colorSuggestions, addColor);
                  }
                }}
              />
              <TooltipProvider>
                <Tooltip open={!!colorError} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => addColor()}
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
          </PopoverTrigger>
          {colorSuggestions.length > 0 && (
            <PopoverContent className="p-0 w-full bg-slate-800 border border-slate-700" align="start">
              <div className="py-1">
                {colorSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-white flex items-center justify-between"
                    onClick={() => {
                      addColor(suggestion);
                      setNewColor('');
                    }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-2" 
                        style={{ backgroundColor: suggestion }}
                      ></div>
                      <span>{suggestion}</span>
                    </div>
                    <Check className="h-4 w-4 text-green-500" />
                  </button>
                ))}
              </div>
            </PopoverContent>
          )}
        </Popover>
        <div className="flex flex-wrap gap-2 mt-2">
          {preferences.favoriteColors?.map((color, index) => (
            <Badge 
              key={index} 
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 flex items-center"
            >
              <div 
                className="w-3 h-3 rounded-full mr-1.5" 
                style={{ backgroundColor: color }}
              ></div>
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
        <Popover open={occasionPopoverOpen} onOpenChange={setOccasionPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center">
              <Input
                ref={occasionInputRef}
                placeholder="Add an occasion (e.g. work, casual, formal)"
                value={newOccasion}
                onChange={(e) => setNewOccasion(e.target.value)}
                className="bg-slate-950/50 border-white/10 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !occasionSuggestions.length) {
                    e.preventDefault();
                    addOccasion();
                  } else {
                    handleSuggestionKeyDown(e, occasionSuggestions, addOccasion);
                  }
                }}
              />
              <TooltipProvider>
                <Tooltip open={!!occasionError} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => addOccasion()}
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
          </PopoverTrigger>
          {occasionSuggestions.length > 0 && (
            <PopoverContent className="p-0 w-full bg-slate-800 border border-slate-700" align="start">
              <div className="py-1">
                {occasionSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-white flex items-center justify-between"
                    onClick={() => {
                      addOccasion(suggestion);
                      setNewOccasion('');
                    }}
                  >
                    <span>{suggestion}</span>
                    <Check className="h-4 w-4 text-green-500" />
                  </button>
                ))}
              </div>
            </PopoverContent>
          )}
        </Popover>
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

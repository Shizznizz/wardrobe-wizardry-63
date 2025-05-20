
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertCircle } from 'lucide-react';
import { UserPreferences } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SeasonalPreferences from '@/components/preferences/SeasonalPreferences';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        personalityTags: [...(prev.personalityTags || []), newTag.trim()]
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
    
    setColorError('');
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: [...(prev.favoriteColors || []), newColor.trim()]
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
        occasionPreferences: [...(prev.occasionPreferences || []), newOccasion.trim()]
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
  
  return (
    <div className="space-y-8">
      {/* Style Tags Section */}
      <div className="space-y-4">
        <Label>Favorite Style Tags</Label>
        <div className="flex items-center">
          <Input
            placeholder="Add a style tag (e.g. casual, elegant, sporty)"
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
        <div className="flex items-center">
          <Input
            placeholder="Add a color (e.g. blue, emerald green, pastel pink)"
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
        <div className="flex items-center">
          <Input
            placeholder="Add an occasion (e.g. work, casual, formal)"
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

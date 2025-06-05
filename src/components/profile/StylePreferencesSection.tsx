import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { UserPreferences, ClothingColor } from '@/lib/types';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import StyleSyncButton from './StyleSyncButton';

interface StylePreferencesSectionProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences | null>>;
}

const StylePreferencesSection = ({ preferences, setPreferences }: StylePreferencesSectionProps) => {
  const [newColorInput, setNewColorInput] = React.useState('');
  const [newStyleInput, setNewStyleInput] = React.useState('');
  const [newTagInput, setNewTagInput] = React.useState('');
  const [newOccasionInput, setNewOccasionInput] = React.useState('');

  const colorOptions: ClothingColor[] = [
    'black', 'white', 'gray', 'brown', 'beige', 'navy', 'blue', 'red', 'pink', 
    'purple', 'green', 'yellow', 'orange', 'gold', 'silver', 'cream', 'maroon', 
    'teal', 'coral', 'lavender', 'mint', 'peach', 'burgundy', 'olive', 'turquoise'
  ];

  const bodyTypeOptions = [
    { value: 'not-specified', label: 'Prefer not to specify' },
    { value: 'pear', label: 'Pear' },
    { value: 'apple', label: 'Apple' },
    { value: 'hourglass', label: 'Hourglass' },
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'inverted-triangle', label: 'Inverted Triangle' }
  ];

  const handleAddColor = (color: string) => {
    if (color && !preferences.favoriteColors?.includes(color as ClothingColor)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          favoriteColors: [...(prev.favoriteColors || []), color as ClothingColor]
        };
      });
    }
    setNewColorInput('');
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteColors: prev.favoriteColors?.filter(color => color !== colorToRemove) || []
      };
    });
  };

  const handleAddStyle = (style: string) => {
    if (style && !preferences.favoriteStyles?.includes(style)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          favoriteStyles: [...(prev.favoriteStyles || []), style]
        };
      });
    }
    setNewStyleInput('');
  };

  const handleRemoveStyle = (styleToRemove: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        favoriteStyles: prev.favoriteStyles?.filter(style => style !== styleToRemove) || []
      };
    });
  };

  const handleAddPersonalityTag = (tag: string) => {
    if (tag && !preferences.personalityTags?.includes(tag)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          personalityTags: [...(prev.personalityTags || []), tag]
        };
      });
    }
    setNewTagInput('');
  };

  const handleRemovePersonalityTag = (tagToRemove: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        personalityTags: prev.personalityTags?.filter(tag => tag !== tagToRemove) || []
      };
    });
  };

  const handleAddOccasion = (occasion: string) => {
    if (occasion && !preferences.occasionPreferences?.includes(occasion)) {
      setPreferences(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          occasionPreferences: [...(prev.occasionPreferences || []), occasion]
        };
      });
    }
    setNewOccasionInput('');
  };

  const handleRemoveOccasion = (occasionToRemove: string) => {
    setPreferences(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        occasionPreferences: prev.occasionPreferences?.filter(occasion => occasion !== occasionToRemove) || []
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Style Preferences</h3>
        <p className="text-white/70 text-sm mb-4">
          Tell us about your style preferences to get personalized outfit recommendations.
        </p>
      </div>

      {/* Sync Button */}
      <StyleSyncButton preferences={preferences} setPreferences={setPreferences} />
      
      {/* Favorite Colors */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base">Favorite Colors</Label>
            <CardDescription className="text-sm text-white/60">
              Choose the colors you love to wear most
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {preferences.favoriteColors?.map((color) => (
              <Badge
                key={color}
                variant="outline"
                className="flex items-center gap-1 text-white border-white/20"
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: color === 'white' ? '#ffffff' : color }}
                />
                {color}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                  onClick={() => handleRemoveColor(color)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Select value={newColorInput} onValueChange={setNewColorInput}>
              <SelectTrigger className="bg-slate-950/50 border-white/10">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: color === 'white' ? '#ffffff' : color }}
                      />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleAddColor(newColorInput)}
              disabled={!newColorInput}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Styles */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base">Favorite Style Tags</Label>
            <CardDescription className="text-sm text-white/60">
              Describe your style preferences (e.g., minimalist, bohemian, streetwear)
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {preferences.favoriteStyles?.map((style) => (
              <Badge
                key={style}
                variant="outline"
                className="flex items-center gap-1 text-white border-white/20"
              >
                {style}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                  onClick={() => handleRemoveStyle(style)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter a style (e.g., casual, elegant)"
              value={newStyleInput}
              onChange={(e) => setNewStyleInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStyle(newStyleInput)}
              className="bg-slate-950/50 border-white/10"
            />
            <Button
              onClick={() => handleAddStyle(newStyleInput)}
              disabled={!newStyleInput}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personality Tags */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base">Key Elements</Label>
            <CardDescription className="text-sm text-white/60">
              Words that describe your style personality (e.g., bold, classic, creative)
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {preferences.personalityTags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="flex items-center gap-1 text-purple-300 border-purple-500/30"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                  onClick={() => handleRemovePersonalityTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter a personality trait"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPersonalityTag(newTagInput)}
              className="bg-slate-950/50 border-white/10"
            />
            <Button
              onClick={() => handleAddPersonalityTag(newTagInput)}
              disabled={!newTagInput}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Occasions */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base">Occasions You Dress For</Label>
            <CardDescription className="text-sm text-white/60">
              What events or activities do you regularly dress for?
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {preferences.occasionPreferences?.map((occasion) => (
              <Badge
                key={occasion}
                variant="outline"
                className="flex items-center gap-1 text-emerald-300 border-emerald-500/30"
              >
                {occasion}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-500/20"
                  onClick={() => handleRemoveOccasion(occasion)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter an occasion (e.g., work, casual, formal)"
              value={newOccasionInput}
              onChange={(e) => setNewOccasionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddOccasion(newOccasionInput)}
              className="bg-slate-950/50 border-white/10"
            />
            <Button
              onClick={() => handleAddOccasion(newOccasionInput)}
              disabled={!newOccasionInput}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Body Type */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label className="text-base">Body Type (Optional)</Label>
            <CardDescription className="text-sm text-white/60">
              This helps us suggest the most flattering fits
            </CardDescription>
          </div>
          
          <Select
            value={preferences.bodyType || 'not-specified'}
            onValueChange={(value) => setPreferences(prev => {
              if (!prev) return prev;
              return { ...prev, bodyType: value as any };
            })}
          >
            <SelectTrigger className="bg-slate-950/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bodyTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default StylePreferencesSection;

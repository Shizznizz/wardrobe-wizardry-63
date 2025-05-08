
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const colorOptions = [
  'Black', 'White', 'Gray', 'Blue', 'Red', 'Green', 
  'Yellow', 'Purple', 'Pink', 'Orange', 'Brown', 
  'Navy', 'Beige', 'Burgundy'
];

const styleOptions = [
  'Casual', 'Formal', 'Business', 'Streetwear', 
  'Minimalist', 'Vintage', 'Bohemian', 'Preppy',
  'Sporty', 'Gothic', 'Glam'
];

const occasionOptions = [
  'Work', 'Date Night', 'Casual Outing', 'Workout',
  'Formal Event', 'Beach Day', 'Travel', 'Home'
];

const PreferenceSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    favoriteColors: [] as string[],
    favoriteStyles: [] as string[],
    occasionPreferences: [] as string[]
  });

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('favorite_colors, favorite_styles, occasions_preferences')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setPreferences({
          favoriteColors: data.favorite_colors || [],
          favoriteStyles: data.favorite_styles || [],
          occasionPreferences: data.occasions_preferences || []
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Could not load your style preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { data: existingPrefs, error: checkError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      let upsertError;
      
      if (existingPrefs) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({
            favorite_colors: preferences.favoriteColors,
            favorite_styles: preferences.favoriteStyles,
            occasions_preferences: preferences.occasionPreferences
          })
          .eq('user_id', user.id);
        
        upsertError = error;
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            favorite_colors: preferences.favoriteColors,
            favorite_styles: preferences.favoriteStyles,
            occasions_preferences: preferences.occasionPreferences
          });
        
        upsertError = error;
      }
      
      if (upsertError) throw upsertError;
      
      toast.success('Style preferences saved');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Could not save your style preferences');
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = (item: string, category: 'favoriteColors' | 'favoriteStyles' | 'occasionPreferences') => {
    setPreferences(prev => {
      const current = [...prev[category]];
      
      if (current.includes(item)) {
        return {
          ...prev,
          [category]: current.filter(i => i !== item)
        };
      } else {
        return {
          ...prev,
          [category]: [...current, item]
        };
      }
    });
  };

  const removeItem = (item: string, category: 'favoriteColors' | 'favoriteStyles' | 'occasionPreferences') => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].filter(i => i !== item)
    }));
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/30 border-white/10">
      <CardHeader>
        <CardTitle>Style Preferences</CardTitle>
        <CardDescription>
          Set your style preferences for better recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label>Favorite Colors</Label>
          <div className="flex flex-wrap gap-2">
            {preferences.favoriteColors.map((color) => (
              <Badge 
                key={color}
                variant="secondary"
                className="flex items-center gap-1 py-1 px-3 bg-slate-800"
              >
                {color}
                <button
                  onClick={() => removeItem(color, 'favoriteColors')}
                  className="ml-1 hover:text-red-400 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="pt-2">
            <Label className="text-xs text-white/60 mb-2 block">Select colors to add:</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions
                .filter(color => !preferences.favoriteColors.includes(color))
                .map((color) => (
                  <Badge 
                    key={color} 
                    variant="outline" 
                    className="cursor-pointer border-white/20 hover:bg-white/10"
                    onClick={() => toggleItem(color, 'favoriteColors')}
                  >
                    {color}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Favorite Styles</Label>
          <div className="flex flex-wrap gap-2">
            {preferences.favoriteStyles.map((style) => (
              <Badge 
                key={style}
                variant="secondary"
                className="flex items-center gap-1 py-1 px-3 bg-slate-800"
              >
                {style}
                <button
                  onClick={() => removeItem(style, 'favoriteStyles')}
                  className="ml-1 hover:text-red-400 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="pt-2">
            <Label className="text-xs text-white/60 mb-2 block">Select styles to add:</Label>
            <div className="flex flex-wrap gap-2">
              {styleOptions
                .filter(style => !preferences.favoriteStyles.includes(style))
                .map((style) => (
                  <Badge 
                    key={style} 
                    variant="outline" 
                    className="cursor-pointer border-white/20 hover:bg-white/10"
                    onClick={() => toggleItem(style, 'favoriteStyles')}
                  >
                    {style}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Common Occasions</Label>
          <div className="flex flex-wrap gap-2">
            {preferences.occasionPreferences.map((occasion) => (
              <Badge 
                key={occasion}
                variant="secondary"
                className="flex items-center gap-1 py-1 px-3 bg-slate-800"
              >
                {occasion}
                <button
                  onClick={() => removeItem(occasion, 'occasionPreferences')}
                  className="ml-1 hover:text-red-400 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="pt-2">
            <Label className="text-xs text-white/60 mb-2 block">Select occasions to add:</Label>
            <div className="flex flex-wrap gap-2">
              {occasionOptions
                .filter(occasion => !preferences.occasionPreferences.includes(occasion))
                .map((occasion) => (
                  <Badge 
                    key={occasion} 
                    variant="outline" 
                    className="cursor-pointer border-white/20 hover:bg-white/10"
                    onClick={() => toggleItem(occasion, 'occasionPreferences')}
                  >
                    {occasion}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSavePreferences} 
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferenceSettings;

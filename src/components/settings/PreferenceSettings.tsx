import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import QuizModal from '@/components/quizzes/QuizModal';
import FindYourStyleQuiz from '@/components/quizzes/FindYourStyleQuiz';
import LifestyleLensQuiz from '@/components/quizzes/LifestyleLensQuiz';
import VibeCheckQuiz from '@/components/quizzes/VibeCheckQuiz';
import FashionTimeMachineQuiz from '@/components/quizzes/FashionTimeMachineQuiz';
import { UserPreferences } from '@/lib/types';

interface PreferenceSettingsProps {
  onPreferencesUpdated?: () => void;
}

const PreferenceSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState<string>('not-specified');
  const [occasionPreferences, setOccasionPreferences] = useState<string[]>([]);
  const [styleQuizResult, setStyleQuizResult] = useState<any>(null);
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
    if (document.documentElement.classList.contains('dark') !== isDarkMode) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      if (!user) {
        console.warn("User not available, can't load preferences.");
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("Error fetching user preferences:", error);
        return;
      }

      if (data) {
        setIsDarkMode(data.is_dark_mode ?? false);
        setNotificationsEnabled(data.notifications_enabled ?? true);
        setFavoriteColors(data.favorite_colors ?? []);
        setBodyType(data.body_type ?? 'not-specified');
        setOccasionPreferences(data.occasion_preferences ?? []);
        setStyleQuizResult(data.style_quiz_result ?? null);
        setBio(data.bio ?? '');
      }
    } catch (error) {
      console.error("Unexpected error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      if (!user) {
        toast.error("You must be logged in to save preferences.");
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          is_dark_mode: isDarkMode,
          notifications_enabled: notificationsEnabled,
          favorite_colors: favoriteColors,
          body_type: bodyType,
          occasion_preferences: occasionPreferences,
          style_quiz_result: styleQuizResult,
          bio: bio,
        }, { onConflict: 'user_id' });

      if (error) {
        console.error("Error saving user preferences:", error);
        toast.error("Failed to save preferences.");
        return;
      }

      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Unexpected error saving preferences:", error);
      toast.error("Something went wrong saving preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value.toLowerCase();
    if (!favoriteColors.includes(color)) {
      setFavoriteColors([...favoriteColors, color]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    setFavoriteColors(favoriteColors.filter(color => color !== colorToRemove));
  };

  const handleOccasionChange = (occasion: string) => {
    if (occasionPreferences.includes(occasion)) {
      setOccasionPreferences(occasionPreferences.filter(o => o !== occasion));
    } else {
      setOccasionPreferences([...occasionPreferences, occasion]);
    }
  };

  const handleBodyTypeChange = (value: string) => {
    setBodyType(value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const startQuiz = (quizType: string) => {
    switch (quizType) {
      case 'style':
        setActiveQuiz(FindYourStyleQuiz());
        break;
      case 'lifestyle':
        setActiveQuiz(LifestyleLensQuiz());
        break;
      case 'vibe':
        setActiveQuiz(VibeCheckQuiz());
        break;
      case 'timeMachine':
        setActiveQuiz(FashionTimeMachineQuiz());
        break;
      default:
        setActiveQuiz(null);
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-12"
    >
      <Card className="bg-gradient-to-br from-slate-900/70 to-indigo-900/40 border-purple-500/20 shadow-xl backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-2xl font-semibold">Preference Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-white/70">Loading preferences...</p>
          ) : (
            <div className="space-y-6">
              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="text-white/80">Dark Mode</Label>
                <Switch id="darkMode" checked={isDarkMode} onCheckedChange={(checked) => setIsDarkMode(checked)} />
              </div>
              <Separator className="bg-white/10" />

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-white/80">Notifications</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                />
              </div>
              <Separator className="bg-white/10" />

              {/* Favorite Colors */}
              <div>
                <Label className="text-white/80">Favorite Colors</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="color"
                    className="w-10 h-10"
                    onChange={handleColorChange}
                  />
                  <Input
                    type="text"
                    placeholder="Add a color (e.g., blue)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const color = (e.target as HTMLInputElement).value.toLowerCase();
                        if (color && !favoriteColors.includes(color)) {
                          setFavoriteColors([...favoriteColors, color]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="bg-transparent border-white/20 text-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {favoriteColors.map((color) => (
                    <Badge
                      key={color}
                      variant="secondary"
                      className="cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => removeColor(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator className="bg-white/10" />

              {/* Body Type */}
              <div>
                <Label className="text-white/80">Body Type</Label>
                <Select value={bodyType} onValueChange={handleBodyTypeChange}>
                  <SelectTrigger className="bg-transparent border-white/20 text-white w-full">
                    <SelectValue placeholder="Select your body type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                    <SelectItem value="not-specified">Not Specified</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="pear">Pear</SelectItem>
                    <SelectItem value="hourglass">Hourglass</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="inverted-triangle">Inverted Triangle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-white/10" />

              {/* Occasion Preferences */}
              <div>
                <Label className="text-white/80">Occasion Preferences</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Casual', 'Work', 'Party', 'Formal', 'Outdoor', 'Travel'].map((occasion) => (
                    <Button
                      key={occasion}
                      variant="outline"
                      className={occasionPreferences.includes(occasion) ? 'bg-purple-500/20 hover:bg-purple-500/30' : 'hover:bg-purple-500/10'}
                      onClick={() => handleOccasionChange(occasion)}
                    >
                      {occasion}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="bg-white/10" />

              {/* Bio */}
              <div>
                <Label className="text-white/80">Bio</Label>
                <Textarea
                  placeholder="Tell us a bit about yourself..."
                  className="bg-transparent border-white/20 text-white"
                  value={bio}
                  onChange={handleBioChange}
                />
              </div>
              <Separator className="bg-white/10" />

              {/* Style Quiz */}
              <div>
                <Label className="text-white/80">Style Quiz</Label>
                <p className="text-white/70 text-sm mb-2">Take our style quiz to get personalized recommendations.</p>
                <Button onClick={() => startQuiz('style')}>Take Style Quiz</Button>
                <Button onClick={() => startQuiz('lifestyle')}>Take Lifestyle Quiz</Button>
                 <Button onClick={() => startQuiz('vibe')}>Take Vibe Check Quiz</Button>
                 <Button onClick={() => startQuiz('timeMachine')}>Take Fashion Time Machine Quiz</Button>
              </div>

              <Button
                onClick={savePreferences}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {activeQuiz && (
        <QuizModal
          isOpen={true}
          onClose={() => setActiveQuiz(null)}
          onComplete={() => {
            setActiveQuiz(null);
            loadPreferences(); // Reload preferences after quiz completion
          }}
          quiz={activeQuiz}
        />
      )}
    </motion.div>
  );
};

export default PreferenceSettings;

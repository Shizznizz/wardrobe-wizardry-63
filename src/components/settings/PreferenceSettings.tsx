
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Edit, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getUserQuizResults, QuizResult } from '@/services/QuizService';
import QuizModal from '@/components/quizzes/QuizModal';
import FindYourStyleQuiz from '@/components/quizzes/FindYourStyleQuiz';
import LifestyleLensQuiz from '@/components/quizzes/LifestyleLensQuiz';
import VibeCheckQuiz from '@/components/quizzes/VibeCheckQuiz';
import FashionTimeMachineQuiz from '@/components/quizzes/FashionTimeMachineQuiz';

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
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    favoriteColors: [] as string[],
    favoriteStyles: [] as string[],
    occasionPreferences: [] as string[]
  });

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
      fetchQuizResults();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    if (!user) return;
    
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
    }
  };

  const fetchQuizResults = async () => {
    try {
      const results = await getUserQuizResults();
      setQuizResults(results);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      toast.error('Could not load your quiz results');
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

  const getQuizResult = (quizId: string) => {
    return quizResults.find(result => result.quizId === quizId);
  };

  const openQuiz = (quizId: string) => {
    setActiveQuiz(quizId);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    fetchQuizResults();
  };

  const getQuizComponent = (quizId: string | null) => {
    switch (quizId) {
      case 'find-your-style':
        return FindYourStyleQuiz();
      case 'lifestyle-lens':
        return LifestyleLensQuiz();
      case 'vibe-check':
        return VibeCheckQuiz();
      case 'fashion-time-machine':
        return FashionTimeMachineQuiz();
      default:
        return null;
    }
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

  const styleTypeQuiz = getQuizResult('find-your-style');
  const lifestyleTypeQuiz = getQuizResult('lifestyle-lens');
  const vibeProfileQuiz = getQuizResult('vibe-check');
  const styleHistoryQuiz = getQuizResult('fashion-time-machine');

  return (
    <>
      <Card className="bg-slate-800/30 border-white/10 mb-8">
        <CardHeader>
          <CardTitle>Your Style Profile</CardTitle>
          <CardDescription>
            Quiz results that help Olivia understand your style preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Style Identity</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => openQuiz('find-your-style')}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                {styleTypeQuiz ? <Edit className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {styleTypeQuiz ? 'Edit' : 'Take Quiz'}
              </Button>
            </div>
            {styleTypeQuiz ? (
              <div className="p-4 rounded-md bg-purple-500/10 border border-purple-500/20">
                <p className="font-semibold text-purple-300 text-lg mb-1">{styleTypeQuiz.resultValue.styleType}</p>
                <p className="text-sm text-white/70">
                  Your personal style combines {styleTypeQuiz.resultValue.mainColors?.join(', ')} colors and focuses on {styleTypeQuiz.resultValue.preferredItems?.join(', ')}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-md bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Take the "Find Your Style" quiz to discover your style identity</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Lifestyle Type</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => openQuiz('lifestyle-lens')}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                {lifestyleTypeQuiz ? <Edit className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {lifestyleTypeQuiz ? 'Edit' : 'Take Quiz'}
              </Button>
            </div>
            {lifestyleTypeQuiz ? (
              <div className="p-4 rounded-md bg-purple-500/10 border border-purple-500/20">
                <p className="font-semibold text-purple-300 text-lg mb-1">{lifestyleTypeQuiz.resultValue.lifestyleType}</p>
                <p className="text-sm text-white/70">
                  Your lifestyle focuses on {lifestyleTypeQuiz.resultValue.occasions?.join(', ')} occasions and needs clothing that is {lifestyleTypeQuiz.resultValue.clothingFocus?.join(', ')}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-md bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Take the "Lifestyle Lens" quiz to determine your lifestyle needs</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Vibe Profile</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => openQuiz('vibe-check')}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                {vibeProfileQuiz ? <Edit className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {vibeProfileQuiz ? 'Edit' : 'Take Quiz'}
              </Button>
            </div>
            {vibeProfileQuiz ? (
              <div className="p-4 rounded-md bg-purple-500/10 border border-purple-500/20">
                <p className="font-semibold text-purple-300 text-lg mb-1">{vibeProfileQuiz.resultValue.vibeProfile}</p>
                <p className="text-sm text-white/70">
                  Your vibe is characterized by {vibeProfileQuiz.resultValue.expressionStyle} expression with {vibeProfileQuiz.resultValue.keyElements?.join(', ')} as key elements
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-md bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Take the "Vibe Check" quiz to define your personal vibe</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fashion History</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => openQuiz('fashion-time-machine')}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                {styleHistoryQuiz ? <Edit className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {styleHistoryQuiz ? 'Edit' : 'Take Quiz'}
              </Button>
            </div>
            {styleHistoryQuiz ? (
              <div className="p-4 rounded-md bg-purple-500/10 border border-purple-500/20">
                <p className="font-semibold text-purple-300 text-lg mb-1">{styleHistoryQuiz.resultValue.styleHistory}</p>
                <p className="text-sm text-white/70">
                  You're influenced by {styleHistoryQuiz.resultValue.eraInfluences?.join(' & ')} eras and love elements like {styleHistoryQuiz.resultValue.revivalElements?.join(', ')}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-md bg-white/5 border border-white/10 text-center">
                <p className="text-white/60">Take the "Fashion Time Machine" quiz to reveal your fashion history</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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

      {activeQuiz && (
        <QuizModal
          isOpen={true}
          onClose={closeQuiz}
          quiz={getQuizComponent(activeQuiz)!}
        />
      )}
    </>
  );
};

export default PreferenceSettings;

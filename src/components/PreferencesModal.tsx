
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Loader2, Settings, Sparkles, ThumbsUp } from 'lucide-react';
import { ClothingColor, ClothingSeason, UserPreferences } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { saveUserPreferences } from '@/integrations/supabase/client';
import PreferencesHeader from './preferences/PreferencesHeader';
import ColorStyleSection from './preferences/ColorStyleSection';
import SeasonalSection from './preferences/SeasonalSection';
import RemindersSection from './preferences/RemindersSection';
import WeatherLocationSection from './preferences/WeatherLocationSection';
import OliviaAIRecommendation from './preferences/OliviaAIRecommendation';

interface PreferencesModalProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  buttonClassName?: string;
  buttonVariant?: string;
}

const PreferencesModal = ({ 
  preferences, 
  onSave, 
  buttonClassName, 
  buttonVariant = "outline" 
}: PreferencesModalProps) => {
  const [open, setOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("style");
  const { user } = useAuth();

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Generate recommendations based on current preferences
  const handleGenerateRecommendations = () => {
    toast.info("Olivia is analyzing your style...", {
      duration: 2000,
    });
    
    // Simulate AI processing time
    setTimeout(() => {
      // This would ideally be connected to a real AI recommendation engine
      const recommendedColors: ClothingColor[] = ['black', 'navy', 'white', 'gray'];
      const recommendedStyles = ['smart casual', 'minimalist', 'business casual'];
      
      setLocalPreferences(prev => ({
        ...prev,
        favoriteColors: recommendedColors,
        favoriteStyles: recommendedStyles,
      }));
      
      toast.success("Olivia has suggested preferences based on your style profile!", {
        icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      });
    }, 2500);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (user) {
        // Save preferences to Supabase if user is authenticated
        const { success, error } = await saveUserPreferences(user.id, localPreferences);
        
        if (success) {
          onSave(localPreferences);
          toast.success('Preferences saved successfully', {
            icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
            description: "Olivia will use these to style your outfits!"
          });
          setOpen(false);
        } else {
          toast.error('Error saving preferences to server');
          console.error(error);
        }
      } else {
        // Just save locally if user is not authenticated
        onSave(localPreferences);
        toast.success('Preferences saved locally', {
          icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
          description: "Your style choices are saved!"
        });
        setOpen(false);
      }
    } catch (error) {
      toast.error('Error saving preferences');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          className="w-full sm:w-auto"
        >
          <Button 
            variant={buttonVariant as any} 
            className={`space-x-2 ${buttonClassName || ''} w-full`}
          >
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border-purple-500/20">
        <DialogHeader className="p-6 border-b border-purple-500/20">
          <DialogTitle className="text-xl font-semibold text-white">Your Style Preferences</DialogTitle>
        </DialogHeader>
        
        <PreferencesHeader />
        
        <div className="max-h-[70vh] overflow-hidden">
          <Tabs defaultValue="style" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-4">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="style">Style & Colors</TabsTrigger>
                <TabsTrigger value="seasons">Seasons</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[50vh] px-6">
              <div className="py-4 space-y-6">
                <TabsContent value="style" className="mt-0">
                  <ColorStyleSection 
                    preferences={localPreferences}
                    setPreferences={setLocalPreferences}
                  />
                </TabsContent>
                
                <TabsContent value="seasons" className="mt-0">
                  <SeasonalSection
                    preferences={localPreferences}
                    setPreferences={setLocalPreferences}
                  />
                </TabsContent>
                
                <TabsContent value="reminders" className="mt-0">
                  <RemindersSection
                    preferences={localPreferences}
                    setPreferences={setLocalPreferences}
                  />
                </TabsContent>
                
                <TabsContent value="location" className="mt-0">
                  <WeatherLocationSection
                    preferences={localPreferences}
                    setPreferences={setLocalPreferences}
                  />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
        
        <OliviaAIRecommendation 
          onGenerateRecommendations={handleGenerateRecommendations} 
        />
        
        <DialogFooter className="px-6 py-4 border-t border-purple-500/20 bg-slate-900/50">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-white/20 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;

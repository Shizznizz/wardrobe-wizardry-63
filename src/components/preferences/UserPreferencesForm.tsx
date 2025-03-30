
import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Palette, 
  Shirt, 
  Cloud, 
  Calendar, 
  Bell, 
  Sparkles,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserPreferences, ClothingColor, ClothingSeason, PersonalityTag } from '@/lib/types';
import ColorPreferences from './ColorPreferences';
import StylePreferences from './StylePreferences';
import SeasonalPreferences from './SeasonalPreferences';
import ReminderPreferences from './ReminderPreferences';
import OccasionPreferences from './OccasionPreferences';
import ClimatePreferences from './ClimatePreferences';

// Extend the UserPreferences type with the new fields
const formSchema = z.object({
  favoriteColors: z.array(z.string()),
  favoriteStyles: z.array(z.string()),
  personalityTags: z.array(z.string()).optional(),
  seasonalPreferences: z.record(z.object({
    enabled: z.boolean(),
    temperatureRange: z.tuple([z.number(), z.number()]),
    timeOfYear: z.tuple([z.number(), z.number()]).optional()
  })),
  outfitReminders: z.boolean(),
  reminderTime: z.string(),
  occasionPreferences: z.array(z.string()).optional(),
  climatePreferences: z.array(z.string()).optional()
});

interface UserPreferencesFormProps {
  initialPreferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onCancel?: () => void;
}

const UserPreferencesForm = ({ initialPreferences, onSave, onCancel }: UserPreferencesFormProps) => {
  const [activeTab, setActiveTab] = useState("colors");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserPreferences>({
    resolver: zodResolver(formSchema),
    defaultValues: initialPreferences,
  });

  const handleSubmit = async (data: UserPreferences) => {
    setIsSubmitting(true);
    try {
      // Make a copy of the data to ensure all fields have proper types
      const typedData: UserPreferences = {
        ...data,
        favoriteColors: data.favoriteColors as ClothingColor[],
      };
      await onSave(typedData);
      toast.success("Your preferences have been saved!");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save your preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="w-4 h-4" /> 
                <span className="hidden sm:inline">Colors</span>
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                <span className="hidden sm:inline">Styles</span>
              </TabsTrigger>
              <TabsTrigger value="seasons" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Seasons</span>
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Reminders</span>
              </TabsTrigger>
              <TabsTrigger value="occasions" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Occasions</span>
              </TabsTrigger>
              <TabsTrigger value="climate" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span className="hidden sm:inline">Climate</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="favoriteColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Choose your favorite colors</FormLabel>
                    <FormControl>
                      <ColorPreferences 
                        value={field.value as ClothingColor[]} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="styles" className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="favoriteStyles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Select your favorite clothing styles</FormLabel>
                    <FormControl>
                      <StylePreferences 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalityTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Your style personality</FormLabel>
                    <FormControl>
                      <StylePreferences 
                        value={field.value as string[] || []} 
                        onChange={field.onChange}
                        isPersonalityTags={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="seasons" className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="seasonalPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Set your seasonal preferences</FormLabel>
                    <FormControl>
                      <SeasonalPreferences 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="reminders" className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="outfitReminders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Daily outfit reminders</FormLabel>
                    <FormControl>
                      <ReminderPreferences 
                        enabled={field.value} 
                        onToggle={field.onChange}
                        reminderTime={form.watch("reminderTime")}
                        onTimeChange={(time) => form.setValue("reminderTime", time)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="occasions" className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="occasionPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Preferences for specific occasions</FormLabel>
                    <FormControl>
                      <OccasionPreferences 
                        value={field.value as string[] || []} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="climate" className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="climatePreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Climate preferences (optional)</FormLabel>
                    <FormControl>
                      <ClimatePreferences 
                        value={field.value as string[] || []} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserPreferencesForm;
